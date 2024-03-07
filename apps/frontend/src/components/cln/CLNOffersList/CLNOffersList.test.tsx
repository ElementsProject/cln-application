import { screen } from '@testing-library/react';
import CLNOffersList from './CLNOffersList';
import { ApplicationModes, Units } from '../../../utilities/constants';
import { renderWithMockContext } from '../../../utilities/test-utilities';

describe('CLNOffersList component ', () => {
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

  it('if it is loading show the spinner', () => {
    providerProps.listOffers.isLoading = true;
    renderWithMockContext(<CLNOffersList />, { providerProps });
    expect(screen.getByTestId('cln-offers-list-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', () => {
    renderWithMockContext(<CLNOffersList />, { providerProps });
    expect(screen.queryByTestId('cln-offers-list-spinner')).not.toBeInTheDocument();
  })

  it('if it has an error, show the error view', () => {
    providerProps.listOffers.offers = [];
    providerProps.listOffers.error = "error message!";
    renderWithMockContext(<CLNOffersList />, { providerProps });
    expect(screen.getByTestId('cln-offers-list-error')).toBeInTheDocument();
  })

  it('if it has offers, show the offers list', () => {
    renderWithMockContext(<CLNOffersList />, { providerProps });
    const offersList = screen.getByTestId('cln-offers-list');

    expect(offersList).toBeInTheDocument();
    expect(offersList.children.length).toBe(2);
  })

  it('if there are no offers, show the on offers text', () => {
    providerProps.listOffers.offers = [];
    renderWithMockContext(<CLNOffersList />, { providerProps });
    expect(screen.getByText('No offer found. Click receive to generate new offer!')).toBeInTheDocument();
  })

});
