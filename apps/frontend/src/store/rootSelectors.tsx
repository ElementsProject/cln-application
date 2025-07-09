import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types/root.type';
import { ApplicationModes, Units } from '../utilities/constants';

export const defaultRootState: RootState = {
  authStatus: { isLoading: true, isAuthenticated: false, isValidPassword: true },
  showModals: { nodeInfoModal: false, connectWalletModal: false, loginModal: false, logoutModal: false, setPasswordModal: false, sqlTerminalModal: false, qrCodeLarge: false, },
  showToast: { show: false, message: '' },
  connectWallet: { isLoading: true },
  connectionUrl: '',
  appConfig: {
    isLoading: true,
    uiConfig: { unit: Units.SATS, fiatUnit: 'USD', appMode: ApplicationModes.LIGHT },
    serverConfig: { singleSignOn: false },
  },
  fiatConfig: { isLoading: true, symbol: faDollarSign, venue: '', rate: 1 },
  walletBalances: {
    isLoading: true,
    clnLocalBalance: 0,
    clnRemoteBalance: 0,
    clnPendingBalance: 0,
    clnInactiveBalance: 0,
    btcSpendableBalance: 0,
    btcReservedBalance: 0,
  },
  nodeInfo: { isLoading: true, alias: '', version: '', error: null },
  listFunds: { isLoading: true, channels: [], outputs: [] },
  listPeers: { isLoading: true, peers: [] },
  listChannels: { isLoading: true, activeChannels: [], pendingChannels: [], inactiveChannels: [], mergedChannels: [] },
};

const selectRootState = (state: { root: RootState }) => state.root || defaultRootState;

export const selectAuthStatus = createSelector(
  selectRootState,
  (root) => root.authStatus
);

export const selectIsAuthenticated = createSelector(
  selectAuthStatus,
  (authStatus) => authStatus.isAuthenticated
);

export const selectIsValidPassword = createSelector(
  selectAuthStatus,
  (authStatus) => authStatus.isValidPassword
);

export const selectShowModals = createSelector(
  selectRootState,
  (root) => root.showModals
);

export const selectShowToast = createSelector(
  selectRootState,
  (root) => root.showToast
);

export const selectWalletConnect = createSelector(
  selectRootState,
  (root) => root.connectWallet
);

export const selectConnectionUrl = createSelector(
  selectRootState,
  (root) => root.connectionUrl
);

export const selectAppConfig = createSelector(
  selectRootState,
  (root) => root.appConfig
);

export const selectFiatConfig = createSelector(
  selectRootState,
  (root) => root.fiatConfig
);

export const selectNodeInfo = createSelector(
  selectRootState,
  (root) => root.nodeInfo
);

export const selectListFunds = createSelector(
  selectRootState,
  (root) => root.listFunds
);

export const selectListPeers = createSelector(
  selectRootState,
  (root) => root.listPeers
);

export const selectListChannels = createSelector(
  selectRootState,
  (root) => root.listChannels
);

export const selectWalletBalances = createSelector(
  selectRootState,
  (root) => root.walletBalances
);

export const selectServerConfig = createSelector(
  selectAppConfig,
  (appConfig) => appConfig.serverConfig
);

export const selectUIConfig = createSelector(
  selectAppConfig,
  (appConfig) => appConfig.uiConfig
);

export const selectUIConfigUnit = createSelector(
  selectUIConfig,
  (uiConfig) => uiConfig.unit
);

export const selectFiatUnit = createSelector(
  selectUIConfig,
  (uiConfig) => uiConfig.fiatUnit
);

export const selectAppMode = createSelector(
  selectUIConfig,
  (uiConfig) => uiConfig.appMode
);

export const selectIsDarkMode = createSelector(
  selectUIConfig,
  (uiConfig) => uiConfig.appMode === ApplicationModes.DARK
);

export const selectActiveChannels = createSelector(
  selectListChannels,
  (channels) => channels.activeChannels
);

export const selectActiveChannelsExist = createSelector(
  selectActiveChannels,
  (activeChannels) => activeChannels.length > 0
);

export const selectPendingChannels = createSelector(
  selectListChannels,
  (channels) => channels.pendingChannels
);

export const selectInactiveChannels = createSelector(
  selectListChannels,
  (channels) => channels.inactiveChannels
);

export const selectChannelById = (channelId: string) => createSelector(
  selectListChannels,
  (channels) => {
    const allChannels = [
      ...channels.activeChannels,
      ...channels.pendingChannels,
      ...channels.inactiveChannels
    ];
    return allChannels.find(channel => channel.channel_id === channelId);
  }
);
