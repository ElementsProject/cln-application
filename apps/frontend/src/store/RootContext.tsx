import React, { useReducer } from 'react';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { ApplicationActions, ApplicationModes, Units } from '../utilities/constants';
import { AuthResponse, ModalConfig, ToastConfig, WalletConnect, ApplicationConfiguration, FiatConfig } from '../types/app-config.type';
import logger from '../services/logger.service';

interface RootState {
  authStatus: AuthResponse;
  showModals: ModalConfig;
  showToast: ToastConfig;
  walletConnect: WalletConnect;
  appConfig: ApplicationConfiguration;
  fiatConfig: FiatConfig;
}

const defaultRootState: RootState = {
  authStatus: { isLoading: true, isAuthenticated: false, isValidPassword: false },
  showModals: {nodeInfoModal: false, connectWalletModal: false, loginModal: false, logoutModal: false, setPasswordModal: false},
  showToast: {show: false, message: ''},
  walletConnect: {isLoading: true},
  appConfig: {isLoading: true, uiConfig: { unit: Units.SATS, fiatUnit: 'USD', appMode: ApplicationModes.DARK}, serverConfig: { singleSignOn: false, lightningNodeType: 'CLN' } },
  fiatConfig: {isLoading: true, symbol: faDollarSign, venue: '', rate: 1},
};

const rootReducer = (state, action) => {
  logger.info('Root State: ', state);
  switch (action.type) {
    case ApplicationActions.SET_AUTH_STATUS:
      return { ...state, authStatus: action.payload };
    case ApplicationActions.SET_SHOW_MODALS:
      return { ...state, showModals: action.payload };
    case ApplicationActions.SET_SHOW_TOAST:
      return { ...state, showToast: action.payload };
    case ApplicationActions.SET_WALLET_CONNECT:
      return { ...state, walletConnect: action.payload };
    case ApplicationActions.SET_CONFIG:
      return { ...state, appConfig: action.payload };
    case ApplicationActions.SET_FIAT_CONFIG:
      return { ...state, fiatConfig: action.payload };
    case ApplicationActions.CLEAR_CONTEXT:
      return defaultRootState;
    default:
      return state;
  }
};

const RootContext = React.createContext({
  ...defaultRootState,
  setAuthStatus: (authStatus: AuthResponse) => { },
  setShowModals: (newShowModals: ModalConfig) => { },
  setShowToast: (newShowToast: ToastConfig) => { },
  setWalletConnect: (walletConnect: WalletConnect) => { },
  setConfig: (config: ApplicationConfiguration) => { },
  setFiatConfig: (fiatConfig: FiatConfig) => { },
  clearStore: () => { },
});

const RootProvider: React.PropsWithChildren<any> = (props) => {
  const [rootState, dispatchRootAction] = useReducer(rootReducer, defaultRootState);

  const setAuthStatusHandler = (authStatus: AuthResponse) => {
    dispatchRootAction({ type: ApplicationActions.SET_AUTH_STATUS, payload: authStatus });
  };

  const setShowModalsHandler = (newShowModals: ModalConfig) => {
    dispatchRootAction({ type: ApplicationActions.SET_SHOW_MODALS, payload: newShowModals });
  };

  const setShowToastHandler = (newShowToast: ToastConfig) => {
    dispatchRootAction({ type: ApplicationActions.SET_SHOW_TOAST, payload: newShowToast });
  };

  const setWalletConnectHandler = (walletConnect: WalletConnect) => {
    dispatchRootAction({ type: ApplicationActions.SET_WALLET_CONNECT, payload: walletConnect });
  };

  const setConfigurationHandler = (config: ApplicationConfiguration) => {
    dispatchRootAction({ type: ApplicationActions.SET_CONFIG, payload: config });
  };

  const setFiatConfigHandler = (fiatConfig: FiatConfig) => {
    dispatchRootAction({ type: ApplicationActions.SET_FIAT_CONFIG, payload: fiatConfig });
  };

  const clearContextHandler = () => {
    dispatchRootAction({ type: ApplicationActions.CLEAR_CONTEXT });
  };

  const rootContext = {
    ...rootState,
    setAuthStatus: setAuthStatusHandler,
    setShowModals: setShowModalsHandler,
    setShowToast: setShowToastHandler,
    setWalletConnect: setWalletConnectHandler,
    setConfig: setConfigurationHandler,
    setFiatConfig: setFiatConfigHandler,
    clearStore: clearContextHandler,
  };

  return <RootContext.Provider value={rootContext}>{props.children}</RootContext.Provider>;
};

export { RootProvider, RootContext };
