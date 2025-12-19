import { createSelector } from '@reduxjs/toolkit';
import { CLNState } from '../types/cln.type';

export const defaultCLNState: CLNState = {
  listOffers: { isLoading: true, offers: [] },
  listLightningTransactions: { isLoading: true, clnTransactions: [] },
  listBitcoinTransactions: { isLoading: true, btcTransactions: [] },
  feeRate: { isLoading: true },
};

const selectCLNState = (state: { cln: CLNState }) => state.cln || defaultCLNState;

export const selectListOffers = createSelector(
  selectCLNState,
  (cln) => cln.listOffers
);

export const selectListLightningTransactions = createSelector(
  selectCLNState,
  (cln) => cln.listLightningTransactions
);

export const selectListBitcoinTransactions = createSelector(
  selectCLNState,
  (cln) => cln.listBitcoinTransactions
);

export const selectFeeRate = createSelector(
  selectCLNState,
  (cln) => cln.feeRate
);

export const selectInvoiceByHash = (paymentHash: string) => createSelector(
  selectListLightningTransactions,
  (data) => data.clnTransactions?.find(inv => inv.payment_hash === paymentHash)
);

export const selectPaymentByHash = (paymentHash: string) => createSelector(
  selectListLightningTransactions,
  (data) => data.clnTransactions?.find(pay => pay.payment_hash === paymentHash)
);

export const selectCurrentFeeRate = createSelector(
  selectFeeRate,
  (feeRate) => feeRate.onchain_fee_estimates?.opening_channel_satoshis || 0
);
