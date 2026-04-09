import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Factory, FactoriesState } from '../types/factories.type';
import { defaultFactoriesState } from './factoriesSelectors';

const factoriesSlice = createSlice({
  name: 'factories',
  initialState: defaultFactoriesState,
  reducers: {
    setFactoryList(state, action: PayloadAction<{ factories?: Factory[]; error?: any; isLoading?: boolean }>) {
      if (action.payload.error) {
        state.factoryList = { ...state.factoryList, error: action.payload.error, isLoading: false };
        return;
      }
      state.factoryList = {
        isLoading: false,
        factories: action.payload.factories || [],
        error: undefined,
      };
    },
    setFactoryListLoading(state, action: PayloadAction<boolean>) {
      state.factoryList.isLoading = action.payload;
    },
    setSelectedFactory(state, action: PayloadAction<Factory | null>) {
      state.selectedFactory = action.payload;
    },
    setActionStatus(state, action: PayloadAction<FactoriesState['actionStatus']>) {
      state.actionStatus = action.payload;
    },
    clearActionStatus(state) {
      state.actionStatus = defaultFactoriesState.actionStatus;
    },
    clearFactoriesStore() {
      return defaultFactoriesState;
    },
  },
});

export const {
  setFactoryList,
  setFactoryListLoading,
  setSelectedFactory,
  setActionStatus,
  clearActionStatus,
  clearFactoriesStore,
} = factoriesSlice.actions;

export default factoriesSlice.reducer;
