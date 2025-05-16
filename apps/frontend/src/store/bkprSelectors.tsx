import { createSelector } from '@reduxjs/toolkit';
import { BKPRState } from '../types/bookkeeper.type';
import { TimeGranularity } from '../utilities/constants';

const defaultSummaryRoute = {
  channel_scids: '',
  channel_aliases: '',
  fee_msat: 0,
};

export const defaultBKPRState: BKPRState = {
  summary: {
    isLoading: true,
    onchain_fee_msat: 0,
    routing_revenue_msat: 0,
    total_invoice_received_msat: 0,
    total_payments_sent_msat: 0,
    inflows_for_period_msat: 0,
    outflows_for_period_msat: 0,
    total_fee_msat: 0,
    most_traffic_route: defaultSummaryRoute,
    least_traffic_route: defaultSummaryRoute,
    errors: [],
  },
  accountEvents: { isLoading: true, timeGranularity: TimeGranularity.DAILY, startTimestamp: 0, endTimestamp: 0, events: [], periods: [], error: null },
  satsFlow: { isLoading: true, timeGranularity: TimeGranularity.DAILY, startTimestamp: 0, endTimestamp: 0, satsFlowEvents: [], periods: [], error: null },
  volume: { isLoading: true, forwards: [], error: null },
};

const selectBKPRState = (state: { bkpr: BKPRState }) => state.bkpr || defaultBKPRState;

export const selectSummary = createSelector(
  selectBKPRState,
  (bkpr) => bkpr.summary
);

export const selectAccountEvents = createSelector(
  selectBKPRState,
  (bkpr) => bkpr.accountEvents
);

export const selectAccountEventPeriods = createSelector(
  selectAccountEvents,
  (events) => events.periods || []
);

export const selectAccountEventsLoading = createSelector(
  selectAccountEvents,
  (accountEvents) => accountEvents.isLoading
);

export const selectAccountEventsError = createSelector(
  selectAccountEvents,
  (accountEvents) => accountEvents.error
)

export const selectSatsFlow = createSelector(
  selectBKPRState,
  (bkpr) => bkpr.satsFlow
);

export const selectSatsFlowPeriods = createSelector(
  selectSatsFlow,
  (satsFlow) => satsFlow.periods || []
);

export const selectIsSatsFlowLoading = createSelector(
  selectSatsFlow,
  (satsFlow) => satsFlow.isLoading
);

export const selectSatsFlowError = createSelector(
  selectSummary,
  (summary) => summary.errors?.length && summary.errors?.length > 0 && summary.errors?.find(err => err.startsWith('Satsflow: '))
);

export const selectVolume = createSelector(
  selectBKPRState,
  (bkpr) => bkpr.volume
);

export const selectVolumeForwards = createSelector(
  selectVolume,
  (volume) => volume.forwards
);

export const selectIsVolumeLoading = createSelector(
  selectVolume,
  (volume) => volume.isLoading
);

export const selectVolumeError = createSelector(
  selectSummary,
  (summary) => summary.errors?.length && summary.errors?.length > 0 && summary.errors?.find(err => err.startsWith('Volume: '))
);
