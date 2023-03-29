// Decided to use context instead of redux because:
// 1: The scope of the application is small.
// 2: Redux is slightly slower than context.
// 3: Polling after every 10 seconds can make it even slower.

import React, { useReducer } from 'react';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

import { ApplicationActions, ApplicationModes, SATS_MSAT, Units } from '../utilities/constants';
import { sortDescByKey } from '../utilities/data-formatters';
import logger from '../services/logger.service';
import { AppContextType } from '../types/app-context.type';
import { ApplicationConfiguration, FiatConfig, WalletConnect } from '../types/app-config.type';
import { BkprTransaction, Fund, FundChannel, FundOutput, Invoice, ListBitcoinTransactions, ListInvoices, ListPayments, ListPeers, NodeFeeRate, NodeInfo, Payment, Peer } from '../types/lightning-wallet.type';

const aggregateChannels = (peers: Peer[]) => {
  const aggregatedChannels: any = { activeChannels: [], pendingChannels: [], inactiveChannels: [] };
  peers?.forEach((peer: Peer) => {
    if (peer.channels && peer.channels.length > 0) {
      peer.channels.map(channel => {
        channel.connected = peer.connected || false;
        channel.node_alias = peer.alias || peer.id?.substring(0,20) || '';
        channel.satoshi_to_us = Math.floor((channel.msatoshi_to_us || 0) / SATS_MSAT);
        channel.satoshi_total = Math.floor((channel.msatoshi_total || 0) / SATS_MSAT);
        channel.satoshi_to_them = Math.floor(((channel.msatoshi_total || 0) - (channel.msatoshi_to_us || 0)) / SATS_MSAT);
        if (channel.state === 'CHANNELD_NORMAL') {
          if (channel.connected) {
            channel.current_state = 'ACTIVE';
            aggregatedChannels.activeChannels.push(channel);
          } else {
            channel.current_state = 'INACTIVE';
            aggregatedChannels.inactiveChannels.push(channel);
          }
        } else {
          channel.current_state = 'PENDING';
          aggregatedChannels.pendingChannels.push(channel);
        }
        return aggregatedChannels;
      });
    }
  });
  aggregatedChannels.activeChannels = sortDescByKey(aggregatedChannels.activeChannels, 'satoshi_total')
  return aggregatedChannels;
}

const paymentReducer = (accumulator, currentPayment) => {
  const currPayHash = currentPayment.payment_hash;
  if (!currentPayment.partid) { currentPayment.partid = 0; }
  if (!accumulator[currPayHash]) {
    accumulator[currPayHash] = [currentPayment];
  } else {
    accumulator[currPayHash].push(currentPayment);
  }
  return accumulator;
};

const summaryReducer = (accumulator, mpp) => {
  if (mpp.status === 'complete') {
    accumulator.msatoshi = accumulator.msatoshi + mpp.msatoshi;
    accumulator.msatoshi_sent = accumulator.msatoshi_sent + mpp.msatoshi_sent;
    accumulator.status = mpp.status;
  }
  if (mpp.bolt11 && !accumulator.bolt11) { accumulator.bolt11 = mpp.bolt11; }
  if (mpp.bolt12 && !accumulator.bolt12) { accumulator.bolt12 = mpp.bolt12; }
  if (mpp.label && !accumulator.label) { accumulator.label = mpp.label; }
  if (mpp.description && !accumulator.description) { accumulator.description = mpp.description; }
  if (mpp.payment_preimage && !accumulator.payment_preimage) { accumulator.payment_preimage = mpp.payment_preimage; }
  return accumulator;
};

const groupBy = (payments) => {
  const paymentsInGroups = payments?.reduce(paymentReducer, {});
  const paymentsGrpArray = Object.keys(paymentsInGroups)?.map((key) => ((paymentsInGroups[key].length && paymentsInGroups[key].length > 1) ? sortDescByKey(paymentsInGroups[key], 'partid') : paymentsInGroups[key]));
  return paymentsGrpArray?.reduce((acc, curr) => {
    let temp: any = {};
    if (curr.length && curr.length === 1) {
      temp = JSON.parse(JSON.stringify(curr[0]));
      temp.is_group = false;
      temp.is_expanded = false;
      temp.total_parts = 1;
      delete temp.partid;
    } else {
      const paySummary = curr?.reduce(summaryReducer, { msatoshi: 0, msatoshi_sent: 0, status: (curr[0] && curr[0].status) ? curr[0].status : 'failed' });
      temp = {
        is_group: true, is_expanded: false, total_parts: (curr.length ? curr.length : 0), status: paySummary.status, payment_hash: curr[0].payment_hash,
        destination: curr[0].destination, msatoshi: paySummary.msatoshi, msatoshi_sent: paySummary.msatoshi_sent, created_at: curr[0].created_at,
        mpps: curr
      };
      if (paySummary.bolt11) { temp.bolt11 = paySummary.bolt11; }
      if (paySummary.bolt12) { temp.bolt12 = paySummary.bolt12; }
      if (paySummary.bolt11 && !temp.bolt11) { temp.bolt11 = paySummary.bolt11; }
      if (paySummary.bolt12 && !temp.bolt12) { temp.bolt12 = paySummary.bolt12; }
      if (paySummary.label && !temp.label) { temp.label = paySummary.label; }
      if (paySummary.description && !temp.description) { temp.description = paySummary.description; }
      if (paySummary.payment_preimage && !temp.payment_preimage) { temp.payment_preimage = paySummary.payment_preimage; }
    }
    return acc.concat(temp);
  }, []);
};

const mergeLightningTransactions = (invoices: Invoice[], payments: Payment[]) => {
  let mergedTransactions: any[] = [];
  let totalTransactionsLength = (invoices?.length || 0) + (payments?.length || 0);
  for (let i = 0, v = 0, p = 0; i < totalTransactionsLength; i++) {
    if (v === (invoices?.length || 0)) {
      payments.slice(p)?.map(payment => {
        mergedTransactions.push({type: 'PAYMENT', payment_hash: payment.payment_hash, status: payment.status, msatoshi: payment.msatoshi, label: payment.label, bolt11: payment.bolt11, description: payment.description, bolt12: payment.bolt12, payment_preimage: payment.payment_preimage, created_at: payment.created_at, msatoshi_sent: payment.msatoshi_sent, destination: payment.destination, expires_at: null, msatoshi_received: null, paid_at: null});
        return payment;
      })
      i = totalTransactionsLength;
    } else if (p === (payments?.length || 0)) {
      invoices.slice(v)?.map(invoice => {
        if (invoice.status !== 'expired') {
          mergedTransactions.push({type: 'INVOICE', payment_hash: invoice.payment_hash, status: invoice.status, msatoshi: invoice.msatoshi, label: invoice.label, bolt11: invoice.bolt11, description: invoice.description, bolt12: invoice.bolt12, payment_preimage: invoice.payment_preimage, created_at: null, msatoshi_sent: null, destination: null, expires_at: invoice.expires_at, msatoshi_received: invoice.msatoshi_received, paid_at: invoice.paid_at});
        }
        return invoice;
      });
      i = totalTransactionsLength;
    } else if((payments[p].created_at || 0) >= (invoices[v].paid_at || invoices[v].expires_at || 0)) {
      mergedTransactions.push({type: 'PAYMENT', payment_hash: payments[p].payment_hash, status: payments[p].status, msatoshi: payments[p].msatoshi, label: payments[p].label, bolt11: payments[p].bolt11, description: payments[p].description, bolt12: payments[p].bolt12, payment_preimage: payments[p].payment_preimage, created_at: payments[p].created_at, msatoshi_sent: payments[p].msatoshi_sent, destination: payments[p].destination, expires_at: null, msatoshi_received: null, paid_at: null});
      p++;
    } else if((payments[p].created_at || 0) < (invoices[v].paid_at || invoices[v].expires_at || 0)) {
      if (invoices[v].status !== 'expired') {
        mergedTransactions.push({type: 'INVOICE', payment_hash: invoices[v].payment_hash, status: invoices[v].status, msatoshi: invoices[v].msatoshi, label: invoices[v].label, bolt11: invoices[v].bolt11, description: invoices[v].description, bolt12: invoices[v].bolt12, payment_preimage: invoices[v].payment_preimage, created_at: null, msatoshi_sent: null, destination: null, expires_at: invoices[v].expires_at, msatoshi_received: invoices[v].msatoshi_received, paid_at: invoices[v].paid_at});
      }
      v++;
    }
  }
  return mergedTransactions;
};

const calculateBalances = (listFunds: Fund) => {
  const walletBalances = { 
    isLoading: false,
    clnLocalBalance: 0,
    clnRemoteBalance: 0,
    clnPendingBalance: 0,
    clnInactiveBalance: 0,
    btcSpendableBalance: 0,
    btcReservedBalance: 0,
    error: null
  };
  listFunds.channels?.map((channel: FundChannel) => {
    if(channel.state === 'CHANNELD_NORMAL' && channel.connected) {
      walletBalances.clnLocalBalance = walletBalances.clnLocalBalance + (channel.channel_sat || 0);
      walletBalances.clnRemoteBalance = walletBalances.clnRemoteBalance + ((channel.channel_total_sat || 0) - (channel.channel_sat || 0));
    }
    else if(channel.state === 'CHANNELD_NORMAL' && !channel.connected) {
      walletBalances.clnInactiveBalance = walletBalances.clnInactiveBalance + (channel.channel_sat || 0);
    }
    else if(channel.state === 'CHANNELD_AWAITING_LOCKIN') {
      walletBalances.clnPendingBalance = walletBalances.clnPendingBalance + (channel.channel_sat || 0);
    }
    return walletBalances;
  });
  listFunds.outputs?.map((output: FundOutput) => {
    if(output.status === 'confirmed') {
      walletBalances.btcSpendableBalance = walletBalances.btcSpendableBalance + (output.value || 0);
    } else if(output.status === 'unconfirmed') {
      walletBalances.btcReservedBalance = walletBalances.btcReservedBalance + (output.value || 0);
    }
    return walletBalances;
  });
  return walletBalances;
};

const filterOnChainTransactions = (events: BkprTransaction[]) => {
  return (!events) ? [] : events?.filter((event: BkprTransaction) => {
    if (event.account === 'wallet' && (event.tag === 'deposit' || event.tag === 'withdrawal')) {
      event.credit_msat = event.credit_msat && event.credit_msat.length ? event.credit_msat.substring(0, (event.credit_msat.length - 4)) : '0';
      event.debit_msat = event.debit_msat && event.debit_msat.length ? event.debit_msat.substring(0, (event.debit_msat.length - 4)) : '0';
      return event;
    }
    return false;
  });
};

const AppContext = React.createContext<AppContextType>({
  showModals: { nodeInfoModal: false, connectWalletModal: false},
  showToast: {show: false, message: ''},
  walletConnect: {isLoading: true},
  appConfig: {isLoading: true, unit: Units.SATS, fiatUnit: 'USD', appMode: ApplicationModes.DARK},
  fiatConfig: {isLoading: true, symbol: faDollarSign, venue: '', rate: 1},
  feeRate: {isLoading: true},
  nodeInfo: {isLoading: true},
  listFunds: {isLoading: true, channels: [], outputs: []},
  listPeers: {isLoading: true, peers: []},
  listChannels: {isLoading: true, activeChannels: [], pendingChannels: [], inactiveChannels: []},
  listInvoices: {isLoading: true, invoices: []},
  listPayments: {isLoading: true, payments: []},
  listLightningTransactions: {isLoading: true, clnTransactions: []},
  listBitcoinTransactions: {isLoading: true, btcTransactions: []},
  walletBalances: {isLoading: true, clnLocalBalance: 0, clnRemoteBalance: 0, clnPendingBalance: 0, clnInactiveBalance: 0, btcSpendableBalance: 0, btcReservedBalance: 0},
  setShowModals: (newShowModals) => {}, 
  setShowToast: (newShowToast) => {},
  setWalletConnect: (newWalletConnect) => {},
  setConfig: (config: ApplicationConfiguration) => {},
  setFiatConfig: (fiatConfig: FiatConfig) => {},
  setFeeRate: (feeRate: NodeFeeRate) => {},
  setNodeInfo: (info: NodeInfo) => {},
  setListFunds: (fundsList: Fund) => {},
  setListPeers: (peersList: ListPeers) => {},
  setListInvoices: (invoicesList: ListInvoices) => {},
  setListPayments: (paymentsList: ListPayments) => {},
  setListBitcoinTransactions: (transactionsList: ListBitcoinTransactions) => {},
  setStore: (storeData) => {},
  clearStore: () => {}
});

const defaultAppState = {
  showModals: {nodeInfoModal: false, connectWalletModal: false, toastComponent: false},
  showToast: {show: false, message: ''},
  walletConnect: {isLoading: true},
  appConfig: {isLoading: true, unit: Units.SATS, fiatUnit: 'USD', appMode: ApplicationModes.DARK},
  fiatConfig: {isLoading: true, symbol: faDollarSign, venue: '', rate: 1},
  feeRate: {isLoading: true},
  nodeInfo: {isLoading: true},
  listFunds: {isLoading: true, channels: [], outputs: []},
  listPeers: {isLoading: true, peers: []},
  listChannels: {isLoading: true, activeChannels: [], pendingChannels: [], inactiveChannels: []},
  listInvoices: {isLoading: true, invoices: []},
  listPayments: {isLoading: true, payments: []},
  listLightningTransactions: {isLoading: true, clnTransactions: []},
  listBitcoinTransactions: {isLoading: true, btcTransactions: []},
  walletBalances: {isLoading: true, clnLocalBalance: 0, clnRemoteBalance: 0, clnPendingBalance: 0, clnInactiveBalance: 0, btcSpendableBalance: 0, btcReservedBalance: 0}
};

const appReducer = (state, action) => {
  logger.info(action);
  logger.info(state);
  switch (action.type) {
    case ApplicationActions.SET_SHOW_MODALS:
      return {
        ...state,
        showModals: action.payload
      };

    case ApplicationActions.SET_SHOW_TOAST:
      return {
        ...state,
        showToast: action.payload
      };
  
    case ApplicationActions.SET_WALLET_CONNECT:
      return {
        ...state,
        walletConnect: action.payload
      };
  
    case ApplicationActions.SET_CONFIG:
      return {
        ...state,
        appConfig: action.payload
      };

    case ApplicationActions.SET_FIAT_CONFIG:
      return {
        ...state,
        fiatConfig: action.payload
      };

    case ApplicationActions.SET_FEE_RATE:
      return {
        ...state,
        feeRate: action.payload
      };

    case ApplicationActions.SET_NODE_INFO:
      return {
        ...state,
        nodeInfo: action.payload
      };

    case ApplicationActions.SET_LIST_FUNDS:
      const balances = calculateBalances({...action.payload});
      return {
        ...state,
        walletBalances: { ...balances, isLoading: false, error: action.payload.error },
        listFunds: action.payload
      };

    case ApplicationActions.SET_LIST_PEERS:
      let filteredChannels = aggregateChannels(action.payload.peers);
      return {
        ...state,
        listChannels: { ...filteredChannels, isLoading: false, error: action.payload.error },
        listPeers: action.payload
      };

    case ApplicationActions.SET_LIST_INVOICES:
      const sortedInvoices = action.payload.invoices?.sort((i1: Invoice, i2: Invoice) => {
        const compareValue1 = i1.paid_at || i1.expires_at || 0;
        const compareValue2 = i2.paid_at || i2.expires_at || 0;
        return compareValue1 > compareValue2 ? -1 : 1;
      });
      if (!state.listPayments.isLoading) {
        const mergedTransactions = mergeLightningTransactions(sortedInvoices, state.listPayments.payments);
        return {
          ...state,
          listLightningTransactions: { isLoading: false, error: action.payload.error, clnTransactions: mergedTransactions },
          listInvoices: {...action.payload, invoices: sortedInvoices}
        };
      }

      return {
        ...state,
        listInvoices: {...action.payload, invoices: sortedInvoices}
      };

    case ApplicationActions.SET_LIST_SEND_PAYS:
      const sortedPayments = action.payload.payments?.sort((p1: Payment, p2: Payment) => ((p1.created_at && p2.created_at && p1.created_at > p2.created_at) ? -1 : 1));
      const groupedMPPs = groupBy(sortedPayments || []);
      if (!state.listInvoices.isLoading) {
        const mergedTransactions = mergeLightningTransactions(state.listInvoices.invoices, groupedMPPs);
        return {
          ...state,
          listLightningTransactions: { isLoading: false, error: action.payload.error, clnTransactions: mergedTransactions },
          listPayments: {...action.payload, payments: groupedMPPs}
        };
      }

      return {
        ...state,
        listPayments: {...action.payload, payments: sortedPayments}
      };

    case ApplicationActions.SET_LIST_BITCOIN_TRANSACTIONS:
      const sortedTransactions = action.payload.events?.sort((t1: BkprTransaction, t2: BkprTransaction) => ((t1.timestamp && t2.timestamp && t1.timestamp > t2.timestamp) ? -1 : 1));
      const filteredTransactions = filterOnChainTransactions(sortedTransactions);
      return {
        ...state,
        listBitcoinTransactions: { isLoading: false, error: action.payload.error, btcTransactions: filteredTransactions },
      };

    case ApplicationActions.SET_CONTEXT:
      return action.payload;
  
    case ApplicationActions.CLEAR_CONTEXT:
      return defaultAppState;

    default:
      return defaultAppState;
  }
};

const AppProvider: React.PropsWithChildren<any> = (props) => {
  const [applicationState, dispatchApplicationAction] = useReducer(appReducer, defaultAppState);
  
  const setShowModalsHandler = (newShowModals: any) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_SHOW_MODALS, payload: newShowModals });
  };

  const setShowToastHandler = (newShowToast: any) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_SHOW_TOAST, payload: newShowToast });
  };

  const setWalletConnectHandler = (walletConnect: WalletConnect) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_WALLET_CONNECT, payload: walletConnect });
  };

  const setConfigurationHandler = (config: ApplicationConfiguration) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_CONFIG, payload: config });
  };

  const setFiatConfigHandler = (fiatConfig: FiatConfig) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_FIAT_CONFIG, payload: fiatConfig });
  };

  const setFeeRateHandler = (feeRate: NodeFeeRate) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_FEE_RATE, payload: feeRate });
  };

  const setNodeInfoHandler = (info: NodeInfo) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_NODE_INFO, payload: info });
  };

  const setListFundsHandler = (fund: Fund) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_LIST_FUNDS, payload: fund });
  };

  const setListPeersHandler = (list: ListPeers) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_LIST_PEERS, payload: list });
  };

  const setListInvoicesHandler = (list: ListInvoices) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_LIST_INVOICES, payload: list });
  };

  const setListPaymentsHandler = (list: ListPayments) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_LIST_SEND_PAYS, payload: list });
  };

  const setListBitcoinTransactionsHandler = (list: any) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_LIST_BITCOIN_TRANSACTIONS, payload: list });
  };

  const setContextStore = (storeData: any) => {
    dispatchApplicationAction({ type: ApplicationActions.SET_CONTEXT, payload: storeData });
  };

  const clearContextHandler = () => {
    dispatchApplicationAction({ type: ApplicationActions.CLEAR_CONTEXT });
  };

  const appContext: AppContextType = {
    showModals: applicationState.showModals,
    showToast: applicationState.showToast,
    walletConnect: applicationState.walletConnect,
    appConfig: applicationState.appConfig,
    fiatConfig: applicationState.fiatConfig,
    feeRate: applicationState.feeRate,
    nodeInfo: applicationState.nodeInfo,
    listFunds: applicationState.listFunds,
    listPeers: applicationState.listPeers,
    listChannels: applicationState.listChannels,
    listInvoices: applicationState.listInvoices,
    listPayments: applicationState.listPayments,
    listLightningTransactions: applicationState.listLightningTransactions,
    listBitcoinTransactions: applicationState.listBitcoinTransactions,
    walletBalances: applicationState.walletBalances,
    setShowModals: setShowModalsHandler,
    setShowToast: setShowToastHandler,
    setWalletConnect: setWalletConnectHandler,
    setConfig: setConfigurationHandler,
    setFiatConfig: setFiatConfigHandler,
    setFeeRate: setFeeRateHandler,
    setNodeInfo: setNodeInfoHandler,
    setListFunds: setListFundsHandler,
    setListPeers: setListPeersHandler,
    setListInvoices: setListInvoicesHandler,
    setListPayments: setListPaymentsHandler,
    setListBitcoinTransactions: setListBitcoinTransactionsHandler,
    setStore: setContextStore,
    clearStore: clearContextHandler
  };

  return <AppContext.Provider value={appContext}>{props.children}</AppContext.Provider>;
};

export { AppProvider, AppContext };
