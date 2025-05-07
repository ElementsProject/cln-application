import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeGranularity } from '../utilities/constants';
import { AccountEvents, SatsFlow, VolumeData } from '../types/bookkeeper.type';
import { transformAccountEventsByPeriods, transformSatsFlowByPeriods, transformVolumeData } from '../services/data-transform.service';
import { defaultBKPRState } from './bkprSelectors';

const bkprSlice = createSlice({
  name: 'bkpr',
  initialState: defaultBKPRState,
  reducers: {
    setAccountEvents: (
      state,
      action: PayloadAction<{
        accountEvents: AccountEvents;
        timeGranularity: TimeGranularity;
        startTimestamp: number;
        endTimestamp: number;
      }>
    ) => {
      const { accountEvents, timeGranularity, startTimestamp, endTimestamp } = action.payload;
      if (accountEvents.error) {
        state.accountEvents = { ...state.accountEvents, ...accountEvents, timeGranularity, startTimestamp, endTimestamp, isLoading: false };
        return;
      }
      if (accountEvents.events) {
        const transformedEvents = transformAccountEventsByPeriods(
          accountEvents.events,
          timeGranularity,
          startTimestamp,
          endTimestamp
        );
        state.accountEvents = { ...state.accountEvents, ...transformedEvents, timeGranularity, startTimestamp, endTimestamp, isLoading: false };
      }
    },
    setSatsFlow: (
      state,
      action: PayloadAction<{
        satsFlow: SatsFlow;
        timeGranularity: TimeGranularity;
        startTimestamp: number;
        endTimestamp: number;
      }>
    ) => {
      const { satsFlow, timeGranularity, startTimestamp, endTimestamp } = action.payload;
      if (satsFlow.error) {
        state.satsFlow = { ...state.satsFlow, ...satsFlow, timeGranularity, startTimestamp, endTimestamp, isLoading: false };
        state.summary = { ...state.summary, errors: state.summary.errors?.concat(['Satsflow: ' + satsFlow.error]) };
        return;
      }
      if (satsFlow.satsFlowEvents) {
        const transformed = transformSatsFlowByPeriods(
          satsFlow.satsFlowEvents,
          timeGranularity,
          startTimestamp,
          endTimestamp
        );
        state.satsFlow = { ...state.satsFlow, ...transformed.satsflow, timeGranularity, startTimestamp, endTimestamp, isLoading: false };
        state.summary = { ...state.summary, ...transformed.summary };
      }
    },
    setVolume: (state, action: PayloadAction<{ volume: VolumeData }>) => {
      const { volume } = action.payload;
      if (volume.error) {
        state.volume = { ...state.volume, ...volume.error, isLoading: false };
        state.summary = { ...state.summary, errors: state.summary?.errors?.concat(['Volume: ' + volume.error]) };
        return;
      }
      if (volume.forwards) {
        const transformed = transformVolumeData(volume.forwards);
        state.volume = transformed.volume;
        state.summary = { ...state.summary, ...transformed.summary };
      }
    },
    clearBKPRStore: () => defaultBKPRState,
  },
});

export const { setAccountEvents, setSatsFlow, setVolume, clearBKPRStore } = bkprSlice.actions;
export default bkprSlice.reducer;
