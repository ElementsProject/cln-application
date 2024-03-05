import { screen } from '@testing-library/react';
import BTCTransactionsList from './BTCTransactionsList';
import { ApplicationModes, Units } from '../../../utilities/constants';
import { renderWithMockContext } from '../../../utilities/test-utilities';

jest.mock('framer-motion', () => {
  const RealFramerMotion = jest.requireActual('framer-motion');

  return {
    ...RealFramerMotion,
    motion: {
      div: ({ children }) => <div>{children}</div>,
      svg: ({ children }) => <svg>{children}</svg>
    },
  };
});

describe('BTCTransactionsList component ', () => {
  const mockFaDollarSign = { icon: ['fas', 'dollar-sign'], iconName: 'dollar-sign', prefix: 'fas' };
  let providerProps;
  beforeEach(
    () =>
    (providerProps = {
      authStatus: {
        isAuthenticated: true,
        isValidPassword: true
      },
      appConfig: {
        appMode: { isLoading: true, unit: Units.SATS, fiatUnit: 'USD', appMode: ApplicationModes.DARK }
      },
      fiatConfig: { isLoading: true, symbol: mockFaDollarSign, venue: '', rate: 1 },
      listBitcoinTransactions: {
        btcTransactions: [
          {
            account: 'mockAccount1',
            type: 'onchain_fee',
            credit_msat: '1000',
            debit_msat: '2000',
            currency: 'BTC',
            timestamp: 1624000000,
            tag: 'deposit',
            txid: 'mockTxId',
            blockheight: 123456,
            outpoint: 'mockOutpoint',
            origin: 'mockOrigin',
            payment_id: 'mockPaymentId',
            description: 'mockDescription',
            fees_msat: '3000',
            is_rebalance: false,
            part_id: 123
          },
          {
            account: 'mockAccount2',
            type: 'onchain_fee',
            credit_msat: '2000',
            debit_msat: '3000',
            currency: 'BTC',
            timestamp: 1724000000,
            tag: 'withdrawal',
            txid: 'mockTxId2',
            blockheight: 123900,
            outpoint: 'mockOutpoint',
            origin: 'mockOrigin2',
            payment_id: 'mockPaymentId2',
            description: 'mockDescription2',
            fees_msat: '3000',
            is_rebalance: false,
            part_id: 124
          }
        ],
        isLoading: false,
        error: null
      }
    })
  );

  it('if there are transactions, show transactions', () => {
    renderWithMockContext(<BTCTransactionsList />, { providerProps });
    expect(screen.getByTestId('btc-transactions-list')).toBeInTheDocument();
    expect(screen.getByTestId('withdraw-header')).toBeInTheDocument();
    expect(screen.getByTestId('deposit-header')).toBeInTheDocument();
    const txList = screen.getByTestId('btc-transactions-list');
    expect(txList.children.length).toBe(2);
  });

  it('show loading when loading', () => {
    providerProps.listBitcoinTransactions.isLoading = true;
    renderWithMockContext(<BTCTransactionsList />, { providerProps });
    expect(screen.queryByTestId('btc-transactions-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('withdraw-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deposit-header')).not.toBeInTheDocument();
  });

  it('show error when listBitcoinTransactions error', () => {
    providerProps.listBitcoinTransactions.btcTransactions = [];
    providerProps.listBitcoinTransactions.error = "error message!";
    renderWithMockContext(<BTCTransactionsList />, { providerProps });
    expect(screen.queryByTestId('btc-transactions-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('withdraw-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deposit-header')).not.toBeInTheDocument();
    expect(screen.getByText('error message!')).toBeInTheDocument();
  });

  it('show no transactions view if no transactions found', () => {
    providerProps.listBitcoinTransactions.btcTransactions = [];
    renderWithMockContext(<BTCTransactionsList />, { providerProps });
    expect(screen.getByText("No transaction found. Click deposit to receive amount!")).toBeInTheDocument();
  });

});
