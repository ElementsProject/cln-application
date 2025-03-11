import { ApplicationModes, Units } from '../utilities/constants';

export type ConnectWalletFields = {
  protocol?: { title: string; field: string; };
  host: { title: string; field: string; };
  port: { title: string; field: string; }; // REST, Websocket or gRPC
  rune?: { title: string; field: string; };
  invoiceRune?: { title: string; field: string; };
  clientKey?: { title: string; field: string; };
  clientCert?: { title: string; field: string; };
  caCert?: { title: string; field: string; };
  connectUrl?: { title: string; field: string; };
}

export type WalletConnect = {
  isLoading: boolean;
  SINGLE_SIGN_ON?: boolean;
  LOCAL_HOST?: string;
  DEVICE_DOMAIN_NAME?: string;
  BITCOIN_NODE_IP?: string;
  BITCOIN_NETWORK?: string;
  APP_CONFIG_FILE?: string;
  APP_LOG_FILE?: string;
  APP_MODE?: string;
  APP_CONNECT?: string;
  APP_PROTOCOL?: string;
  APP_IP?: string;
  APP_PORT?: string;
  LIGHTNING_IP?: string;
  LIGHTNING_PATH?: string;
  HIDDEN_SERVICE_URL?: string;
  TOR_SERVICE?: string;
  LIGHTNING_NODE_TYPE?: string;
  COMMANDO_CONFIG?: string;
  LIGHTNING_WS_PORT?: string;
  LIGHTNING_REST_PROTOCOL?: string;
  LIGHTNING_REST_PORT?: string;
  LIGHTNING_CERTS_PATH?: string;
  LIGHTNING_GRPC_PROTOCOL?: string;
  LIGHTNING_GRPC_PORT?: string;
  APP_VERSION?: string;
  NODE_PUBKEY?: string;
  COMMANDO_RUNE?: string;
  INVOICE_RUNE?: string;
  CLIENT_KEY?: string;
  CLIENT_CERT?: string;
  CA_CERT?: string;
  error?: any;
}

export type ApplicationConfiguration = {
  isLoading: boolean;
  uiConfig: {
    unit: Units;
    fiatUnit: string;
    appMode: ApplicationModes;
  };
  serverConfig: {
    appConnect?: string;
    appPort?: string;
    appProtocol?: string;
    appVersion?: string;
    lightningNodeType?: string;
    singleSignOn?: boolean;
  }
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
  isLoading: boolean;
  error?: any;
}
