import axios, { AxiosResponse } from 'axios';
import { useCallback, useContext } from 'react';
import { API_BASE_URL, API_VERSION, APP_WAIT_TIME, FIAT_CURRENCIES, PaymentType, SATS_MSAT } from '../utilities/constants';
import logger from '../services/logger.service';
import { AppContext } from '../store/AppContext';
import { ApplicationConfiguration } from '../types/app-config.type';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

let intervalID;
let localAuthStatus: any = null;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL + API_VERSION,
  timeout: APP_WAIT_TIME * 5,
  withCredentials: true
});

const useHttp = () => {
  let appCtx = useContext(AppContext);

  const initiateDataLoading = () => {
    getConnectWallet();
    fetchData();
    if (intervalID) { window.clearInterval(intervalID); }
    intervalID = window.setInterval(() => {
      logger.info('Current Auth Status: ', JSON.stringify(localAuthStatus));
      // Check if the user has logged out before next data refresh
      if (localAuthStatus?.isAuthenticated) {
        fetchData();
      }
    }, APP_WAIT_TIME);
  };

  const getFiatRate = useCallback((fiatUnit: string) => {
    return axiosInstance.get('/shared/rate/' + fiatUnit)
    .then((response: any) => {
      const foundCurrency = FIAT_CURRENCIES.find(curr => curr.currency === fiatUnit);
      appCtx.setFiatConfig({ ...response.data, isLoading: false, symbol: (foundCurrency ? foundCurrency.symbol : faDollarSign), error: null });
    }).catch(err => {
      appCtx.setFiatConfig({ isLoading: false, symbol: faDollarSign, rate: 1, venue: '', error: err.response && err.response.data ? err.response.data : ''});
    });
  }, [appCtx]);

  const sendRequestToSetStore = useCallback((setStoreFunction: any, method: string, url: string, ...reqBody: any[]) => {
    try {
      let requests: Promise<AxiosResponse<any, any>>[];

      if (reqBody.length > 0) {
        requests = reqBody.map((body: any) => axiosInstance(url, { method: method, data: body }));
      } else {
        requests = [axiosInstance(url, { method: method, data: reqBody})];
      }

      Promise.all(requests)
        .then((responses: any[]) => {
          logger.info(responses);
          if (url === '/shared/config') {
            getFiatRate(responses[0].data.fiatUnit); // shared/config will always only have 1 response
          }

          const combinedResponses = responses.map(response => ({ ...response.data, ...{ isLoading: false, error: null } }));

          if (combinedResponses.length === 1) {
            setStoreFunction({ ...responses[0].data, ...{ isLoading: false, error: null }});
          } else if (combinedResponses.length > 1) {
            setStoreFunction(responses.map(response => ({ ...response.data })));
          } else {
            //no-op
          }
        })
    } catch (err: any) {
      logger.error(err);
      setStoreFunction({ isLoading: false, error: err });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFiatRate]);

  const fetchData = useCallback(() => {
    sendRequestToSetStore(appCtx.setNodeInfo, 'post', '/cln/call', { 'method': 'getinfo', 'params': [] });
    sendRequestToSetStore(appCtx.setListPeers, 'post', '/cln/call', { 'method': 'listpeers', 'params': [] });
    sendRequestToSetStore(appCtx.setListInvoices, 'post', '/cln/call', { 'method': 'listinvoices', 'params': [] });
    sendRequestToSetStore(
      appCtx.setChannels,
      'post',
      '/cln/call',
      { 'method': 'listpeerchannels', 'params': [] },
      { 'method': 'listnodes', 'params': [] });
    sendRequestToSetStore(appCtx.setListPayments, 'post', '/cln/call', { 'method': 'listsendpays', 'params': [] });
    sendRequestToSetStore(appCtx.setListFunds, 'post', '/cln/call', { 'method': 'listfunds', 'params': [] });
    sendRequestToSetStore(appCtx.setListOffers, 'post', '/cln/call', { 'method': 'listoffers', 'params': [] });
    sendRequestToSetStore(appCtx.setListBitcoinTransactions, 'post', '/cln/call', { 'method': 'bkpr-listaccountevents', 'params': [] });
    sendRequestToSetStore(appCtx.setFeeRate, 'post', '/cln/call', { 'method': 'feerates', 'params': ['perkb'] });
  }, [appCtx, sendRequestToSetStore]);

  const updateConfig = (updatedConfig: ApplicationConfiguration) => {
    axiosInstance.post('/shared/config', updatedConfig)
    .then((response: any) => {
      if(appCtx.appConfig.fiatUnit !== updatedConfig.fiatUnit) {
        getFiatRate(updatedConfig.fiatUnit);
      }
      appCtx.setConfig(updatedConfig);
    }).catch(err => {
      logger.error(err);
      return err;
    });
  }

  const sendRequest = useCallback((flgRefreshData: boolean, method: string, url: string, reqBody: any = null) => {
    try {
      return axiosInstance(url, {method: method, data: reqBody, timeout: 50000}).then(res => {
        if (flgRefreshData) { fetchData(); }
        return res;
      }).catch(err => {
        logger.error(err);
        return err;
      });
    } catch (err: any) {
      logger.error(err);
      return err;
    }
  }, [fetchData]);

  const openChannel = (pubkey: string, amount: number, feeRate: string, announce: boolean) => {
    return sendRequest(true, 'post', '/cln/call', { 'method': 'fundchannel', 'params': { 'id': pubkey, 'amount': amount, 'feerate': feeRate, 'announce': announce } });
  };

  const closeChannel = (channelId: string) => {
    return sendRequest(true, 'post', '/cln/call', { 'method': 'close', 'params': { 'id': channelId } });
  };

  const btcWithdraw = (address: string, amount: string, feeRate: string) => {
    return sendRequest(true, 'post', '/cln/call', { 'method': 'withdraw', 'params': { 'destination': address, 'satoshi': amount, 'feerate': feeRate } });
  };

  const btcDeposit = () => {
    return sendRequest(false, 'post', '/cln/call', { 'method': 'newaddr', 'params': { 'addresstype': 'bech32' } });
  };

  const clnSendPayment = (paymentType: PaymentType, invoice: string, amount: number | null) => {
    if (paymentType === PaymentType.KEYSEND) {
      return sendRequest(true, 'post', '/cln/call', { 'method': 'keysend', 'params': { 'destination': invoice, 'amount_msat': amount } });
    } else {
      // Same pay method can be used for bolt11 & offers
      let sendPayParams = !amount ? { 'bolt11': invoice } : { 'bolt11': invoice, 'amount_msat': amount }
      return sendRequest(true, 'post', '/cln/call', { 'method': 'pay', 'params': sendPayParams });
    }
  };

  const clnReceiveInvoice = (invoiceType: PaymentType, amount: number | string, description: string, label: string) => {
    if (invoiceType === PaymentType.OFFER) {
      return sendRequest(false, 'post', '/cln/call', { 'method': 'offer', 'params': { 'amount': amount, 'description': description } });
    } else {
      return sendRequest(false, 'post', '/cln/call', { 'method': 'invoice', 'params': { 'amount_msat': amount, 'label': label, 'description': description } });
    }
  };

  const decodeInvoice = (invoice: string) => {
    return sendRequest(false, 'post', '/cln/call', { 'method': 'decode', 'params': [ invoice ] });
  };

  const fetchInvoice = (offer: string, amount: number) => {
    return sendRequest(false, 'post', '/cln/call', { 'method': 'fetchinvoice', 'params': { 'offer': offer, 'amount_msat': amount * SATS_MSAT } });
  };

  const setCSRFToken = () => {
    return new Promise((resolve, reject) => {
      try {
        logger.info('Base URL: ' + API_BASE_URL + API_VERSION);
        return axiosInstance.get('/shared/csrf').then(res => {
          axiosInstance.defaults.headers.post = { 'XSRF-TOKEN': res.data.csrfToken };
          resolve(true);
        }).catch(err => {
          logger.error(err);
          reject(err);
        });
      } catch (err: any) {
        logger.error(err);
        reject(err);
      }
    });
  };

  const getAppConfigurations = useCallback(() => {
    sendRequestToSetStore(appCtx.setConfig, 'get', '/shared/config');
  }, [appCtx, sendRequestToSetStore]);

  const getConnectWallet = useCallback(() => {
    sendRequestToSetStore(appCtx.setWalletConnect, 'get', '/shared/connectwallet');
  }, [appCtx, sendRequestToSetStore]);

  const userLogin = (password: string) => {
    return axiosInstance.post('/auth/login', {password: password})
    .then((response: any) => {
      logger.info(response);
      appCtx.setAuthStatus(response.data);
      localAuthStatus = response.data;
      return response.data;
    }).catch(err => {
      logger.error(err);
      throw err;
    });
  };

  const resetUserPassword = (isValid: boolean, currPassword: string, newPassword: string) => {
    return axiosInstance.post('/auth/reset', {isValid: isValid, currPassword: currPassword, newPassword: newPassword})
    .then((response: any) => {
      logger.info(response);
      appCtx.setAuthStatus(response.data);
      localAuthStatus = response.data;
      return response.data;
    }).catch(err => {
      logger.error(err);
      throw err;
    });
  };

  const userLogout = () => {
    return axiosInstance.get('/auth/logout')
    .then((response: any) => {
      logger.info(response);
      appCtx.clearStore();
      localAuthStatus = JSON.parse(JSON.stringify(response.data));
      appCtx.setShowModals({...appCtx.showModals, loginModal: true, logoutModal: false});
    }).catch(err => {
      logger.error(err);
      throw err;
    });
  };

  const getAuthStatus = () => {
    return axiosInstance.post('/auth/isauthenticated', { returnResponse: true })
    .then((response: any) => {
      logger.info(response);
      appCtx.setAuthStatus(response.data);
      localAuthStatus = response.data;
      return response.data;
    }).catch(err => {
      logger.error(err);
      throw err;
    });
  };

  return {
    setCSRFToken,
    getAuthStatus,
    getAppConfigurations,
    initiateDataLoading,
    getConnectWallet,
    fetchData,
    getFiatRate,
    updateConfig,
    openChannel,
    closeChannel,
    btcWithdraw,
    btcDeposit,
    clnSendPayment,
    clnReceiveInvoice,
    decodeInvoice,
    fetchInvoice,
    userLogin,
    resetUserPassword,
    userLogout
  };
};

export default useHttp;
