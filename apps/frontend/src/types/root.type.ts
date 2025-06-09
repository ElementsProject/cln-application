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
  LIGHTNING_WS_PORT?: number;
  LIGHTNING_REST_PROTOCOL?: string;
  LIGHTNING_REST_PORT?: number;
  LIGHTNING_CERTS_PATH?: string;
  LIGHTNING_GRPC_PROTOCOL?: string;
  LIGHTNING_GRPC_PORT?: number;
  APP_VERSION?: string;
  NODE_PUBKEY?: string;
  COMMANDO_RUNE?: string;
  INVOICE_RUNE?: string;
  CLIENT_KEY?: string;
  CLIENT_CERT?: string;
  CA_CERT?: string;
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
    lightningNodeType?: string;
    singleSignOn?: boolean;
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
  peer_id: string;
  peer_connected: boolean;
  state: string;
  // Added for UI: Start
  current_state: string;
  node_alias: string;
  total_sat: number;
  to_us_sat: number;
  to_them_sat: number;
  // Added for UI: End
  reestablished?: boolean;
  scratch_txid?: string;
  last_tx_fee_msat?: number;
  direction?: number;
  close_to_addr?: string;
  channel_type?: ChannelType;
  updates?: { local?: any; remote?: any };
  ignore_fee_limits?: boolean;
  lost_state?: boolean;
  feerate?: ChannelFeeRate;
  owner?: string;
  short_channel_id?: string;
  channel_id?: string;
  funding_txid?: string;
  funding_outnum?: number;
  initial_feerate?: string;
  last_feerate?: string;
  next_feerate?: string;
  next_fee_step?: number;
  inflight?: Inflight[];
  close_to?: string;
  private?: boolean;
  opener?: string;
  closer?: string;
  features?: string[];
  funding?: Funding;
  total_msat?: number;
  to_us_msat?: number;
  to_them_msat?: number;
  min_to_us_msat?: number;
  max_to_us_msat?: number;
  fee_base_msat?: number;
  fee_proportional_millionths?: number;
  dust_limit_msat?: number;
  max_total_htlc_in_msat?: number;
  their_reserve_msat?: number;
  our_reserve_msat?: number;
  spendable_msat?: number;
  receivable_msat?: number;
  minimum_htlc_in_msat?: number;
  minimum_htlc_out_msat?: number;
  maximum_htlc_out_msat?: number;
  their_to_self_delay?: number;
  our_to_self_delay?: number;
  max_accepted_htlcs?: number;
  alias?: Alias;
  state_changes?: StateChange[];
  status?: string[];
  in_payments_offered?: number;
  in_offered_msat?: number;
  in_payments_fulfilled?: number;
  in_fulfilled_msat?: number;
  out_payments_offered?: number;
  out_offered_msat?: number;
  out_payments_fulfilled?: number;
  out_fulfilled_msat?: number;
  last_stable_connection?: number;
  htlcs?: HTLC[];
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
