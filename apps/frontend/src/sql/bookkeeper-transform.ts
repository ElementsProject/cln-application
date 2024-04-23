import { Account, BalanceSheet, BalanceSheetResultSet } from "../types/lightning-bookkeeper.type";

export function transformToBalanceSheet(sqlResultSet: BalanceSheetResultSet): BalanceSheet {
  let accounts: Account[] = [];

  if (sqlResultSet.rows) {
    var totalBalance = 0;
    sqlResultSet.rows.forEach(r => { totalBalance += r[2]; });

    accounts = sqlResultSet.rows.map(row => {
      var balance = row[2];

      var percentage: string;
      if (totalBalance > 0) {
        percentage = ((balance / totalBalance) * 100).toFixed(2) + '%';
      } else {
        percentage = '0.00%';
      }

      const account: Account = {
        short_channel_id: row[0] === null ? "wallet" : row[0],
        remote_alias: row[1] === null ? "-" : row[1],
        balance: balance,
        percentage: percentage,
        account: row[3]
      };

      return account;
    });
  }

  return {
    isLoading: sqlResultSet.isLoading,
    accounts: accounts,
  }
}
