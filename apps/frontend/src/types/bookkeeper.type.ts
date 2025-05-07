import { TimeGranularity } from "../utilities/constants";

export interface BKPRLoaderData {
  timeGranularity: TimeGranularity;
  startTimestamp: number;
  endTimestamp: number;
  satsFlow: SatsFlow;
  accountEvents: AccountEvents;
  volume: VolumeData;
}

export type BKPRState = {
  summary: BkprSummaryInfo;
  accountEvents: AccountEvents;
  satsFlow: SatsFlow;
  volume: VolumeData;
}

export type SummaryRoute = {
  channel_scids: string;
  channel_aliases: string;
  fee_msat: number;
};

export type BkprSummaryInfo = {
  isLoading: boolean;
  onchain_fee_msat?: number;
  routing_revenue_msat?: number;
  total_invoice_received_msat?: number;
  total_payments_sent_msat?: number;
  inflows_for_period_msat?: number;
  outflows_for_period_msat?: number;
  total_fee_msat?: number;
  most_traffic_route?: SummaryRoute
  least_traffic_route?: SummaryRoute;
  errors?: any[];
}

export type AccountEvents = {
  isLoading: boolean;
  events: AccountEventsAccount[];
  periods: AccountEventsPeriod[];
  startTimestamp: number;
  endTimestamp: number;
  timeGranularity: TimeGranularity;
  error?: any;
};

export type AccountEventsPeriod = {
  period_key: string;
  accounts: AccountEventsAccount[];
  total_balance_across_accounts: number;
};

export type AccountEventsAccount = {
  short_channel_id?: string,
  remote_alias?: string,
  credit_msat: number,
  debit_msat: number,
  account: string,
  timestamp: number,
  balance_msat: number
};

export type SatsFlow = {
  isLoading: boolean;
  satsFlowEvents: SatsFlowEvent[];
  periods: SatsFlowPeriod[];
  startTimestamp: number;
  endTimestamp: number;
  timeGranularity: TimeGranularity;
  error?: any;
};

export type SatsFlowPeriod = {
  period_key: string;
  tag_groups: TagGroup[];
  inflow_msat: number;
  outflow_msat: number;
};

export type TagGroup = {
  events: SatsFlowEvent[];
  tag: string;
  credit_msat: number;
  debit_msat: number;
};

export type SatsFlowEvent = {
  account: string;
  tag: string;
  credit_msat: number;
  debit_msat: number;
  currency: string;
  timestamp: number;
  description?: string;
  outpoint: string;
  txid?: string;
  payment_id?: string;
};

export type VolumeData = {
  isLoading: boolean;
  forwards: VolumeRow[];
  error?: any;
};

export type VolumeRow = {
  in_channel_scid: string;
  in_channel_peer_id: string;
  in_channel_peer_alias: string;
  in_msat: number;
  out_channel_scid: string;
  out_channel_peer_id: string;
  out_channel_peer_alias: string;
  out_msat: number;
  fee_msat: number;
};
