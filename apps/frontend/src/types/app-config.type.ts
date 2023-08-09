import { ApplicationModes, Units } from '../utilities/constants';

export type WalletConnect = {
  isLoading: boolean;
  GRPC_PORT?: string;
  DEVICE_DOMAIN_NAME?: string;
  LOCAL_HOST?: string;
  REST_MACAROON?: string;
  REST_PORT?: string;
  TOR_DOMAIN_NAME?: string;
  TOR_HOST?: string;
  CLN_NODE_IP?: string;
  WS_PORT?: string;
  NODE_PUBKEY?: string;
  COMMANDO_RUNE?: string;
  APP_VERSION?: string;
  error?: any;
}

export type ApplicationConfiguration = {
  isLoading: boolean;
  unit: Units;
  fiatUnit: string;
  appMode: ApplicationModes;
  sso?: boolean;
  error?: any;
}

export type FiatConfig = {
  venue?: string;
  rate?: number;
  isLoading: boolean;
  symbol: any;
  error?: any;
}

export type ModalConfig = {
  nodeInfoModal: boolean;
  connectWalletModal: boolean;
  loginModal: boolean;
  logoutModal: boolean;
  setPasswordModal: boolean;
}

export type ToastConfig = {
  show: boolean;
  message: string;
  delay?: number;
  type?: string;
  bg?: string;
  className?: string;
  containerClassName?: string;
  onConfirmResponse?: any;
}

export type AuthResponse = {
  isAuthenticated: boolean;
  isValidPassword: boolean;
}