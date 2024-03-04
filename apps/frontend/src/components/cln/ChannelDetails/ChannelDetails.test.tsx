import { render, screen } from '@testing-library/react';
import ChannelDetails from './ChannelDetails';
import { AppContext } from '../../../store/AppContext';
import { Channel } from '../../../types/lightning-wallet.type';
import { ApplicationModes, Units } from '../../../utilities/constants';

const renderWithMockContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};

export const selChannel: Channel = {
  channel_id: "1234567890abcdef",
  current_state: "OPEN",
  short_channel_id: "123x456x789",
  node_alias: "MockNode",
  alias: {
    local: "LocalNodeAlias",
    remote: "RemoteNodeAlias",
  },
  satoshi_to_us: 50000000,
  satoshi_to_them: 50000000,
  satoshi_total: 100000000,
  state: "MockState",
  connected: true,
  scratch_txid: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
  feerate: {
    perkw: 5000,
    perkb: 20000
  },
  owner: "MockOwner",
  direction: 1,
  funding_txid: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
  funding_outnum: 1,
  close_to_addr: "mockAddr",
  close_to: "mockCloseTo",
  private: false,
  opener: "mockOpener",
  features: ["option_data_loss_protect", "initial_routing_sync", "option_upfront_shutdown_script", "gossip_queries", "var_onion_optin", "gossip_queries_ex"],
  funding: {
    local_funds_msat: "5000000000000",
    remote_funds_msat: "5000000000000",
    pushed_msat: "100000000000",
    fee_paid_msat: "5000000000",
    fee_rcvd_msat: "5000000000"
  },
  msatoshi_to_us: 5000000000000,
  msatoshi_to_us_min: 4000000000000,
  msatoshi_to_us_max: 6000000000000,
  msatoshi_total: 10000000000000,
  to_us_msat: 5000000000000,
  total_msat: 10000000000000,
  fee_base_msat: "1000",
  fee_proportional_millionths: 10,
  dust_limit_satoshis: 546,
  dust_limit_msat: 546000,
  max_htlc_value_in_flight_msat: 99000000,
  their_channel_reserve_satoshis: 10000,
  our_channel_reserve_satoshis: 10000,
  spendable_msatoshi: 49000000,
  receivable_msatoshi: 49000000,
  spendable_msat: 49000000000,
  receivable_msat: 49000000000,
  htlc_minimum_msat: 1000,
  their_to_self_delay: 144,
  our_to_self_delay: 144,
  max_accepted_htlcs: 483,
  state_changes: [{
    timestamp: "2022-01-01T10:10:10.000Z",
    old_state: "CHANNELD_NORMAL",
    new_state: "ONCHAIND_THEIR_UNILATERAL",
    cause: "onchaind",
    message: "Remote peer unresponsive"
  }],
  status: ["CHANNELD_NORMAL:Reconnected, and reestablished."],
  last_tx_fee_msat: "1234",
  in_payments_offered: 10,
  in_msatoshi_offered: 5000000,
  in_payments_fulfilled: 5,
  in_msatoshi_fulfilled: 2500000,
  out_payments_offered: 10,
  out_msatoshi_offered: 5000000,
  out_payments_fulfilled: 5,
  out_msatoshi_fulfilled: 2500000,
  htlcs: [{
    direction: "out",
    id: 1,
    amount_msat: "1000",
    expiry: "600",
    payment_hash: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
    state: "SENT_ADD_ACK_REVOCATION",
    local_trimmed: false
  }],
};

describe('ChannelDetails component ', () => {
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
    renderWithMockContext(<ChannelDetails selChannel={selChannel} />, { providerProps });
    expect(screen.getByTestId('channel-details')).toBeInTheDocument();
  });

});
