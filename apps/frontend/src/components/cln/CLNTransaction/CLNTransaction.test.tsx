import { render, screen } from '@testing-library/react';
import CLNTransaction from './CLNTransaction';
import { AppContext } from '../../../store/AppContext';
import { ApplicationModes, Units } from '../../../utilities/constants';
import { LightningTransaction } from '../../../types/lightning-wallet.type';

const renderWithMockContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};

const clnTransaction: LightningTransaction = {
  type: 'INVOICE',
  payment_hash: 'abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12',
  status: 'unpaid',
  msatoshi: 1000000,
  label: 'invoice1',
  bolt11: 'lnbc10u1p04ccpapp5yj08w5v0n88e2305lnda2ljv9e8ne20ekygrhd5444vnrzwncycerqdq8w3jhxarju5cqv3jjq6twwehkjcm9ypnx7u3qv3d9hkuct5daeksxqrrssfqwp',
  description: 'Invoice for payment',
  bolt12: 'lno1pwruza4cv00xgc8z2080w7kqjz5vunxrv4xvwu7fae60n0d4xqkdejwjcghwnghwhd0c8zugtfvslgzpfscghet0s7ew6nywekmjwgarfqfmm94cxwxp3xqdrvw3gepkvfgrs9eqvggq4mqkqvagpw5kkns',
  payment_preimage: 'abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12',
  expires_at: Date.now() + 3600000, // 1hr from now,
  msatoshi_received: 0,
  paid_at: undefined
}

describe('CLNTransaction component ', () => {
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
      showToast: {
        show: false,
        type: '',
        delay: 3000
      },
      walletBalances: {
        isLoading: false,
        clnLocalBalance: 0,
        clnRemoteBalance: 0,
        clnPendingBalance: 0,
        clnInactiveBalance: 0,
        btcSpendableBalance: 13.377777,
        btcReservedBalance: 0
      },
      listOffers: {
        isLoading: false,
        offers: [
          {
            bolt12: "lno1pwruza4cv00xgc8z2080w7kqjz5vunxrv4xvwu7fae60n0d4xqkdejwjcghwnghwhd0c8zugtfvslgzpfscghet0sqqqyqqqyqqqzqqqfqqqqrr9umvwg5a5nlkyjf0gz7wrc5gg40t8xflq2c23hyz0cyftmnz5kppafku2eurjg5rzr92kdwhd42w5pufheslp73jjl9euvvs32halutnggczp0kytwtrv28z2aw35z95m76x4ua2ds4l3nu05wt63u86jksql6t6qf",
            offer_id: "Offer1",
            active: true,
            single_use: false,
            used: false,
            label: "MockOfferLabel"
          },
          {
            bolt12: "lno1pwruza4cv00pfqzq2080w7kqjz5vunxrv4xvwu7fae60n0d4xqkdejwjcghwnghwhd0c8zugtfvslgzpfscghet0sqqqyqqqyqqqzqqqfqqqqrr9umvwg5a5nlkyjf0gz7wrc5gg40t8xflq2c23hyz0cyftmnz5kppafku2eurjg5rzr92kdwhd42w5pufheslp73jjl9euvvs32halutnggczp0kytwtrv28z2aw35z95m76x4ua2ds4l3nu05wt63u86jksql6t6qa",
            offer_id: "Offer2",
            active: true,
            single_use: true,
            used: false,
            label: "MockOfferLabel2"
          }
        ],
        error: null
      },
      listLightningTransactions: {
        clnTransactions: [
          {
            type: 'INVOICE',
            payment_hash: 'abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12',
            status: 'unpaid',
            msatoshi: 1000000,
            label: 'invoice1',
            bolt11: 'lnbc10u1p04ccpapp5yj08w5v0n88e2305lnda2ljv9e8ne20ekygrhd5444vnrzwncycerqdq8w3jhxarju5cqv3jjq6twwehkjcm9ypnx7u3qv3d9hkuct5daeksxqrrssfqwp',
            description: 'Invoice for payment',
            bolt12: 'lno1pwruza4cv00xgc8z2080w7kqjz5vunxrv4xvwu7fae60n0d4xqkdejwjcghwnghwhd0c8zugtfvslgzpfscghet0s7ew6nywekmjwgarfqfmm94cxwxp3xqdrvw3gepkvfgrs9eqvggq4mqkqvagpw5kkns',
            payment_preimage: 'abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12',
            expires_at: Date.now() + 3600000, // 1hr from now,
            msatoshi_received: 0,
            paid_at: undefined
          },
          {
            type: 'PAYMENT',
            payment_hash: 'abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12',
            status: 'complete',
            msatoshi: 1000000,
            label: 'payment1',
            bolt11: 'lnbc10u1p04ccpapp5yj08w5v0n88e2305lnda2ljv9e8ne20ekygrhd5444vnrzwncycerqdpyvhay',
            description: 'Payment for invoice',
            bolt12: 'lno1pwruza4cv00xgc8z2080w7kqjz5vunxrv4xvwu7fae60n0d4xqkdejwjcghwnghwhd0c8zugtfvslgzpfscghet0s7ew6nywekmjwgarfqfmm94cxwxp3xqdrvw3gepkvfgrs9eqvggq4mqkqvagpw5kkns',
            payment_preimage: 'abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12',
            created_at: Date.now() - 3600000, // 1hr ago,
            msatoshi_sent: 1000000,
            destination: 'abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12',
          }
        ],
        isLoading: false,
        error: null
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
    renderWithMockContext(<CLNTransaction transaction={clnTransaction} />, { providerProps });
    expect(screen.getByTestId('invoice')).toBeInTheDocument();
    expect(screen.getByTestId('preimage')).toBeInTheDocument();
    expect(screen.queryByTestId('valid-till')).not.toBeInTheDocument();
  });

});
