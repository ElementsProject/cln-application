export type SatsFlow = {
  periods: SatsFlowPeriod[]
};

/**
 * @property {string} periodKey - The period of time this {@link SatsFlowPeriod} represents, such as the day of 2024-07-11.
 * @property {TagGroup[]} tagGroups - A grouping of events by a shared tag.  Sorted by inflow.
 * @property {number} inflowSat - The positive inflows for this period.  The total sum of credits in this period.
 * @property {number} outflowSat - The negative inflows for this period.  The total sum of debits in this period.
 * @property {number} netInflowSat - The total net inflow for this period.  If negative, it is an outflow.
 * @property {number} volumeSat - The total volume of sats in this period, aka the absolute value of credits + debits.
 */
export type SatsFlowPeriod = {
  periodKey: string,
  tagGroups: TagGroup[],
  inflowSat: number,
  outflowSat: number,
  netInflowSat: number,
  totalVolumeSat: number
};

/**
 * A Tag Group is a group of events that share the same tag, such as all the onchain_fee events.
 * 
 * @property {SatsFlowEvent[]} events - The events that make up this tag.
 * @property {string} tag - The name these events were tagged with, such as 'deposit'.
 * @property {number} netInflowSat - The total inflow or outflow of sats in this group of events.  
 * @property {number} creditSat - The total sum of credits in sats in this group of events.
 * @property {number} debitSat - The total sum of credits in sats in this group of events.
 * @property {number} volumeSat - The total movement of sats among these events, aka the absolute value of credits + debits.
 */
export type TagGroup = {
  events: SatsFlowEvent[],
  tag: string,
  netInflowSat: number,
  creditSat: number,
  debitSat: number,
  volumeSat: number
};

/**
 * @property {number} netInflowSats - The net inflow for this event.  If negative, it is an outflow.
 * @property {number} account - Accounts can be either the onchain wallet or channels.
 * @property {string} tag - The tagged name for this event.
 * @property {number} timestampUnix - The timestamp of this event in seconds since Unix epoch.
 */
export type SatsFlowEvent = {
  netInflowSat: number,
  account: string,
  tag: string,
  creditSat: number,
  debitSat: number,
  currency: string,
  timestampUnix: number,
  description: string,
  outpoint: string,
  txid: string,
  paymentId: string
};

export type SatsFlowResultSet = {
  rows: SatsFlowRow[]
};

export type SatsFlowRow = {
  account: string,
  tag: string,
  creditMsat: number,
  debitMsat: number,
  currency: string,
  timestampUnix: number,
  description: string,
  outpoint: string,
  txid: string,
  paymentId: string
};

const mapToSatsFlowRow = (row: (string | number)[]): SatsFlowRow => ({
  account: row[0] as string,
  tag: row[1] as string,
  creditMsat: row[2] as number,
  debitMsat: row[3] as number,
  currency: row[4] as string,
  timestampUnix: row[5] as number,
  description: row[6] as string,
  outpoint: row[7] as string,
  txid: row[8] as string,
  paymentId: row[9] as string
});

export const convertRawToSatsFlowResultSet = (raw: RawSatsFlowResultSet): SatsFlowResultSet => {
  return {
    rows: raw.rows.map(mapToSatsFlowRow)
  };
};

export type RawSatsFlowResultSet = {
  rows: RawSatsFlowRow[]
};

export type RawSatsFlowRow = [
  account: string,
  tag: string,
  credit_msat: number,
  debit_msat: number,
  currency: string,
  timestamp: number,
  description: string,
  outpoint: string,
  txid: string,
  payment_id: string
];

export enum Sign {
  POSITIVE,
  NEGATIVE
}
