import { Account, BalanceSheet, BalanceSheetResultSet, BalanceSheetRow, Period } from "../types/lightning-bookkeeper.type";
import { TimeGranularity } from "../utilities/constants";
import moment from "moment";

export function transformToBalanceSheet(sqlResultSet: BalanceSheetResultSet, timeGranularity: TimeGranularity): BalanceSheet {
  let returnPeriods: Period[] = [];

  if (sqlResultSet.rows.length > 0) {
    const eventsGroupedByPeriodMap: Map<string, BalanceSheetRow[]> = new Map();

    const getPeriodKey = (timestamp: number): string => {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');

      let periodKey: string;

      switch (timeGranularity) {
        case TimeGranularity.MINUTE:
          periodKey = `${year}-${month}-${day} ${hour}:${minute}`;
          break;
        case TimeGranularity.HOURLY:
          periodKey = `${year}-${month}-${day} ${hour}`;
          break;
        case TimeGranularity.DAILY:
          periodKey = `${year}-${month}-${day}`;
          break;
        case TimeGranularity.WEEKLY:
          const startOfWeek = moment(date).startOf('isoWeek');
          periodKey = startOfWeek.format("YYYY-MM-DD");
          break;
        case TimeGranularity.MONTHLY:
          periodKey = `${year}-${month}`;
          break;
        case TimeGranularity.YEARLY:
          periodKey = `${year}`;
          break;
      }
      return periodKey;
    };

    const earliestTimestamp: number = sqlResultSet.rows.reduce((previousRow, currentRow) =>
      previousRow[5] < currentRow[5] ? previousRow : currentRow)[5];
    const currentTimestamp: number = Math.floor(Date.now() / 1000);

    let periodKey: string;
    const allPeriodKeys: string[] = [];
    for (let ts = earliestTimestamp; ts <= currentTimestamp; ts += 3600) { //todo change unit incrementation based on TimeGranularity
      periodKey = getPeriodKey(ts);
      allPeriodKeys.push(periodKey);
    }

    allPeriodKeys.forEach(key => eventsGroupedByPeriodMap.set(key, []));

    for (let row of sqlResultSet.rows) {
      const periodKey = getPeriodKey(row[5]);
      if (!eventsGroupedByPeriodMap.has(periodKey)) {
        eventsGroupedByPeriodMap.set(periodKey, []);
      }
      eventsGroupedByPeriodMap.get(periodKey)!.push(row);
    }

    const sortedPeriodKeys = Array.from(eventsGroupedByPeriodMap.keys()).sort((a, b) => a.localeCompare(b));    
    const accountNamesSet: Set<string> = new Set(sqlResultSet.rows.map(row => row[4]));

    for (let i = 0; i < sortedPeriodKeys.length; i++) {
      let eventRows: BalanceSheetRow[] = [];
      let thisPeriodRows = eventsGroupedByPeriodMap.get(sortedPeriodKeys[i]);
      if (thisPeriodRows && thisPeriodRows.length > 0) {
        eventRows.push(...thisPeriodRows);
      }
      if (i > 0) {
        for (let c = 0; c < i; c++) {
          let prevRow = eventsGroupedByPeriodMap.get(sortedPeriodKeys[c]);
          if (prevRow) {
            eventRows.push(...prevRow);
          }
        }
      }

      let interimAccounts: InterimAccountRepresentation[] = [];
      let finalizedAccounts: Account[] = [];
      let totalBalanceAcrossAccounts = 0;

      for (const accountName of accountNamesSet) {
        let accountCreditMsat = 0;
        let accountDebitMsat = 0;
        let accountBalanceMsat = 0;

        const eventsFromThisAccount = eventRows.filter(r => r[4] === accountName);

        if (eventsFromThisAccount.length > 0) {
          eventsFromThisAccount.forEach(row => {
            accountCreditMsat += row[2];
            accountDebitMsat += row[3];
          });

          accountBalanceMsat = accountCreditMsat - accountDebitMsat;
          let accountBalanceSat = accountBalanceMsat / 1000;

          interimAccounts.push({
            short_channel_id: eventsFromThisAccount[0][0] === null ? "wallet" : eventsFromThisAccount[0][0],
            remote_alias: eventsFromThisAccount[0][1],
            balance: accountBalanceSat,
            account: accountName
          });
        }
      }

      interimAccounts.forEach(a => {
        totalBalanceAcrossAccounts += a.balance
      });
      interimAccounts.forEach(a => finalizedAccounts.push({
        short_channel_id: a.short_channel_id,
        remote_alias: a.remote_alias,
        balance: a.balance,
        percentage: ((a.balance / totalBalanceAcrossAccounts) * 100).toFixed(2) + "%",
        account: a.account
      }));

      const period: Period = {
        periodKey: sortedPeriodKeys[i],
        accounts: finalizedAccounts,
        totalBalanceAcrossAccounts: totalBalanceAcrossAccounts
      };

      returnPeriods.push(period);
    }

  }

  return {
    isLoading: sqlResultSet.isLoading,
    periods: returnPeriods
  };
}

type InterimAccountRepresentation = {
  short_channel_id: string,
  remote_alias: string,
  balance: number,
  account: string,
}
