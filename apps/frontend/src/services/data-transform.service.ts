import {
  AccountEventsPeriod,
  SatsFlowEvent,
  AccountEventsAccount,
  SatsFlowPeriod,
  SatsFlow,
  VolumeData,
  VolumeRow,
  AccountEvents,
  BkprSummaryInfo,
  SummaryRoute,
} from '../types/bookkeeper.type';
import { getPeriodKey, getTimestampFromPeriodKey, getTimestampWithGranularity, secondsForTimeGranularity, TimeGranularity } from '../utilities/constants';

export function calculateAllPeriodKeys(
  calculateFor: string,
  timeGranularity: TimeGranularity,
  startTimestamp: number,
  endTimestamp: number,
): Map<string, AccountEventsPeriod | SatsFlowPeriod> {
  const incrementSeconds = secondsForTimeGranularity(timeGranularity, startTimestamp);
  const period_keysMap = new Map<string, AccountEventsPeriod | SatsFlowPeriod>();
  let ts = startTimestamp;

  while (ts <= endTimestamp) {
    const period_key = getPeriodKey(timeGranularity, ts);
    const period =
      calculateFor === 'SatsFlow'
        ? {
            period_key,
            tag_groups: [],
            inflow_msat: 0,
            outflow_msat: 0,
          }
        : {
            period_key,
            accounts: [],
            total_balance_across_accounts: 0,
          };

    period_keysMap.set(period_key, period);
    ts += (timeGranularity === TimeGranularity.MONTHLY ? secondsForTimeGranularity(timeGranularity, ts) : incrementSeconds);
  }
  return period_keysMap;
}

function areAccountsIdentical(prev: AccountEventsAccount[], current: AccountEventsAccount[]): boolean {
  if (prev.length !== current.length) return false;
  
  // Compare each account's properties
  return prev.every((prevAccount, index) => {
    const currentAccount = current[index];
    return (
      prevAccount.account === currentAccount.account &&
      prevAccount.balance_msat === currentAccount.balance_msat &&
      prevAccount.credit_msat === currentAccount.credit_msat &&
      prevAccount.debit_msat === currentAccount.debit_msat
    );
  });
}

export function filterZeroActivityAccountEvents(
  periods: AccountEventsPeriod[],
  showZeroActivityPeriods: boolean,
): AccountEventsPeriod[] {
  if (showZeroActivityPeriods) return periods;
  return periods.filter((period, index) => {
    if (index === 0) return true;
    const prevAccounts = periods[index-1].accounts;
    return !areAccountsIdentical(prevAccounts, period.accounts);
  });
}

export function transformAccountEventsByPeriods(
  sqlResultSet: AccountEventsAccount[],
  timeGranularity: TimeGranularity,
  startTimestamp: number,
  endTimestamp: number,
): AccountEvents {
  if (sqlResultSet.length === 0) {
    return { isLoading: false, events: [], periods: [], timeGranularity: TimeGranularity.DAILY, startTimestamp: 0, endTimestamp: 0 };
  }

  const uniqueAccountNames = new Set<string>();
  const prevAccounts = new Map<string, AccountEventsAccount>();
  let totalPrevBalance = 0;

  // Step 1: Generate all period keys from the first row's timestamp
  const earliestTimestamp = getTimestampFromPeriodKey(timeGranularity, getPeriodKey(timeGranularity, sqlResultSet[0].timestamp));
  const currentGranularTimestamp = getTimestampWithGranularity(timeGranularity, new Date(), 'end');
  // The data is calculated cumulatively, so we need to calculate all periods from the earliest timestamp to the current time
  const allPeriods = calculateAllPeriodKeys('AccountEvents', timeGranularity, earliestTimestamp, currentGranularTimestamp) as Map<string, AccountEventsPeriod>;
  // Step 2: Process each row and populate periods
  for (let row of sqlResultSet) {
    // Set defaults
    row = {
      ...row,
      short_channel_id: row.short_channel_id ?? 'wallet',
      remote_alias: row.remote_alias ?? 'n/a',
      balance_msat: row.credit_msat - row.debit_msat
    };
    // Add new account to uniqueAccountNames
    uniqueAccountNames.add(row.account);

    const period_key = getPeriodKey(timeGranularity, row.timestamp);
    const period = allPeriods.get(period_key);
    if (!period) continue;

    // Find or create account in period
    let account = period.accounts.find(acc => acc.account === row.account);
    if (account) {
      account.balance_msat += row.balance_msat;
      account.credit_msat += row.credit_msat;
      account.debit_msat += row.debit_msat;
    } else {
      period.accounts.push({...row});
    }
    period.total_balance_across_accounts += row.balance_msat;
  }

  // Step 3: Accumulate balances across periods
  const resultPeriods: AccountEventsPeriod[] = [];
  
  for (const [, period] of allPeriods) {
    // Merge with previous accounts
    const mergedAccounts = Array.from(prevAccounts.values()).map(acc => ({...acc}));
    
    // Process current period accounts
    for (const currentAccount of period.accounts) {
      const existingAccount = prevAccounts.get(currentAccount.account);
      if (existingAccount) {
        existingAccount.balance_msat += currentAccount.balance_msat;
        existingAccount.credit_msat += currentAccount.credit_msat;
        existingAccount.debit_msat += currentAccount.debit_msat;
      } else {
        const newAccount = {...currentAccount};
        prevAccounts.set(currentAccount.account, newAccount);
        mergedAccounts.push(newAccount);
      }
      totalPrevBalance += currentAccount.balance_msat;
    }

    // Create new period with merged data
    const mergedPeriod: AccountEventsPeriod = {
      ...period,
      accounts: mergedAccounts,
      total_balance_across_accounts: period.total_balance_across_accounts + totalPrevBalance
    };
    
    resultPeriods.push(mergedPeriod);
  }

  // Step 4: Filter periods based on date range and zero activity
  // It require full historical processing before filtering because:
  // - Each period's state depends on all prior periods' activity
  // - Running totals must be accurate across period boundaries
  const rangePeriods = resultPeriods.filter(period => {
    const periodTimestamp = getTimestampFromPeriodKey(timeGranularity, period.period_key);
    return periodTimestamp >= startTimestamp && periodTimestamp <= endTimestamp;
  });

  return { isLoading: false, events: sqlResultSet, periods: rangePeriods, timeGranularity, startTimestamp, endTimestamp };
}

export function transformSatsFlowByPeriods(
  sqlResultSet: SatsFlowEvent[],
  timeGranularity: TimeGranularity,
  startTimestamp: number,
  endTimestamp: number,
): { satsflow: SatsFlow, summary: BkprSummaryInfo } {
  if (sqlResultSet.length === 0) {
    return { satsflow: { isLoading: false, satsFlowEvents: [], periods: [], timeGranularity: TimeGranularity.DAILY, startTimestamp: 0, endTimestamp: 0 }, summary: { isLoading: false } };
  }

  // Step 1: Generate all period keys
  const allPeriodKeys = calculateAllPeriodKeys('SatsFlow', timeGranularity, startTimestamp, endTimestamp) as Map<string, SatsFlowPeriod>;

  let inflows_for_period_msat = 0;
  let outflows_for_period_msat = 0;
  let onchain_fee_msat = 0;
  let routing_revenue_msat = 0;
  let total_invoice_received_msat = 0;
  let total_payments_sent_msat = 0;

  // Step 2: Group transactions by period
  for (const row of sqlResultSet) {
    const period_key = getPeriodKey(timeGranularity, row.timestamp);
    const foundPeriodKey = allPeriodKeys.get(period_key);
    if (!foundPeriodKey) continue;

    // Add information for summary data
    const tag = row.tag !== 'invoice' ? row.tag : (row.credit_msat >= row.debit_msat) ? 'received_invoice' : 'paid_invoice';
    switch (tag) {
      case 'routed':
        routing_revenue_msat += (row.credit_msat - row.debit_msat);
        break;
      case 'received_invoice':
        total_invoice_received_msat += row.credit_msat;
        break;
      case 'paid_invoice':
        total_payments_sent_msat += row.debit_msat;
        break;
      case 'onchain_fee':
        onchain_fee_msat += row.debit_msat;
        break;
      default:
        break;
    }

    let foundTagGroup = foundPeriodKey.tag_groups.find(tagGrp => tagGrp.tag === tag);
    if (!foundTagGroup) {
      foundTagGroup = { events: [], tag, credit_msat: 0, debit_msat: 0 };
      foundPeriodKey.tag_groups.push(foundTagGroup);
    }

    foundTagGroup.events.push(row);
    foundTagGroup.credit_msat += row.credit_msat;
    foundTagGroup.debit_msat += row.debit_msat;
    foundPeriodKey.inflow_msat += row.credit_msat;
    foundPeriodKey.outflow_msat += row.debit_msat;
    inflows_for_period_msat += row.credit_msat;
    outflows_for_period_msat += row.debit_msat;
  }

  return {satsflow: { isLoading: false, satsFlowEvents: sqlResultSet, periods: Array.from(allPeriodKeys.values()), timeGranularity, startTimestamp, endTimestamp }, summary: {isLoading: false, onchain_fee_msat, routing_revenue_msat, total_invoice_received_msat, total_payments_sent_msat, inflows_for_period_msat, outflows_for_period_msat}};  
}

export function transformVolumeData(sqlResultSet: VolumeRow[]): {volume: VolumeData, summary: BkprSummaryInfo} {
  let total_fee_msat = 0;
  let highestFee_msat = 0;
  let highestForwardIndex: number | undefined = undefined;
  let lowestFee_msat = Number.MAX_VALUE;
  let lowestForwardIndex: number | undefined = undefined;
  sqlResultSet.forEach((row, i) => {
    total_fee_msat += row.fee_msat;
    if (row.fee_msat > highestFee_msat) {
      highestFee_msat = row.fee_msat;
      highestForwardIndex = i;
    }
    if (row.fee_msat < lowestFee_msat) {
      lowestFee_msat = row.fee_msat;
      lowestForwardIndex = i;
    }
  });
  let most_traffic_route: SummaryRoute = { channel_scids: '', channel_aliases: '', fee_msat: 0 };
  if (highestForwardIndex != null) {
    most_traffic_route = {
      channel_scids: sqlResultSet[highestForwardIndex].in_channel_scid + ' -> ' + sqlResultSet[highestForwardIndex].out_channel_scid,
      channel_aliases: sqlResultSet[highestForwardIndex].in_channel_peer_alias + ' -> ' + sqlResultSet[highestForwardIndex].out_channel_peer_alias,
      fee_msat: sqlResultSet[highestForwardIndex].fee_msat,
    };
  }
  let least_traffic_route: SummaryRoute = { channel_scids: '', channel_aliases: '', fee_msat: 0 };
  if (lowestForwardIndex != null) {
    least_traffic_route = {
      channel_scids: sqlResultSet[lowestForwardIndex].in_channel_scid + ' -> ' + sqlResultSet[lowestForwardIndex].out_channel_scid,
      channel_aliases: sqlResultSet[lowestForwardIndex].in_channel_peer_alias + ' -> ' + sqlResultSet[lowestForwardIndex].out_channel_peer_alias,
      fee_msat: sqlResultSet[lowestForwardIndex].fee_msat,
    };
  }
  return {volume: { isLoading: false, forwards: sqlResultSet}, summary: { isLoading: false, total_fee_msat, most_traffic_route, least_traffic_route}};
}

export function transformAccountEventsGraphData(periods: AccountEventsPeriod[]) {
  return periods.map((period) => {
    const accountBalances = period.accounts.reduce((acc, account) => {
      if (!account.short_channel_id) {
        account.short_channel_id = 'wallet';
      }
      acc[account.short_channel_id] = account.balance_msat;
      return acc;
    }, {} as Record<string, number>);

    return {
      period_key: period.period_key,
      ...accountBalances,
    };
  });
}

export function transformSatsFlowGraphData(periods: SatsFlowPeriod[]) {
  return periods.map((entry) => {
    const getNetFlow = (tag) => {
      const group = entry.tag_groups?.find((g) => g.tag === tag);
      return (group?.credit_msat || 0) - (group?.debit_msat || 0);
    };

    const net_routed = getNetFlow('routed');
    const net_invoice_fee = getNetFlow('invoice_fee');
    const net_received_invoice = getNetFlow('received_invoice');
    const net_paid_invoice = getNetFlow('paid_invoice');
    const net_deposit = getNetFlow('deposit');
    const net_onchain_fee = getNetFlow('onchain_fee');

    return {
      name: entry.period_key,
      routed: net_routed,
      invoice_fee: net_invoice_fee,
      received_invoice: net_received_invoice,
      paid_invoice: net_paid_invoice,
      deposit: net_deposit,
      onchain_fee: net_onchain_fee,
      net_inflow_msat: net_routed + net_invoice_fee + net_received_invoice + net_paid_invoice + net_deposit + net_onchain_fee
    };
  });
}

export function transformVolumeGraphData(forwards: VolumeRow[]) {
  let tempInbound: any[] = [];
  forwards.reduce((acc, curr) => {
    const found = acc.find(f => f.in_channel_scid === curr.in_channel_scid);
    if (found) {
      found.fee_msat += curr.fee_msat;
      found.in_msat += curr.in_msat;
    } else {
      acc.push({
        name: curr.in_channel_peer_alias,
        in_channel_scid: curr.in_channel_scid,
        in_channel_peer_id: curr.in_channel_peer_id,
        in_channel_peer_alias: curr.in_channel_peer_alias,
        in_msat: curr.in_msat,
        out_msat: curr.out_msat,
        fee_msat: curr.fee_msat
      });
    }
    return acc;
  }, tempInbound);
  tempInbound.sort((a, b) => a.fee_msat - b.fee_msat);

  const tempOutbound = tempInbound.flatMap(inForward =>
    forwards
      .filter(f => f.in_channel_scid === inForward.in_channel_scid)
      .map(forward => ({
        name: forward.out_channel_peer_alias,
        out_channel_scid: forward.out_channel_scid,
        out_channel_peer_id: forward.out_channel_peer_id,
        out_channel_peer_alias: forward.out_channel_peer_alias,
        in_msat: forward.in_msat,
        out_msat: forward.out_msat,
        fee_msat: forward.fee_msat,
        in_channel_scid: inForward.in_channel_scid,
        in_channel_peer_alias: inForward.in_channel_peer_alias
      }))
  );

  return { inbound: tempInbound, outbound: tempOutbound };
};

const mapToAccountEventsAccounts = (row: (string | null | number)[]): AccountEventsAccount => ({
  short_channel_id: row[0] as string,
  remote_alias: row[1] as string,
  credit_msat: row[2] as number,
  debit_msat: row[3] as number,
  account: row[4] as string,
  timestamp: row[5] as number,
  balance_msat: 0 as number,
});

export const convertArrayToAccountEventsObj = (raw: any[]): AccountEventsAccount[] => {
  return raw.map(mapToAccountEventsAccounts).sort((a, b) => a.timestamp - b.timestamp);
};

const mapToSatsFlowEvents = (row: (string | number)[]): SatsFlowEvent => ({
  account: row[0] as string,
  tag: row[1] as string,
  credit_msat: row[2] as number,
  debit_msat: row[3] as number,
  currency: row[4] as string,
  timestamp: row[5] as number,
  description: row[6] as string,
  outpoint: row[7] as string,
  txid: row[8] as string,
  payment_id: row[9] as string,
});

export const convertArrayToSatsFlowObj = (raw: any[]): SatsFlowEvent[] => {
  return raw.map(mapToSatsFlowEvents).sort((a, b) => a.timestamp - b.timestamp);
};

const mapToVolume = (row: (string | number)[]): VolumeRow => ({
  in_channel_scid: row[0] as string,
  in_channel_peer_id: row[1] as string,
  in_channel_peer_alias: row[2] as string,
  in_msat: row[3] as number,
  out_channel_scid: row[4] as string,
  out_channel_peer_id: row[5] as string,
  out_channel_peer_alias: row[6] as string,
  out_msat: row[7] as number,
  fee_msat: row[8] as number,
});

export const convertArrayToVolumeObj = (raw: any[]): VolumeRow[] => {
  return raw.map(mapToVolume).sort((a, b) => a.fee_msat - b.fee_msat);
};
