import axios from 'axios';
import moment from 'moment';
import { ApplicationConfiguration, AuthResponse, Peer } from '../types/root.type';
import { API_BASE_URL, API_VERSION, APP_WAIT_TIME, PaymentType, TimeGranularity, getTimestampWithGranularity, SATS_MSAT, SCROLL_PAGE_SIZE } from '../utilities/constants';
import { AccountEventsSQL, SatsFlowSQL, VolumeSQL } from '../utilities/bookkeeper-sql';
import logger from './logger.service';
import { convertArrayToAccountEventsObj, convertArrayToBTCTransactionsObj, convertArrayToLightningTransactionsObj, convertArrayToOffersObj, convertArrayToSatsFlowObj, convertArrayToVolumeObj } from './data-transform.service';
import { defaultRootState } from '../store/rootSelectors';
import { AppState } from '../store/store.type';
import { appStore } from '../store/appStore';
import { AccountEventsAccount, SatsFlowEvent, VolumeRow } from '../types/bookkeeper.type';
import { listBTCTransactionsSQL, listLightningTransactionsSQL, ListOffersSQL, ListOffersSQLWithoutDesc } from '../utilities/cln-sql';
import { setConnectWallet, setListChannels, setListFunds, setNodeInfo } from '../store/rootSlice';
import { setFeeRate, setListBitcoinTransactions, setListLightningTransactions, setListOffers } from '../store/clnSlice';
import { setAccountEvents, setSatsFlow, setVolume } from '../store/bkprSlice';
import { isCompatibleVersion } from '../utilities/data-formatters';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL + API_VERSION,
  timeout: APP_WAIT_TIME * 10,
  withCredentials: true,
});

function handleAxiosError(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data && typeof error.response?.data === 'string') return error.response.data;
  if (error.message) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
}

async function executeRequests<T extends Record<string, Promise<any>>>(
  requests: T,
  onEachComplete?: (key: keyof T, data: any) => void
): Promise<any> {
  const entries = Object.entries(requests) as [keyof T, T[keyof T]][];
  const settledResults = await Promise.allSettled(
    entries.map(([key, promise]) => {
      logger.info(key);
      
      return promise
        .then((value) => {
          if (onEachComplete) {
            onEachComplete(key, {
              ...value,
              error: null,
              isLoading: false,
            });
          }
          return value;
        })
        .catch((error) => {
          if (onEachComplete) {
            onEachComplete(key, {
              error: handleAxiosError(error),
              isLoading: false,
            });
          }
          throw error;
        });
    })
  );

  // Still return the combined results for the caller
  return entries.reduce((acc, [name], index) => {
    const result = settledResults[index];
    acc[name] = {
      ...(result.status === 'fulfilled' ? result.value : null),
      error: result.status === 'rejected' ? handleAxiosError(result.reason) : null,
      isLoading: false,
    };
    return acc;
  }, {} as any);
}

export class HttpService {
  static async request(method: string, url: string, data?: any) {
    try {
      const response = await axiosInstance({
        method,
        url,
        data
      });
      return response.data;
    } catch (error: any) {
      logger.error(`HTTP Request failed for ${method} ${url}`, {
        data,
        error: error.response?.data || error.message
      });
      throw handleAxiosError(error);
    }
  }

  static async get(url: string, params?: any) {
    try {
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } catch (error: any) {
      logger.error(`GET request failed for ${url}`, {
        params,
        error: error.response?.data || error.message
      });
      throw handleAxiosError(error);
    }
  }

  static async post(url: string, data?: any) {
    return this.request('post', url, data);
  }

  static async put(url: string, data?: any) {
    return this.request('put', url, data);
  }

  static async delete(url: string, data?: any) {
    return this.request('delete', url, data);
  }

  static async setCSRFToken() {
    try {
      const response = await HttpService.get('/shared/csrf');
      axiosInstance.defaults.headers.common['X-XSRF-TOKEN'] = response.csrfToken;
      return true;
    } catch (error) {
      logger.error('CSRF token retrieval failed', error);
      return false;
    }
  }

  static async clnCall<T>(method: string, params: Record<string, any> = {}): Promise<T> {
    try {
      return await this.post('/cln/call', { method, params });
    } catch (error) {
      logger.error('CLN call failed', { method, params, error });
      throw handleAxiosError(error);
    }
  }

}

export class RootService {
  
  static async userLogin(password: string): Promise<AuthResponse> {
    try {
      const response = await HttpService.post('/auth/login', { password });
      return { ...response, isLoading: false, error: null };
    } catch (error: any) {
      logger.error('Login failed: ', error);
      throw error.response?.data || error.message || typeof error === 'object' ? JSON.stringify(error) : error;
    }
  }

  static async userLogout(): Promise<void> {
    try {
      await HttpService.get('/auth/logout');
    } catch (error: any) {
      logger.error('Logout failed: ', error);
      throw error.response?.data || error.message || typeof error === 'object' ? JSON.stringify(error) : error;
    }
  }

  static async getAuthStatus(): Promise<AuthResponse> {
    try {
      const response = await HttpService.post('/auth/isauthenticated', { returnResponse: true });
      return { ...response, isLoading: false, error: null };
    } catch (error: any) {
      logger.error('Auth Status failed: ', error);
      return { isLoading: true, isAuthenticated: false, isValidPassword: true };
    }
  }

  static async resetUserPassword(isValid: boolean, currPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await HttpService.post('/auth/reset', { isValid, currPassword, newPassword });
      return { ...response, isLoading: false, error: null };
    } catch (error: any) {
      logger.error('Password Reset failed: ', error);
      throw error.response?.data || error.message || typeof error === 'object' ? JSON.stringify(error) : error;
    }
  }

  static async getAppConfigurations(): Promise<ApplicationConfiguration> {
    return HttpService.get('/shared/config');
  }

  static async updateConfig(updatedConfig: ApplicationConfiguration) {
    return HttpService.post('/shared/config', updatedConfig);
  }

  static async getConnectWallet() {
    return HttpService.get('/shared/connectwallet');
  }

  static async getFiatConfig(fiatUnit: string) {
    return HttpService.get('/shared/rate/' + fiatUnit);
  }

  static async getNodeInfo() {
    return HttpService.clnCall('getinfo');
  }

  static async listChannels() {
    const [peerChannels, nodes]: [any, any] = await Promise.all([
      HttpService.clnCall('listpeerchannels'),
      HttpService.clnCall('listnodes')
    ]);
    const nodesMap = new Map<string, Peer>(
      nodes.nodes?.map(node => [node.nodeid, node]) || []
    );
    const merged = peerChannels.channels?.map(channel => ({
      ...channel,
      node_alias: nodesMap.get(channel.peer_id)?.alias ?? ''
    })) || [];
    return { channels: merged };
    // // No pagination, need full data for active, pending and inactive channels calculations
    // // Un-comment after sql plugin improvements
    // const listChannelsArr: any = await HttpService.clnCall('sql', { query: ListPeerChannelsSQL });
    // return { channels: convertArrayToPeerChannelsObj(listChannelsArr.rows ? listChannelsArr.rows : []) };
  }

  static async listFunds() {
    // No pagination, need full data for balance calculations
    return HttpService.clnCall('listfunds');
  }

  static async executeSql(query: string) {
    return HttpService.clnCall('sql', { query });
  }

  static async fetchAuthData() {
    const [ config, authStatus ] = await Promise.all([
      this.getAppConfigurations(),
      this.getAuthStatus(),
    ]);

    let fiatConfig = { ...defaultRootState.fiatConfig, isLoading: false };
    if (config.uiConfig.fiatUnit) {
      fiatConfig = await this.getFiatConfig(config.uiConfig.fiatUnit);
    }

    return {
      config,
      authStatus,
      fiatConfig,
    };
  }

  static async fetchRootData() {
    const results = await executeRequests({
      nodeInfo: this.getNodeInfo(),
      connectWallet: this.getConnectWallet(),
    },
    (key, data) => {
      switch(key) {
        case 'nodeInfo':
          appStore.dispatch(setNodeInfo(data));
          break;
        case 'connectWallet':
          appStore.dispatch(setConnectWallet(data));
          break;
      }
    });
    return results;
  }

  static async refreshData() {
    const results = await executeRequests({
      listFunds: this.listFunds(),
      listChannels: this.listChannels(),
    },
    (key, data) => {
      switch(key) {
        case 'listFunds':
          appStore.dispatch(setListFunds(data));
          break;
        case 'listChannels':
          appStore.dispatch(setListChannels(data));
          break;
      }
    });
    return results;
  }
}

export class CLNService {
  static async listLightningTransactions(offset: number) {
    const listCLNTransactionsArr: any = await HttpService.clnCall('sql', { query: listLightningTransactionsSQL(SCROLL_PAGE_SIZE, offset) });
    return { clnTransactions: convertArrayToLightningTransactionsObj(listCLNTransactionsArr.rows ? listCLNTransactionsArr.rows : []) };
  }

  static async listOffers(offset: number, store = appStore) {
    const state = store.getState() as AppState;
    const nodeInfo = state.root.nodeInfo;
    const isCompatible = isCompatibleVersion(nodeInfo.version || '', '26.04');
    const primaryQuery = isCompatible ? ListOffersSQL(SCROLL_PAGE_SIZE, offset) : ListOffersSQLWithoutDesc(SCROLL_PAGE_SIZE, offset);
    try {
      const listOffersArr: any = await HttpService.clnCall('sql', { query: primaryQuery });
      return { offers: convertArrayToOffersObj(listOffersArr.rows ?? []) };
    } catch (err: any) {
      // Fallback ONLY for older nodes missing `description`
      if (isCompatible && typeof err?.message === 'string' && err.message.includes('no such column: description')) {
        const fallbackQuery = ListOffersSQLWithoutDesc(SCROLL_PAGE_SIZE, offset);
        const listOffersArr: any = await HttpService.clnCall('sql', { query: fallbackQuery });
        return { offers: convertArrayToOffersObj(listOffersArr.rows ?? []) };
      }
      throw err; // Throw all other errors
    }
  }

  static async listBTCTransactions(offset: number) {
    const listBTCTransactionsArr: any = await HttpService.clnCall('sql', { query: listBTCTransactionsSQL(SCROLL_PAGE_SIZE, offset) });
    return { btcTransactions: convertArrayToBTCTransactionsObj(listBTCTransactionsArr.rows ? listBTCTransactionsArr.rows : []) };
  }

  static async getFeeRates() {
    return HttpService.clnCall('feerates', { style: 'perkb' });
  }

  static async openChannel(pubkey: string, amount: number, feeRate: string, announce: boolean) {
    return HttpService.clnCall('fundchannel', { id: pubkey, amount, feerate: feeRate, announce });
  }

  static async closeChannel(id: string) {
    return HttpService.clnCall('close', { id });
  }

  static async btcWithdraw(destination: string, satoshi: string, feerate: string) {
    return HttpService.clnCall('withdraw', { destination, satoshi, feerate });
  }

  static async btcDeposit() {
    return HttpService.clnCall('newaddr', { addresstype: 'bech32' });
  }

  static async clnSendPayment(paymentType: PaymentType, invoice: string, amount?: number | null) {
    if (paymentType === PaymentType.KEYSEND) {
      return HttpService.clnCall('keysend', { destination: invoice, amount_msat: amount });
    }
    return HttpService.clnCall('pay', amount ? { bolt11: invoice, amount_msat: amount } : { bolt11: invoice });
  }

  static async clnReceiveInvoice(invoiceType: PaymentType, amount: number | string, description: string, label: string) {
    if (invoiceType === PaymentType.OFFER) {
      return HttpService.clnCall('offer', { amount, description });
    } else {
      return HttpService.clnCall('invoice', { amount_msat: amount, label, description });
    }
  }

  static async decodeInvoice(invoice: string) {
    return HttpService.clnCall('decode', { string: invoice });
  }

  static async fetchInvoice(offer: string, amount: number) {
    return HttpService.clnCall('fetchinvoice', { offer, amount_msat: amount * SATS_MSAT });
  }

  static async saveInvoiceRune() {
    return HttpService.post('/shared/saveinvoicerune');
  }

  static async refreshConnectWalletData() {
    return HttpService.get('/shared/connectwallet');
  }

  static async createInvoiceRune() {
    return HttpService.clnCall('createrune', { restrictions: [["method=invoice"], ["method=listinvoices"]] })
      .then(() => {
        return this.saveInvoiceRune();
      })
      .then(() => {
        return this.refreshConnectWalletData();
      })
      .catch((err) => {
        logger.error("Error creating or saving invoice rune: ", (err.message || JSON.stringify(err)));
        throw err;
      });
  }

  static async fetchCLNData() {
    const state = appStore.getState() as AppState;
    if (state.root.authStatus.isAuthenticated) {
      const results = await executeRequests(
        {
          feeRates: this.getFeeRates(),
          listBtcTransactions: this.listBTCTransactions(0),
          listOffers: this.listOffers(0),
          listLightningTransactions: this.listLightningTransactions(0),
        },
        (key, data) => {
          switch(key) {
            case 'feeRates':
              appStore.dispatch(setFeeRate(data));
              break;
            case 'listBtcTransactions':
              appStore.dispatch(setListBitcoinTransactions({
                ...data,
                page: 1,
                hasMore: data.btcTransactions?.length >= SCROLL_PAGE_SIZE, // Could be greater also due to payment_hash aggregation
              }));
              break;
            case 'listOffers':
              appStore.dispatch(setListOffers({
                ...data,
                page: 1,
                hasMore: data.offers?.length === SCROLL_PAGE_SIZE,
              }));
              break;
            case 'listLightningTransactions':
              appStore.dispatch(setListLightningTransactions({
                ...data,
                page: 1,
                hasMore: data.clnTransactions?.length >= SCROLL_PAGE_SIZE, // Could be greater also due to unique_timestamps aggregation
              }));
              break;
          }
        }
      );
      
      return {
        feeRates: results.feeRates,
        listBitcoinTransactions: {
          ...results.listBtcTransactions,
          page: 1,
          hasMore: results.listBtcTransactions.btcTransactions?.length >= SCROLL_PAGE_SIZE,
        },
        listOffers: {
          ...results.listOffers,
          page: 1,
          hasMore: results.listOffers.offers?.length === SCROLL_PAGE_SIZE,
        },
        listLightningTransactions: {
          ...results.listLightningTransactions,
          page: 1,
          hasMore: results.listLightningTransactions.clnTransactions?.length >= SCROLL_PAGE_SIZE,
        }
      };
    }
  }
}

export class BookkeeperService {
  static async getAccountEvents() {
    try {
      const accountEvents = await HttpService.clnCall('sql', { query: AccountEventsSQL }) as { events: AccountEventsAccount[], rows?: [], error?: any };
      if (accountEvents.rows) {
        accountEvents.events = convertArrayToAccountEventsObj(accountEvents.rows);
        delete accountEvents.rows;
      }
      return accountEvents;
    } catch (error) {
      logger.error('Get account events failed', error);
      throw handleAxiosError(error);
    }
  }

  static async getSatsFlow(startTimestamp: number, endTimestamp: number) {
    try {
      const satsFlow = await HttpService.clnCall('sql', { query: SatsFlowSQL(startTimestamp, endTimestamp) }) as { satsFlowEvents: SatsFlowEvent[], rows?: [], error?: any };
      if (satsFlow.rows) {
        satsFlow.satsFlowEvents = convertArrayToSatsFlowObj(satsFlow.rows);
        delete satsFlow.rows;
      }
      return satsFlow;
    } catch (error) {
      logger.error('Get sats flow failed', error);
      throw handleAxiosError(error);
    }
  }

  static async getVolume() {
    try {
      const volume = await HttpService.clnCall('sql', { query: VolumeSQL }) as { forwards: VolumeRow[], rows?: [], error?: any };
      if (volume.rows) {
        volume.forwards = convertArrayToVolumeObj(volume.rows);
        delete volume.rows;
      }
      return volume;
    } catch (error) {
      logger.error('Get volume data failed', error);
      throw handleAxiosError(error);
    }
  }

  static async fetchBKPRData() {
    const state = appStore.getState() as AppState;
    if (state.root.authStatus.isAuthenticated) {
      const timeGranularity = TimeGranularity.DAILY;
      const currentDate = new Date();
      const oneMonthBack = moment(currentDate).subtract(1, 'month').add(1, 'day').toDate();
      const startTimestamp = getTimestampWithGranularity(timeGranularity, oneMonthBack, 'start');
      const endTimestamp = getTimestampWithGranularity(timeGranularity, currentDate, 'end');
      const results = await executeRequests(
        {
          accountEvents: this.getAccountEvents(),
          satsFlow: this.getSatsFlow(startTimestamp, endTimestamp),
          volume: this.getVolume()
        },
        (key, data) => {
          switch(key) {
            case 'accountEvents':
              appStore.dispatch(setAccountEvents({
                accountEvents: data,
                timeGranularity,
                startTimestamp,
                endTimestamp
              }));
              break;
            case 'satsFlow':
              appStore.dispatch(setSatsFlow({
                satsFlow: data,
                timeGranularity,
                startTimestamp,
                endTimestamp
              }));
              break;
            case 'volume':
              appStore.dispatch(setVolume({ volume: data }));
              break;
          }
        }
      );
      
      return {
        timeGranularity,
        startTimestamp,
        endTimestamp,
        satsFlow: results.satsFlow,
        accountEvents: results.accountEvents,
        volume: results.volume,
      };
    }
  }
  
}
