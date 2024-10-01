import { BalanceSheetAccount, BalanceSheet, BalanceSheetRow, convertRawToBalanceSheetResultSet, BalanceSheetPeriod, RawBalanceSheetResultSet } from "../types/lightning-balancesheet.type";
import { convertRawToSatsFlowResultSet, RawSatsFlowResultSet, SatsFlow, SatsFlowEvent, SatsFlowPeriod, SatsFlowRow, TagGroup } from "../types/lightning-satsflow.type";
import { convertRawToVolumeResultSet, Forward, RawVolumeResultSet, VolumeData } from "../types/lightning-volume.type";
import { secondsForTimeGranularity, TimeGranularity } from "../utilities/constants";
import moment from "moment";

export function transformToBalanceSheet(rawSqlResultSet: RawBalanceSheetResultSet, timeGranularity: TimeGranularity): BalanceSheet {
  type InterimAccountRepresentation = {
    short_channel_id: string,
    remote_alias: string,
    balance: number,
    account: string,
  };

  let returnPeriods: BalanceSheetPeriod[] = [];

  if (rawSqlResultSet.rows.length > 0) {
    const periodKeyToBalanceSheetRowMap: Map<string, BalanceSheetRow[]> = new Map();

    const sqlResultSet = convertRawToBalanceSheetResultSet(rawSqlResultSet);

    const earliestTimestamp: number = sqlResultSet.rows.reduce((previousRow, currentRow) =>
      previousRow.timestampUnix < currentRow.timestampUnix ? previousRow : currentRow).timestampUnix;
    const currentTimestamp: number = Math.floor(Date.now() / 1000);

    //Calculate all time periods from first db entry to today
    let periodKey: string;
    const allPeriodKeys: string[] = [];
    const incrementSeconds = secondsForTimeGranularity(timeGranularity);
    for (let ts = earliestTimestamp; ts <= currentTimestamp; ts += incrementSeconds) {
      periodKey = getPeriodKey(ts, timeGranularity);
      allPeriodKeys.push(periodKey);
    }

    allPeriodKeys.forEach(key => periodKeyToBalanceSheetRowMap.set(key, []));

    //Associate account event db rows to periods
    for (let row of sqlResultSet.rows) {
      const periodKey = getPeriodKey(row.timestampUnix, timeGranularity);
      if (!periodKeyToBalanceSheetRowMap.has(periodKey)) {
        periodKeyToBalanceSheetRowMap.set(periodKey, []);
      }
      periodKeyToBalanceSheetRowMap.get(periodKey)!.push(row);
    }

    const sortedPeriodKeys = Array.from(periodKeyToBalanceSheetRowMap.keys()).sort((a, b) => a.localeCompare(b));
    const accountNamesSet: Set<string> = new Set(sqlResultSet.rows.map(row => row.account));

    //Generate each Period and add to return list
    for (let i = 0; i < sortedPeriodKeys.length; i++) {
      let eventRows: BalanceSheetRow[] = [];
      let thisPeriodRows = periodKeyToBalanceSheetRowMap.get(sortedPeriodKeys[i]);
      if (thisPeriodRows && thisPeriodRows.length > 0) {
        eventRows.push(...thisPeriodRows);
      }
      //A Period also contains all previous Periods' events, we add them here
      if (i > 0) {
        for (let c = 0; c < i; c++) {
          let prevRow = periodKeyToBalanceSheetRowMap.get(sortedPeriodKeys[c]);
          if (prevRow) {
            eventRows.push(...prevRow);
          }
        }
      }

      let interimAccounts: InterimAccountRepresentation[] = [];
      let finalizedAccounts: BalanceSheetAccount[] = [];
      let totalBalanceAcrossAccounts = 0;

      for (const accountName of accountNamesSet) {
        let accountCreditMsat = 0;
        let accountDebitMsat = 0;
        let accountBalanceMsat = 0;

        const eventsFromThisAccount = eventRows.filter(r => r.account === accountName);

        if (eventsFromThisAccount.length > 0) {
          eventsFromThisAccount.forEach(row => {
            accountCreditMsat += row.creditMsat;
            accountDebitMsat += row.debitMsat;
          });

          accountBalanceMsat = accountCreditMsat - accountDebitMsat;
          let accountBalanceSat = accountBalanceMsat / 1000;

          interimAccounts.push({
            short_channel_id: eventsFromThisAccount[0].shortChannelId === null ? "wallet" : eventsFromThisAccount[0].shortChannelId,
            remote_alias: eventsFromThisAccount[0].remoteAlias === null? "n/a" : eventsFromThisAccount[0].remoteAlias,
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

      const period: BalanceSheetPeriod = {
        periodKey: sortedPeriodKeys[i],
        accounts: finalizedAccounts,
        totalBalanceAcrossAccounts: totalBalanceAcrossAccounts
      };

      returnPeriods.push(period);
    }

  }

  return {
    periods: returnPeriods
  };
};

export function transformToSatsFlow(
  rawSqlResultSet: RawSatsFlowResultSet,
  timeGranularity: TimeGranularity,
  hideZeroActivityPeriods: boolean
): SatsFlow {
  let returnPeriods: SatsFlowPeriod[] = [];

  if (rawSqlResultSet.rows.length > 0) {
    const periodKeyToSatsFlowRowMap: Map<string, SatsFlowRow[]> = new Map();
    const sqlResultSet = convertRawToSatsFlowResultSet(rawSqlResultSet);
    const earliestTimestamp: number = sqlResultSet.rows.reduce((previousRow, currentRow) =>
      previousRow.timestampUnix < currentRow.timestampUnix ? previousRow : currentRow,
    ).timestampUnix;
    const currentTimestamp: number = Math.floor(Date.now() / 1000);

    //Calculate all time periods from first db entry to today
    let periodKey: string;
    const allPeriodKeys: string[] = [];
    const incrementSeconds = secondsForTimeGranularity(timeGranularity);
    for (let ts = earliestTimestamp; ts <= currentTimestamp; ts += incrementSeconds) {
      periodKey = getPeriodKey(ts, timeGranularity);
      allPeriodKeys.push(periodKey);
    }

    allPeriodKeys.forEach(key => periodKeyToSatsFlowRowMap.set(key, []));

    //Associate income event db rows to periods
    for (let row of sqlResultSet.rows) {
      const periodKey = getPeriodKey(row.timestampUnix, timeGranularity);
      if (!periodKeyToSatsFlowRowMap.has(periodKey)) {
        periodKeyToSatsFlowRowMap.set(periodKey, []);
      }
      periodKeyToSatsFlowRowMap.get(periodKey)!.push(row);
    }

    const sortedPeriodKeys = Array.from(periodKeyToSatsFlowRowMap.keys()).sort((a, b) =>
      a.localeCompare(b),
    );

    //Generate each Period and add to return list
    for (let i = 0; i < sortedPeriodKeys.length; i++) {
      let eventRows: SatsFlowRow[] = periodKeyToSatsFlowRowMap.get(sortedPeriodKeys[i])!;

      if (hideZeroActivityPeriods && eventRows.length === 0) {
        continue;
      }

      let events: SatsFlowEvent[] = [];

      //Calculate event inflow and convert to sats
      for (let e of eventRows) {
        let creditSat = e.creditMsat / 1000;
        let debitSat = e.debitMsat / 1000;
        let totalNetInflowSat = creditSat - debitSat;
        events.push({
          netInflowSat: totalNetInflowSat,
          account: e.account,
          tag: e.tag,
          creditSat: creditSat,
          debitSat: debitSat,
          currency: e.currency,
          timestampUnix: e.timestampUnix,
          description: e.description,
          outpoint: e.outpoint,
          txid: e.txid,
          paymentId: e.paymentId,
        });
      }

      let periodInflowSat = 0;
      let periodOutflowSat = 0;
      let periodNetInflowSat = 0;
      let periodVolumeSat = 0;

      //Calculate tag and period stats
      //Group events into respective tags
      const tagGroups: TagGroup[] = events.reduce((acc: TagGroup[], event: SatsFlowEvent) => {
        const tagGroup = acc.find(g => g.tag === event.tag)!;
        if (tagGroup) {
          tagGroup.events.push(event);
          tagGroup.netInflowSat += event.netInflowSat;
          tagGroup.creditSat += event.creditSat;
          tagGroup.debitSat += event.debitSat;
          tagGroup.volumeSat += event.creditSat + event.debitSat;
          periodNetInflowSat += event.netInflowSat;
          periodInflowSat += event.creditSat;
          periodOutflowSat += event.debitSat;
          periodVolumeSat += event.creditSat + event.debitSat;
        } else {
          acc.push({
            tag: getTag(event),
            events: [event],
            netInflowSat: event.netInflowSat,
            creditSat: event.creditSat,
            debitSat: event.debitSat,
            volumeSat: event.creditSat + event.debitSat,
          });
          periodNetInflowSat += event.netInflowSat;
          periodInflowSat += event.creditSat;
          periodOutflowSat += event.debitSat;
          periodVolumeSat += event.creditSat + event.debitSat;
        }
        return acc;
      }, []);

      //Sort tag net inflows to accommodate drawing of bars.
      //First negative inflows sorted from 0 to -Infinity.
      //Then positive inflows sorted from 0 to +Infinity.
      //e.g: -1, -5, -10, 1, 4, 20
      tagGroups.sort((a, b) => {
        if (a.netInflowSat < 0 && b.netInflowSat < 0) {
          return b.netInflowSat - a.netInflowSat;
        }
        if (a.netInflowSat >= 0 && b.netInflowSat >= 0) {
          return a.netInflowSat - b.netInflowSat;
        }
        return a.netInflowSat < 0 ? -1 : 1;
      });

      const period: SatsFlowPeriod = {
        periodKey: sortedPeriodKeys[i],
        tagGroups: tagGroups,
        inflowSat: periodInflowSat,
        outflowSat: periodOutflowSat,
        netInflowSat: periodNetInflowSat,
        totalVolumeSat: periodVolumeSat,
      };

      returnPeriods.push(period);
    }
  }

  return {
    periods: returnPeriods
  };
};

export function transformToVolumeData(rawSqlResultSet: RawVolumeResultSet): VolumeData {
  let returnForwards: Forward[] = [];
  let totalOutboundSat = 0;
  let totalFeeSat = 0;

  if (rawSqlResultSet.rows.length > 0) {
    const sqlResultSet = convertRawToVolumeResultSet(rawSqlResultSet);

    sqlResultSet.rows.forEach(forward => {
      returnForwards.push({
        inboundChannelSCID: forward.inChannelSCID,
        inboundPeerId: forward.inChannelPeerId,
        inboundPeerAlias: forward.inChannelPeerAlias,
        inboundSat: forward.inMsat / 1000,
        outboundChannelSCID: forward.outChannelSCID,
        outboundPeerId: forward.outChannelPeerId,
        outboundPeerAlias: forward.outChannelPeerAlias,
        outboundSat: forward.outMsat / 1000,
        feeSat: forward.feeMsat / 1000,
      });
      totalOutboundSat += forward.outMsat / 1000;
      totalFeeSat += forward.feeMsat / 1000;
    });
  }

  return {
    forwards: returnForwards,
    totalOutboundSat: totalOutboundSat,
    totalFeeSat: totalFeeSat
  };
};

function getPeriodKey(timestamp: number, timeGranularity: TimeGranularity): string {
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

/**
 * Process tags as needed.
 * 
 * @param event - The event to process the tag for.
 */
function getTag(event: SatsFlowEvent): string {
  switch (event.tag) {
    case "invoice":
      if (event.netInflowSat >= 0) {
        return "received_invoice";
      } else {
        return "paid_invoice"
      }
    default:
      return event.tag;
  }
};
