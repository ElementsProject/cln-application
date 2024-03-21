import { render } from '@testing-library/react';
import { AppContext } from '../store/AppContext';
import { ApplicationModes, Units } from './constants';
import { Offer, LightningTransaction, Invoice, BkprTransaction, PeerChannel } from '../types/lightning-wallet.type';

const mockFaDollarSign = { icon: ['fas', 'dollar-sign'], iconName: 'dollar-sign', prefix: 'fas' };

export const mockInvoice: Invoice = {
  bolt11: 'lntb1p0j7ktppp5tulqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdqrzjqwp5huanxycteeap7tuwenjkrajn8f4sa8m60pt4xp2cjmn8cn5s7zatmdgqz0p6atwvs5q00s3ucwechkntdjqx56m2v0csf30jn2k2grxkz4d9qyjhz2d0s3zfp9e69enq6045ga3x4etn2efmy2a5ajph973g679ujm55sl2zsjjmtqga3tvp',
  bolt12: 'lno1pqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqppqtyvc6csghpsu7zqutj7qcnva5up4uzl0pg2eq9tc4z9n8y92q3zv96gcmv4ezqcefvp4jk03mf85ypek7a4pagy6hqjsg467k049gx5czysxgm4hzcpjy7jls',
  description: 'A mock invoice',
  expires_at: 1709513229918,
  label: 'LABEL123',
  msatoshi: 50000,
  msatoshi_received: 50000,
  amount_msat: 50000,
  amount_received_msat: 50000,
  local_offer_id: 'local_offer_id_123',
  invreq_payer_note: 'invreq_payer_note',
  paid_at: 1709513229900,
  pay_index: 1,
  payment_hash: '638f4dbbe4e0dfd52ca385e5857c65407e4449fc1250b3b6d8483b6a885f9f5a',
  payment_preimage: '6dcd4ce23d88e2ee95838f7b014b6284a5b63e723ec47ca8c7e4c5d29dd3a2b3',
  status: 'paid'
};

export const mockClnTransaction: LightningTransaction = {
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
};

export const mockTransaction: BkprTransaction = {
  account: 'mockAccount1',
  type: 'onchain_fee',
  credit_msat: '1000',
  debit_msat: '2000',
  currency: 'BTC',
  timestamp: 1624000000,
  tag: 'mockTag',
  txid: 'mockTxId',
  blockheight: 123456,
  outpoint: 'mockOutpoint',
  origin: 'mockOrigin',
  payment_id: 'mockPaymentId',
  description: 'mockDescription',
  fees_msat: '3000',
  is_rebalance: false,
  part_id: 123
};

export const mockFirstOffer: Offer = {
  bolt12: "lno1pwruza4cv00xgc8z2080w7kqjz5vunxrv4xvwu7fae60n0d4xqkdejwjcghwnghwhd0c8zugtfvslgzpfscghet0sqqqyqqqyqqqzqqqfqqqqrr9umvwg5a5nlkyjf0gz7wrc5gg40t8xflq2c23hyz0cyftmnz5kppafku2eurjg5rzr92kdwhd42w5pufheslp73jjl9euvvs32halutnggczp0kytwtrv28z2aw35z95m76x4ua2ds4l3nu05wt63u86jksql6t6qf",
  offer_id: "Offer1",
  active: true,
  single_use: false,
  used: false,
  label: "MockOfferLabel"
};

export const mockSelectedChannel: PeerChannel = {
  peer_id: "mockPeerId",
  peer_connected: true,
  current_state: "ACTIVE",
  state: "CHANNELD_NORMAL",
  channel_id: "1234567890abcdef",
  short_channel_id: "123x456x789",
  node_alias: "MockNode",
  alias: {
    local: "LocalNodeAlias",
    remote: "RemoteNodeAlias",
  },
  scratch_txid: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
  feerate: {
    perkw: 5000,
    perkb: 20000
  },
  owner: "MockOwner",
  funding_txid: "abcdef123456abcdef123456abcdef123456abcdef123456abcdef123456abcdef12",
  funding_outnum: 1,
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
  to_us_sat: 5000000000,
  to_them_sat: 0,
  total_sat: 10000000000,
  to_us_msat: 5000000000000,
  to_them_msat: 0,
  total_msat: 10000000000000,
  fee_base_msat: 1000,
  fee_proportional_millionths: 10,
  dust_limit_msat: 546000,
  spendable_msat: 49000000000,
  receivable_msat: 49000000000,
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
  in_payments_offered: 10,
  in_offered_msat: 5000000,
  in_payments_fulfilled: 5,
  in_fulfilled_msat: 2500000,
  out_payments_offered: 10,
  out_offered_msat: 5000000,
  out_payments_fulfilled: 5,
  out_fulfilled_msat: 2500000,
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

export const mockStoreData = {
  authStatus: {
    isAuthenticated: true,
    isValidPassword: true
  },
  appConfig: {
    appMode: { isLoading: false, unit: Units.SATS, fiatUnit: 'USD', appMode: ApplicationModes.DARK }
  },
  fiatConfig: { isLoading: false, symbol: mockFaDollarSign, venue: '', rate: 1 },
  showToast: {
    show: false,
    type: '',
    delay: 3000
  },
  walletBalances: {
    isLoading: false,
    clnLocalBalance: 13377777,
    clnRemoteBalance: 0,
    clnPendingBalance: 0,
    clnInactiveBalance: 0,
    btcSpendableBalance: 13377777,
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
        node_alias: "my_alias",
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
        node_alias: "my_alias2",
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
        node_alias: "my_alias3",
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
        node_alias: "my_alias4",
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
        node_alias: "my_alias5",
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
        node_alias: "my_alias6",
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
  },
  nodeInfo: {
    isLoading: false,
    id: '03f45466c31a26895d554b33b14fbfdf411a1f94c51608d739be4b431589f85b4f',
    alias: 'recess-geography-8501',
    color: '#3300FF',
    num_peers: 10,
    num_pending_channels: 2,
    num_active_channels: 8,
    num_inactive_channels: 0,
    address: [{
      type: 'ipv4',
      address: '192.0.2.15',
      port: 9735
    }],
    binding: [{
      type: 'ipv4',
      address: '192.0.2.15',
      port: 9735
    }],
    version: 'v0.9.0',
    blockheight: 671419,
    network: 'bitcoin',
    msatoshi_fees_collected: 50000,
    fees_collected_msat: '50000msat',
    'lightning-dir': '/home/user/.lightning/bitcoin',
    warning_bitcoind_sync: 'Block height out of range',
    our_features: { 'option_data_loss_protect': true },
    error: null
  },
  listPeers: {
    isLoading: false,
    peers: [
      {
        id: '03e50492eab4107a773141bb419e107bda3de3d55652e6e1a41225f06a0bbf2d56',
        connected: true,
        netaddr: ['123.4.5.6:9735'],
        last_timestamp: '1628602653',
        alias: 'peer1',
        color: '68f728',
        features: '0x2022aa2a',
        addresses: [
          {
            type: 'ipv4',
            address: '123.4.5.6',
            port: 9735
          }
        ],
        option_will_fund: {},
      },
      {
        id: '0299fc0200a6e57e4933421a433284984390adc0cc32ac57fb104f2c9782c4ca86',
        connected: false,
        netaddr: ['236.7.8.9:9735'],
        last_timestamp: '1628602660',
        alias: 'peer2',
        color: '59f758',
        features: '0x2022bb2b',
        addresses: [
          {
            type: 'ipv4',
            address: '236.7.8.9',
            port: 9735
          }
        ],
        option_will_fund: {},
      },
    ],
    error: null,
  },
  walletConnect: {
    isLoading: false,
    GRPC_PORT: '1337',
    DEVICE_DOMAIN_NAME: 'device-domain-name',
    LOCAL_HOST: '127.0.0.1',
    REST_MACAROON: 'abdef12345',
    REST_PORT: '1336',
    TOR_DOMAIN_NAME: 'tor-domain-name',
    TOR_HOST: 'tor-host',
    CLN_NODE_IP: '192.0.2.0',
    WS_PORT: '3000',
    NODE_PUBKEY: '03f45466c31a26895d554b33b14fbfdf411a1f94c51608d739be4b431589f85b4f',
    COMMANDO_RUNE: 'commandoRune',
    APP_VERSION: 'v1.0.0',
    error: null
  }
};

export const getMockStoreData = (replaceKey?: string, replaceValue?: any) => {
  if (replaceKey && replaceKey !== '' && !!replaceValue) {
    mockStoreData[replaceKey] = replaceValue;
  }
  return mockStoreData;
};

export const renderWithMockContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};
