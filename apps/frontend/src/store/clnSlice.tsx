import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListOffers, NodeFeeRate, ListLightningTransactions, ListBitcoinTransactions } from '../types/cln.type';
import { defaultCLNState } from './clnSelectors';

const clnSlice = createSlice({
  name: 'cln',
  initialState: defaultCLNState,
  reducers: {
    setListLightningTransactions(state, action: PayloadAction<ListLightningTransactions>) {
      if (action.payload.error) {
        state.listLightningTransactions = { ...state.listLightningTransactions, error: action.payload.error };
        return;
      }
      state.listLightningTransactions = {
        ...state.listLightningTransactions,
        ...action.payload,
        clnTransactions: [
          ...state.listLightningTransactions.clnTransactions,
          ...action.payload.clnTransactions,
        ],
      };
    },
    setListLightningTransactionsLoading(state, action: PayloadAction<boolean>) {
      state.listLightningTransactions.isLoading = action.payload;
    },
    resetListLightningTransactions(state) {
      state.listLightningTransactions = defaultCLNState.listLightningTransactions;
    },
    setListOffers(state, action: PayloadAction<ListOffers>) {
      if (action.payload.error) {
        state.listOffers = { ...state.listOffers, error: action.payload.error };
        return;
      }
      state.listOffers = {
        ...state.listOffers,
        ...action.payload,
        offers: [
          ...(state.listOffers.offers ?? []),
          ...(action.payload.offers ?? []),
        ],
      };
    },    
    setListOffersLoading(state, action: PayloadAction<boolean>) {
      state.listOffers.isLoading = action.payload;
    },
    resetListOffers(state) {
      state.listOffers = defaultCLNState.listOffers;
    },
    setListBitcoinTransactions(state, action: PayloadAction<ListBitcoinTransactions>) {
      if (action.payload.error) {
        state.listBitcoinTransactions = { ...state.listBitcoinTransactions, error: action.payload.error };
        return;
      }
      state.listBitcoinTransactions = {
        ...state.listBitcoinTransactions,
        ...action.payload,
        btcTransactions: [
          ...state.listBitcoinTransactions.btcTransactions,
          ...action.payload.btcTransactions,
        ],
      };
    },
    setListBitcoinTransactionsLoading(state, action: PayloadAction<boolean>) {
      state.listBitcoinTransactions.isLoading = action.payload;
    },
    resetListBitcoinTransactions(state) {
      state.listBitcoinTransactions = defaultCLNState.listBitcoinTransactions;
    },
    setFeeRate(state, action: PayloadAction<NodeFeeRate>) {
      if (action.payload.error) {
        state.feeRate = { ...state.feeRate, error: action.payload.error };
        return;
      }
      state.feeRate = action.payload;
    },
    clearCLNStore() {
      return defaultCLNState;
    }
  }
});

export const {
  setListLightningTransactionsLoading,
  setListLightningTransactions,
  resetListLightningTransactions,
  setListOffersLoading,
  setListOffers,
  resetListOffers,
  setListBitcoinTransactionsLoading,
  setListBitcoinTransactions,
  resetListBitcoinTransactions,
  setFeeRate,
  clearCLNStore
} = clnSlice.actions;

export default clnSlice.reducer;
