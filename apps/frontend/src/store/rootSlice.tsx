import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Fund, FundChannel, FundOutput, RootState } from '../types/root.type';
import { SATS_MSAT } from '../utilities/constants';
import { sortDescByKey } from '../utilities/data-formatters';
import { defaultRootState } from './rootSelectors';

const aggregatePeerChannels = (listPeerChannels: any, listNodes: Node[]) => {
  const aggregatedChannels: any = { activeChannels: [], pendingChannels: [], inactiveChannels: [], mergedChannels: [] };
  if (!listPeerChannels || !listPeerChannels.channels) {
    return aggregatedChannels;
  }
  listPeerChannels.channels.forEach((peerChannel: any) => {
    peerChannel = {
      ...peerChannel,
      node_alias: listNodes.find((node) => node?.nodeid === peerChannel.peer_id)?.alias?.replace(/-\d+-.*$/, '') || 'Unknown',
      to_us_sat: Math.floor((peerChannel.to_us_msat || 0) / SATS_MSAT),
      total_sat: Math.floor((peerChannel.total_msat || 0) / SATS_MSAT),
      to_them_sat: Math.floor(((peerChannel.total_msat || 0) - (peerChannel.to_us_msat || 0)) / SATS_MSAT),
    };

    if (peerChannel.state?.toLowerCase() === 'channeld_normal') {
      if (peerChannel.peer_connected) {
        peerChannel.current_state = 'ACTIVE';
        aggregatedChannels.activeChannels.push(peerChannel);
      } else {
        peerChannel.current_state = 'INACTIVE';
        aggregatedChannels.inactiveChannels.push(peerChannel);
      }
    } else {
      peerChannel.current_state = 'PENDING';
      aggregatedChannels.pendingChannels.push(peerChannel);
    }
    return aggregatedChannels;
  });
  aggregatedChannels.activeChannels = sortDescByKey(aggregatedChannels.activeChannels, 'total_msat')
  aggregatedChannels.mergedChannels = [...aggregatedChannels.activeChannels, ...aggregatedChannels.pendingChannels, ...aggregatedChannels.inactiveChannels];
  return aggregatedChannels;
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
    if (channel.state?.toLowerCase() === 'channeld_normal' && channel.connected) {
      walletBalances.clnLocalBalance = walletBalances.clnLocalBalance + (channel.channel_sat || (channel.our_amount_msat || 0) / SATS_MSAT);
      walletBalances.clnRemoteBalance = walletBalances.clnRemoteBalance + (((channel.channel_total_sat || ((channel.amount_msat || 0) / SATS_MSAT) || 0) - (channel.channel_sat || ((channel.our_amount_msat || 0) / SATS_MSAT)) || 0));
    }
    else if (channel.state?.toLowerCase() === 'channeld_normal' && !channel.connected) {
      walletBalances.clnInactiveBalance = walletBalances.clnInactiveBalance + (channel.channel_sat || (channel.our_amount_msat || 0) / SATS_MSAT);
    }
    else if (channel.state?.toLowerCase() === 'channeld_awaiting_lockin') {
      walletBalances.clnPendingBalance = walletBalances.clnPendingBalance + (channel.channel_sat || (channel.our_amount_msat || 0) / SATS_MSAT);
    }
    return walletBalances;
  });
  listFunds.outputs?.map((output: FundOutput) => {
    if (output.status?.toLowerCase() === 'confirmed') {
      walletBalances.btcSpendableBalance = walletBalances.btcSpendableBalance + (output.value || ((output.amount_msat || 0) / SATS_MSAT) || 0);
    } else if (output.status?.toLowerCase() === 'unconfirmed') {
      walletBalances.btcReservedBalance = walletBalances.btcReservedBalance + (output.value || ((output.amount_msat || 0) / SATS_MSAT) || 0);
    }
    return walletBalances;
  });
  walletBalances.btcReservedBalance = Math.round(walletBalances.btcReservedBalance);
  walletBalances.btcSpendableBalance = Math.round(walletBalances.btcSpendableBalance);
  walletBalances.clnInactiveBalance = Math.round(walletBalances.clnInactiveBalance);
  walletBalances.clnLocalBalance = Math.round(walletBalances.clnLocalBalance);
  walletBalances.clnPendingBalance = Math.round(walletBalances.clnPendingBalance);
  walletBalances.clnRemoteBalance = Math.round(walletBalances.clnRemoteBalance);
  return walletBalances;
};

const rootSlice = createSlice({
  name: 'root',
  initialState: defaultRootState,
  reducers: {
    setAuthStatus(state, action: PayloadAction<RootState['authStatus']>) {
      state.authStatus = action.payload;
    },
    setShowModals(state, action: PayloadAction<RootState['showModals']>) {
      state.showModals = action.payload;
    },
    setShowToast(state, action: PayloadAction<RootState['showToast']>) {
      state.showToast = action.payload;
    },
    setConnectWallet(state, action: PayloadAction<RootState['connectWallet']>) {
      state.connectWallet = action.payload;
    },
    setConnectionUrl(state, action: PayloadAction<RootState['connectionUrl']>) {
      state.connectionUrl = action.payload;
    },
    setConfig(state, action: PayloadAction<RootState['appConfig']>) {
      state.appConfig = action.payload;
    },
    setFiatConfig(state, action: PayloadAction<RootState['fiatConfig']>) {
      state.fiatConfig = action.payload;
    },
    setNodeInfo(state, action: PayloadAction<RootState['nodeInfo']>) {
      state.nodeInfo = action.payload;
    },
    setListFunds(state, action: PayloadAction<Fund>) {
      state.walletBalances = calculateBalances(action.payload);
      state.listFunds = action.payload;
    },
    setListPeers(state, action: PayloadAction<RootState['listPeers']>) {
      state.listPeers = action.payload;
    },
    setListChannels(
      state,
      action: PayloadAction<{ listChannels: any; listNodes: any }>
    ) {
      const { listChannels, listNodes } = action.payload;
      if (listChannels.error || listNodes.error) {
        state.listChannels = { ...state.listChannels, error: (listChannels.error || listNodes.error) };
        return;
      }
      const aggr = aggregatePeerChannels(listChannels, listNodes.nodes);
      state.listChannels = { ...aggr, isLoading: false };
    },
    clearRootStore(state) {
      return { ...defaultRootState, appConfig: state.appConfig };
    },
  },
});

export const {
  setAuthStatus,
  setShowModals,
  setShowToast,
  setConnectWallet,
  setConnectionUrl,
  setConfig,
  setFiatConfig,
  setNodeInfo,
  setListFunds,
  setListPeers,
  setListChannels,
  clearRootStore,
} = rootSlice.actions;

export default rootSlice.reducer;
