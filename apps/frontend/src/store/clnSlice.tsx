import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListInvoices, ListPayments, ListOffers, BkprTransaction, NodeFeeRate, Invoice, Payment, AccountEvents } from '../types/cln.type';
import { sortDescByKey } from '../utilities/data-formatters';
import { defaultCLNState } from './clnSelectors';

const paymentReducer = (accumulator, currentPayment) => {
  const currPayHash = currentPayment.payment_hash;
  currentPayment = { ...currentPayment };
  if (!currentPayment.partid) { currentPayment.partid = 0; }
  if (!accumulator[currPayHash]) {
    accumulator[currPayHash] = [currentPayment];
  } else {
    accumulator[currPayHash].push(currentPayment);
  }
  return accumulator;
};

const summaryReducer = (accumulator, mpp) => {
  if (mpp.status?.toLowerCase() === 'complete') {
    accumulator.amount_msat = accumulator.amount_msat + mpp.amount_msat;
    accumulator.amount_sent_msat = accumulator.amount_sent_msat + mpp.amount_sent_msat;
    accumulator.status = mpp.status;
  }
  if (mpp.bolt11 && !accumulator.bolt11) { accumulator.bolt11 = mpp.bolt11; }
  if (mpp.bolt12 && !accumulator.bolt12) { accumulator.bolt12 = mpp.bolt12; }
  if (mpp.label && !accumulator.label) { accumulator.label = mpp.label; }
  if (mpp.description && !accumulator.description) { accumulator.description = mpp.description; }
  if (mpp.payment_preimage && !accumulator.payment_preimage) { accumulator.payment_preimage = mpp.payment_preimage; }
  return accumulator;
};

const groupBy = (payments) => {
  const paymentsInGroups = payments?.reduce(paymentReducer, {});
  const paymentsGrpArray = Object.keys(paymentsInGroups)?.map((key) => ((paymentsInGroups[key].length && paymentsInGroups[key].length > 1) ? sortDescByKey(paymentsInGroups[key], 'partid') : paymentsInGroups[key]));
  return paymentsGrpArray?.reduce((acc, curr) => {
    let temp: any = {};
    if (curr.length && curr.length === 1) {
      temp = JSON.parse(JSON.stringify(curr[0]));
      temp.is_group = false;
      temp.is_expanded = false;
      temp.total_parts = 1;
      delete temp.partid;
    } else {
      const paySummary = curr?.reduce(summaryReducer, { amount_msat: 0, amount_sent_msat: 0, status: (curr[0] && curr[0].status) ? curr[0].status : 'failed' });
      temp = {
        is_group: true, is_expanded: false, total_parts: (curr.length ? curr.length : 0), status: paySummary.status, payment_hash: curr[0].payment_hash,
        destination: curr[0].destination, amount_msat: paySummary.amount_msat, amount_sent_msat: paySummary.amount_sent_msat, created_at: curr[0].created_at,
        mpps: curr
      };
      if (paySummary.bolt11) { temp.bolt11 = paySummary.bolt11; }
      if (paySummary.bolt12) { temp.bolt12 = paySummary.bolt12; }
      if (paySummary.bolt11 && !temp.bolt11) { temp.bolt11 = paySummary.bolt11; }
      if (paySummary.bolt12 && !temp.bolt12) { temp.bolt12 = paySummary.bolt12; }
      if (paySummary.label && !temp.label) { temp.label = paySummary.label; }
      if (paySummary.description && !temp.description) { temp.description = paySummary.description; }
      if (paySummary.payment_preimage && !temp.payment_preimage) { temp.payment_preimage = paySummary.payment_preimage; }
    }
    return acc.concat(temp);
  }, []);
};

const mergeLightningTransactions = (invoices: Invoice[], payments: Payment[]) => {
  let mergedTransactions: any[] = [];
  let totalTransactionsLength = (invoices?.length || 0) + (payments?.length || 0);
  for (let i = 0, v = 0, p = 0; i < totalTransactionsLength; i++) {
    if (v === (invoices?.length || 0)) {
      payments.slice(p)?.map(payment => {
        mergedTransactions.push({ type: 'PAYMENT', payment_hash: payment.payment_hash, status: payment.status, amount_msat: (payment.amount_msat || payment.msatoshi), label: payment.label, bolt11: payment.bolt11, description: payment.description, bolt12: payment.bolt12, payment_preimage: payment.payment_preimage, created_at: payment.created_at, amount_sent_msat: (payment.amount_sent_msat || payment.msatoshi_sent), destination: payment.destination, expires_at: null, amount_received_msat: null, paid_at: null });
        return payment;
      })
      i = totalTransactionsLength;
    } else if (p === (payments?.length || 0)) {
      invoices.slice(v)?.map(invoice => {
        if (invoice.status !== 'expired') {
          mergedTransactions.push({ type: 'INVOICE', payment_hash: invoice.payment_hash, status: invoice.status, amount_msat: (invoice.amount_msat || invoice.msatoshi), label: invoice.label, bolt11: invoice.bolt11, description: invoice.description, bolt12: invoice.bolt12, payment_preimage: invoice.payment_preimage, created_at: null, amount_sent_msat: null, destination: null, expires_at: invoice.expires_at, amount_received_msat: (invoice.amount_received_msat || invoice.msatoshi_received), paid_at: invoice.paid_at });
        }
        return invoice;
      });
      i = totalTransactionsLength;
    } else if ((payments[p].created_at || 0) >= (invoices[v].paid_at || invoices[v].expires_at || 0)) {
      mergedTransactions.push({ type: 'PAYMENT', payment_hash: payments[p].payment_hash, status: payments[p].status, amount_msat: (payments[p].amount_msat || payments[p].msatoshi), label: payments[p].label, bolt11: payments[p].bolt11, description: payments[p].description, bolt12: payments[p].bolt12, payment_preimage: payments[p].payment_preimage, created_at: payments[p].created_at, amount_sent_msat: (payments[p].amount_sent_msat || payments[p].msatoshi_sent), destination: payments[p].destination, expires_at: null, amount_received_msat: null, paid_at: null });
      p++;
    } else if ((payments[p].created_at || 0) < (invoices[v].paid_at || invoices[v].expires_at || 0)) {
      if (invoices[v].status !== 'expired') {
        mergedTransactions.push({ type: 'INVOICE', payment_hash: invoices[v].payment_hash, status: invoices[v].status, amount_msat: (invoices[v].amount_msat || invoices[v].msatoshi), label: invoices[v].label, bolt11: invoices[v].bolt11, description: invoices[v].description, bolt12: invoices[v].bolt12, payment_preimage: invoices[v].payment_preimage, created_at: null, amount_sent_msat: null, destination: null, expires_at: invoices[v].expires_at, amount_received_msat: (invoices[v].amount_received_msat || invoices[v].msatoshi_received), paid_at: invoices[v].paid_at });
      }
      v++;
    }
  }
  return mergedTransactions;
};

const filterOnChainTransactions = (events: BkprTransaction[]) => {
  if (!events) {
    return [];
  } else {
    return events.reduce((acc: any[], event) => {
      event = { ...event };
      if (event.account?.toLowerCase() === 'wallet' && (event.tag?.toLowerCase() === 'deposit' || event.tag?.toLowerCase() === 'withdrawal')) {
        event.credit_msat = event.credit_msat || 0;
        event.debit_msat = event.debit_msat || 0;
        const lastTx = acc.length && acc.length > 0 ? acc[acc.length - 1] : { tag: '' };
        if (lastTx.tag?.toLowerCase() === 'withdrawal' && event.tag?.toLowerCase() === 'deposit' && lastTx.timestamp === event.timestamp && event.outpoint?.includes(lastTx.txid)) {
          // Calculate the net amount from the last withdrawal and this deposit
          lastTx.debit_msat = (lastTx.debit_msat - +event.credit_msat);
        } else {
          acc.push(event);
        }
      }
      return acc;
    }, []);
  }
};

const clnSlice = createSlice({
  name: 'cln',
  initialState: defaultCLNState,
  reducers: {
    setListInvoices(state, action: PayloadAction<ListInvoices>) {
      if (action.payload.error) {
        state.listInvoices = { ...state.listInvoices, error: action.payload.error };
        return;
      }
      const sortedInvoices = [...(action.payload.invoices ?? [])].sort((i1, i2) => {
        const c1 = i1.paid_at || i1.expires_at || 0;
        const c2 = i2.paid_at || i2.expires_at || 0;
        return c2 - c1;
      });

      state.listInvoices = { ...action.payload, invoices: sortedInvoices };
      if (!state.listPayments.isLoading && !state.listInvoices.isLoading) {
        const merged = mergeLightningTransactions(sortedInvoices, state.listPayments?.payments ?? []);
        state.listLightningTransactions = { isLoading: false, clnTransactions: merged };
      }
    },
    setListPayments(state, action: PayloadAction<ListPayments>) {
      if (action.payload.error) {
        state.listPayments = { ...state.listPayments, error: action.payload.error };
        return;
      }
      const sortedPayments = action.payload.payments?.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0)) ?? [];
      const grouped = groupBy(sortedPayments);
      state.listPayments = { ...action.payload, payments: grouped };
      if (!state.listPayments.isLoading && !state.listInvoices.isLoading) {
        const merged = mergeLightningTransactions(state.listInvoices.invoices ?? [], grouped);
        state.listLightningTransactions = { isLoading: false, clnTransactions: merged };
      }
    },
    setListOffers(state, action: PayloadAction<ListOffers>) {
      if (action.payload.error) {
        state.listOffers = { ...state.listOffers, error: action.payload.error };
        return;
      }
      state.listOffers = action.payload;
    },
    setListBitcoinTransactions(state, action: PayloadAction<AccountEvents>) {
      if (action.payload.error) {
        state.listBitcoinTransactions = { ...state.listBitcoinTransactions, error: action.payload.error };
        return;
      }
      if (action.payload.events && action.payload.events.length) {
        const sorted = action.payload.events?.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)) ?? [];
        state.listBitcoinTransactions = {
          isLoading: false,
          btcTransactions: filterOnChainTransactions(sorted),
        };
      }
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
  setListInvoices,
  setListPayments,
  setListOffers,
  setListBitcoinTransactions,
  setFeeRate,
  clearCLNStore
} = clnSlice.actions;

export default clnSlice.reducer;
