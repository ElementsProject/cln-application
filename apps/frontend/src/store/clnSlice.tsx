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
      state.listLightningTransactions = action.payload;
    },
    setListOffers(state, action: PayloadAction<ListOffers>) {
      if (action.payload.error) {
        state.listOffers = { ...state.listOffers, error: action.payload.error };
        return;
      }
      state.listOffers = action.payload;
    },    
    setListBitcoinTransactions(state, action: PayloadAction<ListBitcoinTransactions>) {
      if (action.payload.error) {
        state.listBitcoinTransactions = { ...state.listBitcoinTransactions, error: action.payload.error };
        return;
      }
      state.listBitcoinTransactions = action.payload;
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
  setListLightningTransactions,
  setListOffers,
  setListBitcoinTransactions,
  setFeeRate,
  clearCLNStore
} = clnSlice.actions;

export default clnSlice.reducer;
