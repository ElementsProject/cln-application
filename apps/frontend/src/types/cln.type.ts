export interface CLNLoaderData {
  listInvoices: ListInvoices;
  listSendPays: ListPayments;
  listOffers: ListOffers;
  listAccountEvents: AccountEvents;
  feeRates: NodeFeeRate;
}

export type CLNState = {
  listInvoices: ListInvoices;
  listPayments: ListPayments;
  listOffers: ListOffers;
  listLightningTransactions: any;
  listBitcoinTransactions: any;
  feeRate: NodeFeeRate;
};

export type AccountEvents = {
  isLoading: boolean;
  events: BkprTransaction[];
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
  // For backward compatibility: Start
  msatoshi?: number;
  msatoshi_sent?: number;
  // For backward compatibility: End
};

export type ListPayments = {
  isLoading: boolean;
  payments?: Payment[];
  error?: any;
};

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
};

export type ListLightningTransactions = {
  isLoading: boolean;
  clnTransactions?: LightningTransaction[];
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
};

export type ListBitcoinTransactions = {
  isLoading: boolean;
  btcTransactions?: BkprTransaction[];
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
  valid?: boolean;
};

export type ListOffers = {
  isLoading: boolean;
  offers?: Offer[];
  error?: any;
};

export type Rune = {
  rune: string;
  unique_id: string;
  restrictions?: any[];
  restrictions_as_english?: string;
};
