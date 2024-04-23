export type BalanceSheet = {
  isLoading: boolean,
  accounts: Account[];
};

/**
 * Onchain wallet or Channel
 */
export type Account = {
  short_channel_id: string,
  remote_alias: string
  balance: number,
  percentage: string,
  account: string,
};

export type BalanceSheetResultSet = {
  isLoading: boolean;
  rows: BalanceSheetRow,
};
 
export type BalanceSheetRow = [
  short_channel_id: string,
  remote_alias: string,
  balance: number,
  account: string
];
