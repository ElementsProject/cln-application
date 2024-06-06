import { ApplicationModes, Units } from '../utilities/constants';

export type ConnectWalletFields = {
  port: { title: string; field: string; }; // REST, Websocket or gRPC
  host: { title: string; field: string; };
  macaroon: { title: string; field: string; }; // Or ClientKey
  invoiceRune: { title: string; field: string; };
  connectUrl: { title: string; field: string; };
  clientCert: { title: string; field: string; };
  caCert: { title: string; field: string; };
}

export type WalletConnect = {
  isLoading: boolean;
  GRPC_PORT?: string;
  CLIENT_KEY?: string;
  CLIENT_CERT?: string;
  CA_CERT?: string;
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
  INVOICE_RUNE?: string;
  APP_VERSION?: string;
  error?: any;
}

export type ApplicationConfiguration = {
  isLoading: boolean;
  unit: Units;
  fiatUnit: string;
  appMode: ApplicationModes;
  singleSignOn?: boolean;
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
