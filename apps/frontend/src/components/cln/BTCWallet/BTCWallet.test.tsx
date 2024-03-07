import { screen } from '@testing-library/react';
import BTCWallet from './BTCWallet';
import { ApplicationModes, Units } from '../../../utilities/constants';
import { renderWithMockContext } from '../../../utilities/test-utilities';

describe('BTCWallet component ', () => {
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
      walletBalances: {
        isLoading: false,
        clnLocalBalance: 0,
        clnRemoteBalance: 0,
        clnPendingBalance: 0,
        clnInactiveBalance: 0,
        btcSpendableBalance: 13.377777,
        btcReservedBalance: 0
      },
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

  it('should be in the document', () => {
    providerProps.walletBalances.isLoading = false;
    renderWithMockContext(<BTCWallet />, { providerProps });
    expect(screen.getByTestId('btc-wallet')).toBeInTheDocument();
    expect(screen.queryByTestId('btc-wallet-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId("btc-wallet-error")).not.toBeInTheDocument();
  });

  it('when loading wallet balance it shows spinner', () => {
    providerProps.walletBalances.isLoading = true;
    renderWithMockContext(<BTCWallet />, { providerProps });
    expect(screen.getByTestId('btc-wallet-spinner')).toBeInTheDocument();
  })

  it('if error occurs, show error', () => {
    providerProps.walletBalances.error = "error message!";
    renderWithMockContext(<BTCWallet />, { providerProps });
    expect(screen.getByTestId("btc-wallet-error")).toBeInTheDocument();
  })

  it('if has btc spendable balance, show it', async () => {
    jest.useFakeTimers();
    renderWithMockContext(<BTCWallet />, { providerProps });
    jest.runAllTimers();
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('13.378');
  })

});
