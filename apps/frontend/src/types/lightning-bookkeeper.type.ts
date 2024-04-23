export type BalanceSheet = {
  isLoading: boolean,
  periods: Period[]
};

/**
 * All of the accounts represented by this period e.g. all of the 
 * Accounts' balances for a given day.  Or a given Month if the period was Monthly.
 */
export type Period = {
  periodKey: string,
  accounts: Account[],
  totalBalanceAcrossAccounts: number
};

/**
 * Onchain wallet or Channel
 */
export type Account = {
  short_channel_id: string,
  remote_alias: string,
  balance: number,
  percentage: string,
  account: string,
};

export type BalanceSheetResultSet = {
  isLoading: boolean,
  rows: BalanceSheetRow[],
};
 
export type BalanceSheetRow = [
  short_channel_id: string,
  remote_alias: string,
  credit_msat: number,
  debit_msat: number,
  account: string,
  timestamp: number
];
