export type BalanceSheet = {
  periods: BalanceSheetPeriod[]
};

/**
 * All of the accounts represented by this period e.g. all of the 
 * Accounts' balances for a given day.  Or a given Month if the period was Monthly.
 */
export type BalanceSheetPeriod = {
  periodKey: string,
  accounts: BalanceSheetAccount[],
  totalBalanceAcrossAccounts: number
};

/**
 * An Account is either an onchain wallet or a channel.
 */
export type BalanceSheetAccount = {
  short_channel_id: string,
  remote_alias: string,
  balance: number,
  percentage: string,
  account: string,
};

export type BalanceSheetResultSet = {
  rows: BalanceSheetRow[];
};

export type BalanceSheetRow = {
  shortChannelId: string | null,
  remoteAlias: string | null,
  creditMsat: number,
  debitMsat: number,
  account: string,
  timestampUnix: number
};

const mapToBalanceSheetRow = (row: (string | null | number)[]): BalanceSheetRow => ({
  shortChannelId: row[0] as string | null,
  remoteAlias: row[1] as string | null,
  creditMsat: row[2] as number,
  debitMsat: row[3] as number,
  account: row[4] as string,
  timestampUnix: row[5] as number
});

export const convertRawToBalanceSheetResultSet = (raw: RawBalanceSheetResultSet): BalanceSheetResultSet => {
  return {
    rows: raw.rows.map(mapToBalanceSheetRow),
  };
};

export type RawBalanceSheetResultSet = {
  rows: RawBalanceSheetRow[],
};
 
export type RawBalanceSheetRow = [
  short_channel_id: string,
  remote_alias: string,
  credit_msat: number,
  debit_msat: number,
  account: string,
  timestamp: number
];
