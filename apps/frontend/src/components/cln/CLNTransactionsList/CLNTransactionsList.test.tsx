import { screen } from '@testing-library/react';
import CLNTransactionsList from './CLNTransactionsList';
import { Units, ApplicationModes } from '../../../utilities/constants';
import { renderWithMockContext } from '../../../utilities/test-utilities';

describe('CLNTransactionsList component ', () => {
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
      listChannels: {
        isLoading: false,
        activeChannels: [
          {
            funding: {
              local_funds_msat: "5000000000000",
              remote_funds_msat: "5000000000000",
              pushed_msat: "100000000000",
              fee_paid_msat: "5000000000",
              fee_rcvd_msat: "5000000000"
            },
            alias: {
              local: "LocalNodeAlias1",
              remote: "RemoteNodeAlias1",
            },
            feerate: {
              perkw: 5000,
              perkb: 20000
            },
            htlcs: [{
              direction: "out",
              id: 1,
              amount_msat: "1000",
              expiry: "600",
              payment_hash: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
              state: "SENT_ADD_ACK_REVOCATION",
              local_trimmed: false
            }]
          },
          {
            funding: {
              local_funds_msat: "4000000000000",
              remote_funds_msat: "4000000000000",
              pushed_msat: "800000000000",
              fee_paid_msat: "3000000000",
              fee_rcvd_msat: "3000000000"
            },
            alias: {
              local: "LocalNodeAlias2",
              remote: "RemoteNodeAlias2",
            },
            feerate: {
              perkw: 4000,
              perkb: 18000
            },
            htlcs: [{
              direction: "in",
              id: 2,
              amount_msat: "2000",
              expiry: "700",
              payment_hash: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
              state: "RCVD_ADD_ACK_REVOCATION",
              local_trimmed: true
            }]
          }
        ],
        pendingChannels: [
          {
            funding: {
              local_funds_msat: "3000000000000",
              remote_funds_msat: "3000000000000",
              pushed_msat: "700000000000",
              fee_paid_msat: "2000000000",
              fee_rcvd_msat: "2000000000"
            },
            alias: {
              local: "LocalNodeAlias3",
              remote: "RemoteNodeAlias3",
            },
            feerate: {
              perkw: 3500,
              perkb: 15000
            },
            htlcs: [{
              direction: "out",
              id: 3,
              amount_msat: "3000",
              expiry: "800",
              payment_hash: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
              state: "SENT_ADD_ACK_COMMITMENT_SIGNED",
              local_trimmed: false
            }]
          },
          {
            funding: {
              local_funds_msat: "2000000000000",
              remote_funds_msat: "2000000000000",
              pushed_msat: "600000000000",
              fee_paid_msat: "1000000000",
              fee_rcvd_msat: "1000000000"
            },
            alias: {
              local: "LocalNodeAlias4",
              remote: "RemoteNodeAlias4",
            },
            feerate: {
              perkw: 3000,
              perkb: 12000
            },
            htlcs: [{
              direction: "in",
              id: 4,
              amount_msat: "4000",
              expiry: "900",
              payment_hash: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
              state: "RCVD_REMOVE_ACK_REVOCATION",
              local_trimmed: true
            }]
          }
        ],
        inactiveChannels: [
          {
            funding: {
              local_funds_msat: "1000000000000",
              remote_funds_msat: "1000000000000",
              pushed_msat: "500000000000",
              fee_paid_msat: "50000000",
              fee_rcvd_msat: "50000000"
            },
            alias: {
              local: "LocalNodeAlias5",
              remote: "RemoteNodeAlias5",
            },
            feerate: {
              perkw: 2500,
              perkb: 10000
            },
            htlcs: [{
              direction: "out",
              id: 5,
              amount_msat: "5000",
              expiry: "1000",
              payment_hash: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
              state: "SENT_ADD_ACK_REVOCATION",
              local_trimmed: false
            }]
          },
          {
            funding: {
              local_funds_msat: "500000000000",
              remote_funds_msat: "500000000000",
              pushed_msat: "400000000000",
              fee_paid_msat: "10000000",
              fee_rcvd_msat: "10000000"
            },
            alias: {
              local: "LocalNodeAlias6",
              remote: "RemoteNodeAlias6",
            },
            feerate: {
              perkw: 2000,
              perkb: 8000
            },
            htlcs: [{
              direction: "in",
              id: 6,
              amount_msat: "2000",
              expiry: "1100",
              payment_hash: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
              state: "RCVD_ADD_ACK_COMMITMENT_SIGNED",
              local_trimmed: true
            }]
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

  it('if it is loading show the spinner', () => {
    providerProps.listLightningTransactions.isLoading = true;
    renderWithMockContext(<CLNTransactionsList />, { providerProps });
    expect(screen.getByTestId('cln-transactions-list-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', () => {
    renderWithMockContext(<CLNTransactionsList />, { providerProps });
    expect(screen.queryByTestId('cln-transactions-list-spinner')).not.toBeInTheDocument();
  })

  it('if it has an error, show the error view', () => {
    providerProps.listLightningTransactions.clnTransactions = [];
    providerProps.listLightningTransactions.error = "error message!";
    renderWithMockContext(<CLNTransactionsList />, { providerProps });
    expect(screen.getByTestId('cln-transactions-list-error')).toBeInTheDocument();
  })

  it('if it has transactions, show the offers list', () => {
    renderWithMockContext(<CLNTransactionsList />, { providerProps });
    const offersList = screen.getByTestId('cln-transactions-list');
    expect(offersList).toBeInTheDocument();
    expect(offersList.children.length).toBe(2);
  })

  it('if there are no channels, show the no offers text', () => {
    providerProps.listLightningTransactions.clnTransactions = [];
    renderWithMockContext(<CLNTransactionsList />, { providerProps });
    expect(screen.getByText('No transaction found. Click send/receive to start!')).toBeInTheDocument();
  })

  it('if there are active channels, show the proper text', () => {
    providerProps.listChannels.activeChannels = [];
    providerProps.listLightningTransactions.clnTransactions = [];
    renderWithMockContext(<CLNTransactionsList />, { providerProps });
    expect(screen.getByText('No transaction found. Open channel to start!')).toBeInTheDocument();
  })

});
