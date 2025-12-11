import { ApplicationModes, Units } from '../utilities/constants';

export interface RootLoaderData {
  authStatus: AuthResponse;
  config: ApplicationConfiguration;
  fiatConfig: FiatConfig;
  nodeInfo: NodeInfo;
  listChannels: ListPeerChannels;
  listNodes: ListNodes;
  listPeers: ListPeers;
  listFunds: Fund;
  connectWallet: WalletConnect;
}

export type RootState = {
  authStatus: AuthResponse;
  showModals: ModalConfig;
  showToast: ToastConfig;
  connectWallet: WalletConnect;
  connectionUrl: string;
  appConfig: ApplicationConfiguration;
  fiatConfig: FiatConfig;
  walletBalances: WalletBalances;
  nodeInfo: NodeInfo;
  listFunds: Fund;
  listPeers: ListPeers;
  listChannels: ListPeerChannels;
};

/**
 * Node from getinfo.
 */
export type NodeInfo = {
  isLoading: boolean;
  id?: string;
  alias?: string;
  color?: string;
  num_peers?: number;
  num_pending_channels?: number;
  num_active_channels?: number;
  num_inactive_channels?: number;
  address?: Address[];
  binding?: Address[];
  version?: string;
  blockheight?: number;
  network?: string;
  fees_collected_msat?: number;
  'lightning-dir'?: string;
  warning_bitcoind_sync?: string;
  our_features?: any;
  error?: any;
};

export type WalletConnect = {
  isLoading: boolean;
  APP_SINGLE_SIGN_ON?: boolean;
  BITCOIN_NETWORK?: string;
  APP_PROTOCOL?: string;
  APP_HOST?: string;
  APP_PORT?: string;
  APP_CONFIG_FILE?: string;
  APP_LOG_FILE?: string;
  APP_MODE?: string;
  APP_CONNECT?: string;
  LIGHTNING_DATA_DIR?: string;
  LIGHTNING_HOST?: string;
  LIGHTNING_TOR_HOST?: string;
  LIGHTNING_VARS_FILE?: string;
  LIGHTNING_WS_PROTOCOL?: string;
  LIGHTNING_WS_HOST?: string;
  LIGHTNING_WS_TOR_HOST?: string;
  LIGHTNING_WS_PORT?: number;
  LIGHTNING_WS_CLIENT_KEY_FILE?: string;
  LIGHTNING_WS_CLIENT_CERT_FILE?: string;
  LIGHTNING_WS_CA_CERT_FILE?: string;
  LIGHTNING_REST_PROTOCOL?: string;
  LIGHTNING_REST_HOST?: string;
  LIGHTNING_REST_TOR_HOST?: string;
  LIGHTNING_REST_PORT?: number;
  LIGHTNING_REST_CLIENT_KEY_FILE?: string;
  LIGHTNING_REST_CLIENT_CERT_FILE?: string;
  LIGHTNING_REST_CA_CERT_FILE?: string;
  LIGHTNING_GRPC_HOST?: string;
  LIGHTNING_GRPC_TOR_HOST?: string;
  LIGHTNING_GRPC_PORT?: number;
  LIGHTNING_GRPC_PROTO_PATH?: string;
  LIGHTNING_GRPC_CLIENT_KEY_FILE?: string;
  LIGHTNING_GRPC_CLIENT_CERT_FILE?: string;
  LIGHTNING_GRPC_CA_CERT_FILE?: string;
  // Not added by the user
  APP_VERSION?: string;
  NODE_PUBKEY?: string;
  ADMIN_RUNE?: string;
  INVOICE_RUNE?: string;
  LIGHTNING_WS_TLS_CERTS?: string;
  LIGHTNING_REST_TLS_CERTS?: string;
  LIGHTNING_GRPC_TLS_CERTS?: string;
  error?: any;
};

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
    singleSignOn?: boolean | string;
  }
  error?: any;
};

export type FiatConfig = {
  venue?: string;
  rate?: number;
  isLoading: boolean;
  symbol: any;
  error?: any;
};

export type ModalConfig = {
  nodeInfoModal: boolean;
  connectWalletModal: boolean;
  loginModal: boolean;
  logoutModal: boolean;
  setPasswordModal: boolean;
  sqlTerminalModal: boolean;
  qrCodeLarge: boolean;
};

export type ToastConfig = {
  show: boolean;
  message: string;
  delay?: number;
  type?: string;
  bg?: string;
  className?: string;
  containerClassName?: string;
  onConfirmResponse?: any;
};

export type AuthResponse = {
  isAuthenticated: boolean;
  isValidPassword: boolean;
  isLoading: boolean;
  error?: any;
}

export type WalletBalances = {
  isLoading: boolean;
  clnLocalBalance?: number;
  clnRemoteBalance?: number;
  clnPendingBalance?: number;
  clnInactiveBalance?: number;
  btcSpendableBalance?: number;
  btcReservedBalance?: number;
  error?: any;
};

export type Peer = {
  id?: string;
  connected?: boolean;
  netaddr?: string[];
  last_timestamp?: string;
  alias?: string;
  color?: string;
  features?: string;
  addresses?: Address[];
  option_will_fund?: LiquidityAd;
};

export type ListPeers = {
  isLoading: boolean;
  peers?: Peer[];
  error?: any;
};

export type ChannelType = {
  bits?: number[];
  names?: string[];
};

export type PeerChannel = {
  node_alias: string;
  peer_id: string;
  channel_id: string;
  short_channel_id?: string;
  state: string;
  peer_connected: boolean;
  to_us_msat: number;
  total_msat: number;
  their_to_self_delay?: number;
  opener?: string;
  private?: boolean;
  dust_limit_msat?: number;
  spendable_msat?: number;
  receivable_msat?: number;
  funding_txid?: string;
  // Added for UI: Start
  current_state: string;
  total_sat: number;
  to_us_sat: number;
  to_them_sat: number;
  // Added for UI: End
};

export type ListPeerChannels = {
  isLoading: boolean;
  activeChannels: PeerChannel[];
  pendingChannels: PeerChannel[];
  inactiveChannels: PeerChannel[];
  mergedChannels: PeerChannel[];
  error?: any;
};

export type HTLC = {
  direction?: string;
  id?: number;
  amount_msat?: string;
  expiry?: string;
  payment_hash?: string;
  state?: string;
  local_trimmed?: boolean;
};

export type ChannelFeeRate = {
  perkw?: number;
  perkb?: number;
};

export type StateChange = {
  timestamp?: string;
  old_state?: string;
  new_state?: string;
  cause?: string;
  message?: string;
};

export type Funding = {
  local_funds_msat?: number;
  remote_funds_msat?: number;
  pushed_msat?: number;
  fee_paid_msat?: number;
  fee_rcvd_msat?: number;
};

export type Alias = {
  local?: string;
  remote?: string;
};

export type LiquidityAd = {
  lease_fee_base_msat?: string;
  lease_fee_basis?: number;
  funding_weight?: number;
  channel_fee_max_base_msat?: string;
  channel_fee_max_proportional_thousandths?: number;
  compact_lease?: string;
};

export type Inflight = {
  funding_txid: string;
  funding_outnum: number;
  feerate: string;
  total_funding_msat: string;
  splice_amount: number;
  our_funding_msat: string;
  scratch_txid?: string;
};

export type Address = {
  type?: string;
  address?: string;
  port?: number;
};

export type FundOutput = {
  txid?: string;
  output?: number;
  value?: number;
  amount_msat?: number;
  scriptpubkey?: string;
  status?: string;
  reserved?: boolean;
  address?: string;
  redeemscript?: string;
  blockheight?: number;
  reserved_to_block?: string;
};

export type FundChannel = {
  peer_id?: string;
  funding_txid?: string;
  funding_output?: number;
  connected?: boolean;
  state?: string;
  short_channel_id?: string;
  our_amount_msat?: number;
  channel_sat?: number;
  channel_total_sat?: number;
  amount_msat?: number;
};

export type Fund = {
  isLoading: boolean;
  channels?: FundChannel[];
  outputs?: FundOutput[];
  error?: any;
};

/**
 * Node from ListNodes.
 */
export type Node = {
  nodeid: string;
  last_timestamp?: number;
  alias?: string;
  color?: string;
  features?: string[];
  addresses?: Address[];
  option_will_fund?: LiquidityAd;
};

export type ListNodes = {
  isLoading: boolean;
  nodes: Node[];
  error?: any;
};
