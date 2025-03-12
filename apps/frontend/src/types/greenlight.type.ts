export type GLNodeInfo = {
  isLoading: boolean;
  id?: string;
  alias?: string;
  color?: string;
  num_peers?: number;
  num_pending_channels?: number;
  num_active_channels?: number;
  num_inactive_channels?: number;
  version?: string;
  blockheight?: number;
  network?: string;
  fees_collected_msat?: string;
  warning_bitcoind_sync?: string;
  our_features?: any;
  error?: any;
};

export type GLNodeCapacity = {
  isLoading: boolean;
  inbound?: number;
  outbound?: number;
  error?: any;
};

export type BkprTransaction = {
  account: string;
  type?: string; // 'onchain_fee', 'chain', 'channel'
  credit_msat?: string | number;
  debit_msat?: string | number;
  currency?: string;
  timestamp?: number;
  tag?: string;
  txid?: string;
  blockheight: number;
  outpoint?: string;
  origin?: string;
  payment_id?: string;
  description?: string;
  fees_msat?: string;
  is_rebalance?: boolean;
  part_id?: number;
}

export type GLTransactions = {
  isLoading: boolean;
  gl_transactions?: BkprTransaction[];
  error?: any;
}

export type LSPProtocolOneDetail = {
  min_required_channel_confirmations?: number;
  min_funding_confirms_within_blocks?: number;
  supports_zero_channel_reserve?: boolean;
  max_channel_expiry_blocks?: number;
  min_initial_client_balance_sat?: number;
  max_initial_client_balance_sat?: number;
  min_initial_lsp_balance_sat?: number;
  max_initial_lsp_balance_sat?: number;
  min_channel_balance_sat?: number;
  max_channel_balance_sat?: number;
}

export type OpeningFeeParamMenu = {
  min_fee_msat?: number;
  proportional?: number;
  valid_until?: string;
  min_lifetime?: number;
  max_client_to_self_delay?: number;
  min_payment_size_msat?: number;
  max_payment_size_msat?: number;
  promise?: string;
}

export type LSPProtocolTwoDetail = {
  opening_fee_params_menu: OpeningFeeParamMenu;
}

export type LSPS = {
  public_key?: string;
  protocols?: LSPProtocolOneDetail | LSPProtocolTwoDetail;
}

export type LSPList = {
  isLoading: boolean;
  glLSPS?: LSPS[];
  error?: any;
}
