export type Address = {
  type?: string;
  address?: string;
  port?: number;
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
  fees_collected_msat?: string;
  'lightning-dir'?: string;
  warning_bitcoind_sync?: string;
  our_features?: any;
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
}

export type ListNodes = {
  isLoading: boolean;
  nodes: Node[];
  error?: any;
}

export type ChannelFeeRate = {
  perkw?: number;
  perkb?: number;
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
}

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
}

export type ChannelType = {
  bits?: number[];
  names?: string[];
}

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
  updates?: { local?: any; remote?: any; };
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
  error?: any;
}

export type Invoice = {
  bolt11?: string;
  bolt12?: string;
  description?: string;
  expires_at?: number;
  label?: string;
  amount_msat?: number;
  amount_received_msat?: number;
  local_offer_id?: string;
  invreq_payer_note?: string;
  paid_at?: number;
  pay_index?: number;
  payment_hash?: string;
  payment_preimage?: string;
  status?: string;
  created_index?: number;
  // For backward compatibility: Start
  msatoshi?: number;
  msatoshi_received?: number;
  // For backward compatibility: End
};

export type ListInvoices = {
  isLoading: boolean;
  invoices?: Invoice[];
  error?: any;
}

export type Payment = {
  is_group: boolean;
  is_expanded: boolean;
  total_parts: number;
  id?: number;
  groupid?: number;
  payment_hash?: string;
  status?: string;
  created_at?: number;
  amount_msat?: number;
  amount_sent_msat?: number;
  destination?: string;
  label?: string;
  bolt11?: string;
  description?: string;
  bolt12?: string;
  payment_preimage?: string;
  erroronion?: string;
  // For backward compatibility: Start
  msatoshi?: number;
  msatoshi_sent?: number;
  // For backward compatibility: End
}

export type ListPayments = {
  isLoading: boolean;
  payments?: Payment[];
  error?: any;
}

export type LightningTransaction = {
  type: string; //INVOICE/PAYMENT
  // Both
  payment_hash?: string;
  status?: string;
  label?: string;
  bolt11?: string;
  description?: string;
  bolt12?: string;
  payment_preimage?: string;
  // Payment
  created_at?: number;
  destination?: string;
  // Invoice
  created_index?: number;
  expires_at?: number;
  paid_at?: number;
  amount_msat?: number;
  amount_received_msat?: number;
}

export type ListLightningTransactions = {
  isLoading: boolean;
  clnTransactions?: LightningTransaction[];
  error?: any;
}

export type TxInput = {
  txid?: string;
  index?: string;
  sequence?: string;
  type?: string;
  channel?: string;
}

export type TxOutput = {
  index?: string;
  amount_msat?: string;
  scriptPubKey?: string;
  type?: string;
  channel?: string;
}

export type Transaction = {
  hash?: string;
  rawtx?: string;
  blockheight?: string;
  txindex?: string;
  locktime?: string;
  version?: string;
  inputs?: TxInput[];
  outputs?: TxOutput[];
  type?: string[];
  channel?: string;
}

export type btcDeposit = {
  tag: string;
  credit_msat?: string;
  timestamp?: number;
  txid?: string;
  blockheight: number;
  outpoint?: string;
  payment_id?: string;
  description?: string;
}

export type btcWithdraw = {
  tag: string;
  debit_msat?: string;
  timestamp?: number;
  txid?: string;
  blockheight: number;
  outpoint?: string;
  payment_id?: string;
  description?: string;
}

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

export type ListBitcoinTransactions = {
  isLoading: boolean;
  btcTransactions?: BkprTransaction[];
  error?: any;
}

export type FundOutput = {
  txid?: string;
  output?: string;
  value?: number;
  amount_msat?: number;
  scriptpubkey?: string;
  status?: string;
  reserved?: boolean;
  address?: string;
  redeemscript?: string;
  blockheight?: string;
  reserved_to_block?: string;
}

export type FundChannel = {
  peer_id?: string;
  funding_txid?: string;
  funding_output?: string;
  connected?: boolean;
  state?: string;
  short_channel_id?: string;
  our_amount_msat?: number;
  channel_sat?: number;
  channel_total_sat?: number;
  amount_msat?: number;
}

export type Fund = {
  isLoading: boolean;
  channels?: FundChannel[];
  outputs?: FundOutput[];
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
}

export type FeeRatePerKB = {
  min_acceptable: number;
  max_acceptable: number;
  opening?: number;
  mutual_close?: number;
  unilateral_close?: number;
  delayed_to_us?: number;
  htlc_resolution?: number;
  penalty?: number;
}

export type FeeRatePerKW = {
  min_acceptable: number;
  max_acceptable: number;
  opening?: number;
  mutual_close?: number;
  unilateral_close?: number;
  delayed_to_us?: number;
  htlc_resolution?: number;
  penalty?: number;
}

export type OnChainFeeEstimates = {
  opening_channel_satoshis: number;
  mutual_close_satoshis?: number;
  unilateral_close_satoshis?: number;
  htlc_timeout_satoshis?: number;
  htlc_success_satoshis?: number;
}

export type NodeFeeRate = {
  isLoading: boolean;
  perkw?: FeeRatePerKW;
  perkb?: FeeRatePerKB;
  onchain_fee_estimates?: OnChainFeeEstimates;
  error?: any;
}

export type Offer = {
  bolt12: string;
  offer_id?: string;
  active?: boolean;
  single_use?: boolean;
  used?: boolean;
  label?: string;
  valid?: boolean;
}

export type ListOffers = {
  isLoading: boolean;
  offers?: Offer[];
  error?: any;
}

export type Inflight = {
  funding_txid: string;
  funding_outnum: number;
  feerate: string;
  total_funding_msat: string;
  splice_amount: number;
  our_funding_msat: string;
  scratch_txid?: string;
}

export type Rune = {
  rune: string;
  unique_id: string;
  restrictions?: any[];
  restrictions_as_english?: string;
}
