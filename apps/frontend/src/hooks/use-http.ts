import axios from 'axios';
import { useCallback, useContext } from 'react';
import { API_BASE_URL, API_VERSION, APP_WAIT_TIME, FIAT_CURRENCIES, PaymentType, SATS_MSAT } from '../utilities/constants';
import logger from '../services/logger.service';
import { AppContext } from '../store/AppContext';
import { ApplicationConfiguration } from '../types/app-config.type';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL + API_VERSION,
  timeout: APP_WAIT_TIME * 5,
  withCredentials: true
});

const useHttp = () => {
  const appCtx = useContext(AppContext);

  const getFiatRate = useCallback((fiatUnit: string) => {
    return axiosInstance.get('/shared/rate/' + fiatUnit)
    .then((response: any) => {
      const foundCurrency = FIAT_CURRENCIES.find(curr => curr.currency === fiatUnit);
      appCtx.setFiatConfig({ ...response.data, isLoading: false, symbol: (foundCurrency ? foundCurrency.symbol : faDollarSign), error: null });
    }).catch(err => {
      appCtx.setFiatConfig({ isLoading: false, symbol: faDollarSign, rate: 1, venue: '', error: err.response && err.response.data ? err.response.data : ''});
    });
  }, [appCtx]);

  const sendRequestToSetStore = useCallback((setStoreFunction: any, method: string, url: string, reqBody: any = null) => {
    try {
      axiosInstance(url, {method: method, data: reqBody}).then((response: any) => {
        logger.info(response);
        if(url === '/shared/config') {
          getFiatRate(response.data.fiatUnit);
          fetchData();
        }
        setStoreFunction({...response.data, ...{ isLoading: false, error: null }});
      })
      .catch(err => {
        logger.error(err);
        if(url === '/shared/config') {
          getFiatRate('USD');
        } else {
          (err.code === 'ECONNABORTED') ?
            setStoreFunction({ isLoading: false, error: 'Request timedout! Verify that CLN node is working!' }) :
          (err.response && err.response.data) ?
            setStoreFunction({ isLoading: false, error: err.response.data }) :
            (!err.response && err.message) ?
              setStoreFunction({ isLoading: false, error: err.message }) :
              setStoreFunction({ isLoading: false, error: JSON.stringify(err) })
        }
      });
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
    sendRequestToSetStore(appCtx.setWalletConnect, 'get', '/shared/connectwallet');
  }, [appCtx, sendRequestToSetStore]);
  
  const userLogin = (password: string) => {
    return axiosInstance.post('/auth/login', {password: password})
    .then((response: any) => {
      logger.info(response);
      appCtx.setIsAuthenticated(response);
      return response;
    }).catch(err => {
      logger.error(err);
      throw err;
    });
  };

  const resetPassword = (currPassword: string, newPassword: string) => {
    return axiosInstance.post('/auth/login', {currPassword: currPassword, newPassword: newPassword})
    .then((response: any) => {
      logger.info(response);
      appCtx.setIsAuthenticated(response);
      return response;
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
      appCtx.setShowModals({...appCtx.showModals, loginModal: true});
    }).catch(err => {
      logger.error(err);
      throw err;
    });
  };

  const isUserAuthenticated = () => {
    return axiosInstance.post('/auth/isauthenticated', { returnResponse: true })
    .then((response: any) => {
      logger.info(response);
      appCtx.setIsAuthenticated(response);
      return response;
    }).catch(err => {
      logger.error(err);
      throw err;
    });
  };

  return {
    setCSRFToken,
    isUserAuthenticated,
    getAppConfigurations,
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
    resetPassword,
    userLogout
  };
};

export default useHttp;
