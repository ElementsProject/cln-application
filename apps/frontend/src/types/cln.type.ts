export interface CLNLoaderData {
  listLightningTransactions: ListLightningTransactions;
  listOffers: ListOffers;
  listBitcoinTransactions: ListBitcoinTransactions;
  feeRates: NodeFeeRate;
}

export type CLNState = {
  listLightningTransactions: ListLightningTransactions;
  listOffers: ListOffers;
  listBitcoinTransactions: ListBitcoinTransactions;
  feeRate: NodeFeeRate;
};

export type AccountEvents = {
  isLoading: boolean;
  events: BTCTransaction[];
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
  mpps?: any[];
  // For backward compatibility: Start
  msatoshi?: number;
  msatoshi_sent?: number;
  // For backward compatibility: End
};

export type LightningTransaction = {
  type: string; //INVOICE/PAYMENT
  // Both
  payment_hash?: string;
  status?: string;
  label?: string;
  description?: string;
  bolt11?: string;
  bolt12?: string;
  payment_preimage?: string;
  amount_msat?: number;
  // Invoice specific
  amount_received_msat?: number;
  expires_at?: number;
  paid_at?: number;
  // Payment specific
  amount_sent_msat?: number;
  created_at?: number;
  completed_at?: number;
  destination?: string;
  groupid?: number;
  partid?: number;
};

export type ListLightningTransactions = {
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  clnTransactions: LightningTransaction[];
  error?: any;
};

export type TxInput = {
  txid?: string;
  index?: string;
  sequence?: string;
  type?: string;
  channel?: string;
};

export type TxOutput = {
  index?: string;
  amount_msat?: string;
  scriptPubKey?: string;
  type?: string;
  channel?: string;
};

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
};

export type btcDeposit = {
  tag: string;
  credit_msat?: string;
  timestamp?: number;
  txid?: string;
  blockheight: number;
  outpoint?: string;
  payment_id?: string;
  description?: string;
};

export type btcWithdraw = {
  tag: string;
  debit_msat?: string;
  timestamp?: number;
  txid?: string;
  blockheight: number;
  outpoint?: string;
  payment_id?: string;
  description?: string;
};

export type BTCTransaction = {
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
};

export type ListBitcoinTransactions = {
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  btcTransactions: BTCTransaction[];
  error?: any;
};

export type FeeRatePerKB = {
  min_acceptable: number;
  max_acceptable: number;
  opening?: number;
  mutual_close?: number;
  unilateral_close?: number;
  delayed_to_us?: number;
  htlc_resolution?: number;
  penalty?: number;
};

export type FeeRatePerKW = {
  min_acceptable: number;
  max_acceptable: number;
  opening?: number;
  mutual_close?: number;
  unilateral_close?: number;
  delayed_to_us?: number;
  htlc_resolution?: number;
  penalty?: number;
};

export type OnChainFeeEstimates = {
  opening_channel_satoshis: number;
  mutual_close_satoshis?: number;
  unilateral_close_satoshis?: number;
  htlc_timeout_satoshis?: number;
  htlc_success_satoshis?: number;
};

export type NodeFeeRate = {
  isLoading: boolean;
  perkw?: FeeRatePerKW;
  perkb?: FeeRatePerKB;
  onchain_fee_estimates?: OnChainFeeEstimates;
  error?: any;
};

export type Offer = {
  bolt12: string;
  offer_id?: string;
  active?: boolean;
  single_use?: boolean;
  used?: boolean;
  label?: string;
  description?: string;
};

export type ListOffers = {
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  offers: Offer[];
  error?: any;
};

export type Rune = {
  rune: string;
  unique_id: string;
  restrictions?: any[];
  restrictions_as_english?: string;
};
