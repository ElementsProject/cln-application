import { render } from '@testing-library/react';
import { AppContext } from '../store/AppContext';
import { ApplicationModes, Units } from './constants';
import { Offer, LightningTransaction, Invoice, BkprTransaction, PeerChannel } from '../types/lightning-wallet.type';

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

export const mockInvoice: Invoice = {
  label: "Mvtkt",
  bolt11: "lnbcrt12500n1pjlm76nsp58eas344ssezy53zyy0rly6945amyzngk2e2j207mjesywpsnj0cqpp5757mjylkl2tjmekw0ekgupke8k46cumq8l49f3eq334hjfjjq2qsdq5f4hhv6t9yp2xjcmtv46qxqyjw5qcqp2rzjqdywtqssh0qj3vwv8nq62g9x2j42q8jluewx2dq7yxmp58cfm22d2qqz2yqqqqgqqqqqqqqpqqqqqzsqqc9qx3qysgqp68f5g7ncjsg2e3c9xhhawxy28ue672ay70rurx54f2zph77srpnz808mgtv98eczaf7s7ggdze8p8ud4n4slwxlmxevh8vu0e95pfcql3e2xk",
  payment_hash: "f53db913f6fa972de6ce7e6c8e06d93dabac73603fea54c7208c6b7926520281",
  amount_msat: 1250000,
  status: "unpaid",
  description: "Movie Ticket",
  expires_at: 1711748563,
  created_index: 3
};

export const mockOffer: Offer = {
  offer_id: "f6f68cefe4ab28548fc746a13b671eceff11ce47339dfa6cb32a831bf14d08ff",
  active: true,
  single_use: false,
  bolt12: "lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrcgq3rcdrqqpgg5uethwvs8xatzwd3hy6tsw35k7mskyyp68zdn5tm65mulfnxpnu4a0ght4q6ev6v7s6m3tj4259rlcdlnz3q",
  used: true
};

export const mockClnTransaction: LightningTransaction = {
  type: "INVOICE",
  label: "invoicelblreh70ik94m1711145685831",
  bolt11: "lnbcrt500u1pjluqk4sp5z4zw6lkseaj2fefddsefykvhg4wzrwyeaqn6grs5ksun5r8rzccqpp57s0xrg45sxpw57pfdwm2lt69mkthmfczahwylhrfytlpv9mflmqsdq0gfex2cttveshxaqxqyjw5qcqp2rzjqdywtqssh0qj3vwv8nq62g9x2j42q8jluewx2dq7yxmp58cfm22d2qqz2yqqqqgqqqqqqqqpqqqqqzsqqc9qx3qysgqa0zd6aserdx5nxvtjkeye7l3ft7dq6t2fdz2afnu3drafcg37qn5yyy25t7s73ck3lqw77srscqznluz8mu22aqmjew9hd7qdmkxc7cps7hzsc",
  payment_hash: "f41e61a2b48182ea78296bb6afaf45dd977da702eddc4fdc6922fe161769fec1",
  amount_msat: 50000000,
  status: "unpaid",
  description: "Breakfast",
  expires_at: Date.now() + 3600000, // 1hr from now,
  created_index: 4,
}

export const mockBTCTransaction: BkprTransaction = {
  account: "wallet",
  type: "chain",
  tag: "deposit",
  credit_msat: 37379100000,
  debit_msat: 0,
  currency: "bcrt",
  outpoint: "05e4a3f71410f73042a7d0f8d1cbe1c0e902cb4ea44ed46609582e005dd38690:1",
  timestamp: 1711142164,
  blockheight: 593
};

export const mockSelectedChannel: PeerChannel = {
  peer_id: "024244c0c7d23d1b411578a1a2376fb4cebf5526449e1a83241fd4a12801034c5b",
  peer_connected: false,
  current_state: "ACTIVE",
  node_alias: "CLNReg2",
  channel_type: {
    bits: [
      12
    ],
    names: [
      "static_remotekey/even"
    ]
  },
  ignore_fee_limits: true,
  updates: {
    local: {
      htlc_minimum_msat: 0,
      htlc_maximum_msat: 1485000000,
      cltv_expiry_delta: 6,
      fee_base_msat: 1,
      fee_proportional_millionths: 10
    }
  },
  state: "CHANNELD_NORMAL",
  scratch_txid: "4fe207694ae089014b9008f2463dbf438553e26a2ad94ba2e455357c84692400",
  last_tx_fee_msat: 183000,
  lost_state: false,
  feerate: {
    perkw: 253,
    perkb: 1012
  },
  short_channel_id: "185x1x1",
  direction: 1,
  channel_id: "e84435b002a67feedbe958aeb01710cb0d832fd20281e63a2e9943c5c4c4d7e1",
  funding_txid: "caef9fceb32991981ca39501d8cd807c7f4d4732de46c1381aac5b3027bd75ee",
  funding_outnum: 1,
  close_to_addr: "bcrt1pns2fct20yudt54v8ta5jxqq909lwelu82gpwp2ym59ffelzcp7rqg0w646",
  close_to: "51209c149c2d4f271aba55875f69230005797eecff875202e0a89ba1529cfc580f86",
  private: false,
  opener: "remote",
  alias: {
    local: "13947255x7038877x61250"
  },
  features: [
    "option_static_remotekey"
  ],
  funding: {
    local_funds_msat: 0,
    remote_funds_msat: 1500000000,
    pushed_msat: 0
  },
  to_us_sat: 0,
  to_them_sat: 1500000,
  total_sat: 1500000,
  to_us_msat: 0,
  min_to_us_msat: 0,
  max_to_us_msat: 0,
  total_msat: 1500000000,
  fee_base_msat: 1,
  fee_proportional_millionths: 10,
  dust_limit_msat: 546000,
  max_total_htlc_in_msat: 18446744073709551615,
  their_reserve_msat: 15000000,
  our_reserve_msat: 15000000,
  spendable_msat: 0,
  receivable_msat: 1484460000,
  minimum_htlc_in_msat: 0,
  minimum_htlc_out_msat: 0,
  maximum_htlc_out_msat: 1485000000,
  their_to_self_delay: 6,
  our_to_self_delay: 6,
  max_accepted_htlcs: 483,
  state_changes: [
    {
      timestamp: "2023-09-14T17:53:38.684Z",
      old_state: "DUALOPEND_OPEN_COMMITTED",
      new_state: "DUALOPEND_AWAITING_LOCKIN",
      cause: "remote",
      message: "Sigs exchanged, waiting for lock-in"
    },
    {
      timestamp: "2023-09-14T17:56:31.918Z",
      old_state: "DUALOPEND_AWAITING_LOCKIN",
      new_state: "CHANNELD_NORMAL",
      cause: "remote",
      message: "Lockin complete"
    }
  ],
  status: [
    "CHANNELD_NORMAL:Will attempt reconnect in 300 seconds"
  ],
  in_payments_offered: 0,
  in_offered_msat: 0,
  in_payments_fulfilled: 0,
  in_fulfilled_msat: 0,
  out_payments_offered: 0,
  out_offered_msat: 0,
  out_payments_fulfilled: 0,
  out_fulfilled_msat: 0,
  htlcs: []
};

const mockFaDollarSign = { icon: ['fas', 'dollar-sign'], iconName: 'dollar-sign', prefix: 'fas' };

export const mockStoreData = {
  authStatus: {
    isAuthenticated: true,
    isValidPassword: true
  },
  showModals: {
    nodeInfoModal: false,
    connectWalletModal: false,
    loginModal: false,
    logoutModal: false,
    setPasswordModal: false
  },
  showToast: {
    show: false,
    message: "",
    onConfirmResponse: null
  },
  walletConnect: {
    LOCAL_HOST: "http://user.local",
    DEVICE_DOMAIN_NAME: "user.local",
    TOR_HOST: "http://oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion",
    WS_PORT: "5001",
    GRPC_PORT: "2106",
    CLIENT_KEY: "ClientKey",
    CLIENT_CERT: "ClientCert",
    CA_CERT: "CACert",
    REST_PORT: "3001",
    REST_MACAROON: "0201036c6e6402e501030a1042beb666ba043f72cb147adf3eaafc9e1201301a160a076164647265737312047265616",
    CLN_NODE_IP: "127.0.0.1",
    NODE_PUBKEY: "03a389b3a2f7aa6f9f4ccc19f2bd7a2eba83596699e86b715caaaa147fc37f3144",
    COMMANDO_RUNE: "mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j",
    INVOICE_RUNE: "aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==",
    APP_VERSION: "0.0.5",
    isLoading: false,
    error: null,
    TOR_DOMAIN_NAME: "oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion"
  },
  appConfig: {
    unit: Units.SATS,
    fiatUnit: "USD",
    appMode: ApplicationModes.LIGHT,
    isLoading: false,
    error: null,
    singleSignOn: false
  },
  fiatConfig: {
    venue: "KRAKEN",
    rate: "62950.00000",
    isLoading: false,
    symbol: mockFaDollarSign,
    error: null
  },
  feeRate: {
    perkb: {
      opening: 1080,
      mutual_close: 1080,
      unilateral_close: 1080,
      unilateral_anchor_close: 5000,
      penalty: 1080,
      min_acceptable: 1012,
      max_acceptable: 10800,
      floor: 1012,
      estimates: [
        {
          blockcount: 2,
          feerate: 1080,
          smoothed_feerate: 1080
        },
        {
          blockcount: 6,
          feerate: 1080,
          smoothed_feerate: 1080
        },
        {
          blockcount: 12,
          feerate: 1080,
          smoothed_feerate: 1080
        },
        {
          blockcount: 100,
          feerate: 1080,
          smoothed_feerate: 1080
        }
      ]
    },
    onchain_fee_estimates: {
      opening_channel_satoshis: 189,
      mutual_close_satoshis: 181,
      unilateral_close_satoshis: 1390,
      unilateral_close_nonanchor_satoshis: 161,
      htlc_timeout_satoshis: 179,
      htlc_success_satoshis: 189
    },
    isLoading: false,
    error: null
  },
  nodeInfo: {
    id: "03a389b3a2f7aa6f9f4ccc19f2bd7a2eba83596699e86b715caaaa147fc37f3144",
    alias: "CLNReg1",
    color: "03a389",
    num_peers: 5,
    num_pending_channels: 0,
    num_active_channels: 3,
    num_inactive_channels: 1,
    address: [
      {
        type: "ipv4",
        address: "127.0.0.1",
        port: 19738
      }
    ],
    binding: [
      {
        type: "ipv4",
        address: "127.0.0.1",
        port: 7171
      }
    ],
    version: "v24.02.1-40-g1b08de2",
    blockheight: 593,
    network: "regtest",
    fees_collected_msat: 0,
    "lightning-dir": "/home/user/.lightning/regtest",
    our_features: {
      init: "08aa802a8a5961",
      node: "88aa802a8a5961",
      channel: "",
      invoice: "02000022024100"
    },
    isLoading: false,
    error: null
  },
  listFunds: {
    outputs: [
      {
        txid: "9d666e7b08ed19e065edfb797726c1bf78596f821fb3c8f7c7b75ad02b31e942",
        output: 1,
        amount_msat: 74099668000,
        scriptpubkey: "5120b657aa289a0ad3290902dc2a7b3ffeab1a6884e934ce25f8414e67151443e487",
        address: "bcrt1pket652y6ptfjjzgzms48k0l74vdx3p8fxn8zt7zpfen329zrujrsltlfuj",
        status: "confirmed",
        blockheight: 589,
        reserved: false
      },
      {
        txid: "f04794e0bd5542139a5cf19c99ad294e97edb49f180d06ec5d634f2df63fb898",
        output: 0,
        amount_msat: 2499838000,
        scriptpubkey: "5120c8415874d3666a6db5b85ebba5b58c7cb275cdb5837872030bb49bea5266bd48",
        address: "bcrt1pepq4saxnve4xmddct6a6tdvv0je8tnd4sdu8yqctkjd755nxh4yqqf5u0p",
        status: "unconfirmed",
        reserved: false
      }
    ],
    channels: [
      {
        peer_id: "0348e58210bbc128b1cc3cc1a520a654aaa01e5fe65c65341e21b61a1f09da94d5",
        connected: false,
        state: "CLOSINGD_COMPLETE",
        channel_id: "14c728a339eb12a0f7401c653eb79990a2ecbfaef60b7e80b2e744ba6123af49",
        short_channel_id: "585x2x0",
        our_amount_msat: 2500000000,
        amount_msat: 2500000000,
        funding_txid: "bbecc5e19be2929080678eecd064cb035cc9f5a835f45fc86a8d87b0967c7349",
        funding_output: 0
      },
      {
        peer_id: "0348e58210bbc128b1cc3cc1a520a654aaa01e5fe65c65341e21b61a1f09da94d5",
        connected: true,
        state: "CHANNELD_NORMAL",
        channel_id: "47365d06bb126cd835844dc2f111b94b192c81bad150adb8f54407baf0f3a298",
        short_channel_id: "593x1x0",
        our_amount_msat: 1150000000,
        amount_msat: 60000000000,
        funding_txid: "05e4a3f71410f73042a7d0f8d1cbe1c0e902cb4ea44ed46609582e005dd38690",
        funding_output: 0
      },
      {
        peer_id: "023d28435ce4b49f068c964aacbcb6dd114317a70f03e5a731ea72d25df1cff35b",
        connected: true,
        state: "CHANNELD_NORMAL",
        channel_id: "485fb5e263214c7d8fe7ff547bcb6b3a8e3e9eb396084a46a701ca144829ef20",
        short_channel_id: "585x1x0",
        our_amount_msat: 8000000,
        amount_msat: 1500000000,
        funding_txid: "20ef294814ca01a7464a0896b39e3e8e3a6bcb7b54ffe78f7d4c2163e2b55f48",
        funding_output: 0
      },
      {
        peer_id: "03a183403bbcc01576516a5c237fac0f850f4662c0e3b06060b9dc60bdcaf1c43d",
        connected: false,
        state: "CHANNELD_NORMAL",
        channel_id: "42e9312bd05ab7c7f7c8b31f826f5978bfc1267779fbed65e019ed087b6e669d",
        short_channel_id: "589x1x0",
        our_amount_msat: 3398000000,
        amount_msat: 3400000000,
        funding_txid: "9d666e7b08ed19e065edfb797726c1bf78596f821fb3c8f7c7b75ad02b31e942",
        funding_output: 0
      }
    ],
    isLoading: false,
    error: null
  },
  listPeers: {
    peers: [
      {
        id: "02a266cda1a98a268b724fb0fc30e690748401f9e8d21c897ea733ac16f3879949",
        connected: true,
        num_channels: 0,
        netaddr: [
          "127.0.0.1:19741"
        ],
        features: "a080288a5941"
      },
      {
        id: "0348e58210bbc128b1cc3cc1a520a654aaa01e5fe65c65341e21b61a1f09da94d5",
        connected: true,
        num_channels: 2,
        netaddr: [
          "127.0.0.1:7272"
        ],
        features: "08aa802a8a5961"
      },
      {
        id: "023d28435ce4b49f068c964aacbcb6dd114317a70f03e5a731ea72d25df1cff35b",
        connected: true,
        num_channels: 1,
        netaddr: [
          "127.0.0.1:37062"
        ],
        features: "800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000002000888252a1"
      },
      {
        id: "03a183403bbcc01576516a5c237fac0f850f4662c0e3b06060b9dc60bdcaf1c43d",
        connected: false,
        num_channels: 1,
        features: "800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000002000888252a1"
      }
    ],
    isLoading: false,
    error: null
  },
  listChannels: {
    activeChannels: [
      {
        peer_id: "0348e58210bbc128b1cc3cc1a520a654aaa01e5fe65c65341e21b61a1f09da94d5",
        peer_connected: true,
        reestablished: true,
        channel_type: {
          bits: [
            12,
            22
          ],
          names: [
            "static_remotekey/even",
            "anchors_zero_fee_htlc_tx/even"
          ]
        },
        ignore_fee_limits: true,
        updates: {
          local: {
            htlc_minimum_msat: 0,
            htlc_maximum_msat: 59400000000,
            cltv_expiry_delta: 6,
            fee_base_msat: 1,
            fee_proportional_millionths: 10
          },
          remote: {
            htlc_minimum_msat: 0,
            htlc_maximum_msat: 59400000000,
            cltv_expiry_delta: 6,
            fee_base_msat: 1,
            fee_proportional_millionths: 10
          }
        },
        last_stable_connection: 1711142224,
        state: "CHANNELD_NORMAL",
        scratch_txid: "dce78757da8b373aa47d0b44f340fe26e909f5f0b4a23881f168fb4cb8f5556d",
        last_tx_fee_msat: 1410000,
        lost_state: false,
        feerate: {
          perkw: 1255,
          perkb: 5020
        },
        owner: "channeld",
        short_channel_id: "593x1x0",
        direction: 1,
        channel_id: "47365d06bb126cd835844dc2f111b94b192c81bad150adb8f54407baf0f3a298",
        funding_txid: "05e4a3f71410f73042a7d0f8d1cbe1c0e902cb4ea44ed46609582e005dd38690",
        funding_outnum: 0,
        close_to_addr: "bcrt1pt54e3zzk22cdx82ca74f6jh4szclu0qtqh755xr0hr9rgp7l0gwsf68q0g",
        close_to: "51205d2b98885652b0d31d58efaa9d4af580b1fe3c0b05fd4a186fb8ca3407df7a1d",
        private: false,
        opener: "remote",
        alias: {
          local: "11181086x10831918x33133",
          remote: "10956033x11392660x22074"
        },
        features: [
          "option_static_remotekey",
          "option_anchors_zero_fee_htlc_tx"
        ],
        funding: {
          local_funds_msat: 0,
          remote_funds_msat: 60000000000,
          pushed_msat: 0
        },
        to_us_msat: 1150000000,
        min_to_us_msat: 0,
        max_to_us_msat: 1200000000,
        total_msat: 60000000000,
        fee_base_msat: 1,
        fee_proportional_millionths: 10,
        dust_limit_msat: 546000,
        max_total_htlc_in_msat: 18446744073709552000,
        their_reserve_msat: 600000000,
        our_reserve_msat: 600000000,
        spendable_msat: 550000000,
        receivable_msat: 58245656000,
        minimum_htlc_in_msat: 0,
        minimum_htlc_out_msat: 0,
        maximum_htlc_out_msat: 59400000000,
        their_to_self_delay: 6,
        our_to_self_delay: 6,
        max_accepted_htlcs: 483,
        state_changes: [
          {
            timestamp: "2024-03-22T21:15:41.973Z",
            old_state: "DUALOPEND_OPEN_COMMITTED",
            new_state: "DUALOPEND_AWAITING_LOCKIN",
            cause: "remote",
            message: "Sigs exchanged, waiting for lock-in"
          },
          {
            timestamp: "2024-03-22T21:16:04.278Z",
            old_state: "DUALOPEND_AWAITING_LOCKIN",
            new_state: "CHANNELD_NORMAL",
            cause: "remote",
            message: "Lockin complete"
          }
        ],
        status: [
          "CHANNELD_NORMAL:Channel ready for use."
        ],
        in_payments_offered: 1,
        in_offered_msat: 1200000000,
        in_payments_fulfilled: 1,
        in_fulfilled_msat: 1200000000,
        out_payments_offered: 1,
        out_offered_msat: 50000000,
        out_payments_fulfilled: 1,
        out_fulfilled_msat: 50000000,
        htlcs: [],
        node_alias: "CLNReg2",
        to_us_sat: 1150000,
        total_sat: 60000000,
        to_them_sat: 58850000,
        current_state: "ACTIVE"
      },
      {
        peer_id: "023d28435ce4b49f068c964aacbcb6dd114317a70f03e5a731ea72d25df1cff35b",
        peer_connected: true,
        reestablished: true,
        channel_type: {
          bits: [
            12,
            22
          ],
          names: [
            "static_remotekey/even",
            "anchors_zero_fee_htlc_tx/even"
          ]
        },
        ignore_fee_limits: true,
        updates: {
          local: {
            htlc_minimum_msat: 1,
            htlc_maximum_msat: 1485000000,
            cltv_expiry_delta: 6,
            fee_base_msat: 1,
            fee_proportional_millionths: 10
          },
          remote: {
            htlc_minimum_msat: 1000,
            htlc_maximum_msat: 1500000000,
            cltv_expiry_delta: 80,
            fee_base_msat: 1000,
            fee_proportional_millionths: 1
          }
        },
        last_stable_connection: 1711141591,
        state: "CHANNELD_NORMAL",
        scratch_txid: "7cb6dfc1882544f954de1b6afb85963fedbbadf0e837667899695cd18bd0710f",
        last_tx_fee_msat: 2810000,
        lost_state: false,
        feerate: {
          perkw: 2500,
          perkb: 10000
        },
        owner: "channeld",
        short_channel_id: "585x1x0",
        direction: 1,
        channel_id: "485fb5e263214c7d8fe7ff547bcb6b3a8e3e9eb396084a46a701ca144829ef20",
        funding_txid: "20ef294814ca01a7464a0896b39e3e8e3a6bcb7b54ffe78f7d4c2163e2b55f48",
        funding_outnum: 0,
        close_to_addr: "bcrt1pywe2vnlet7jgajfzemz7eq7x3wquacq4u6js68agmezy0mml46ns30x64u",
        close_to: "512023b2a64ff95fa48ec922cec5ec83c68b81cee015e6a50d1fa8de4447ef7faea7",
        private: false,
        opener: "remote",
        alias: {
          local: "15866324x13969119x13198"
        },
        features: [
          "option_static_remotekey",
          "option_anchors_zero_fee_htlc_tx"
        ],
        funding: {
          local_funds_msat: 0,
          remote_funds_msat: 1500000000,
          pushed_msat: 0
        },
        to_us_msat: 8000000,
        min_to_us_msat: 0,
        max_to_us_msat: 8000000,
        total_msat: 1500000000,
        fee_base_msat: 1,
        fee_proportional_millionths: 10,
        dust_limit_msat: 546000,
        max_total_htlc_in_msat: 18446744073709552000,
        their_reserve_msat: 15000000,
        our_reserve_msat: 15000000,
        spendable_msat: 0,
        receivable_msat: 1469000000,
        minimum_htlc_in_msat: 0,
        minimum_htlc_out_msat: 1,
        maximum_htlc_out_msat: 1485000000,
        their_to_self_delay: 6,
        our_to_self_delay: 180,
        max_accepted_htlcs: 483,
        state_changes: [
          {
            timestamp: "2024-03-22T21:06:32.361Z",
            old_state: "CHANNELD_AWAITING_LOCKIN",
            new_state: "CHANNELD_NORMAL",
            cause: "remote",
            message: "Lockin complete"
          }
        ],
        status: [
          "CHANNELD_NORMAL:Channel ready for use."
        ],
        in_payments_offered: 1,
        in_offered_msat: 8000000,
        in_payments_fulfilled: 1,
        in_fulfilled_msat: 8000000,
        out_payments_offered: 0,
        out_offered_msat: 0,
        out_payments_fulfilled: 0,
        out_fulfilled_msat: 0,
        htlcs: [],
        node_alias: "LNDReg",
        to_us_sat: 8000,
        total_sat: 1500000,
        to_them_sat: 1492000,
        current_state: "ACTIVE"
      }
    ],
    pendingChannels: [
      {
        peer_id: "0348e58210bbc128b1cc3cc1a520a654aaa01e5fe65c65341e21b61a1f09da94d5",
        peer_connected: true,
        reestablished: true,
        channel_type: {
          bits: [
            12,
            22
          ],
          names: [
            "static_remotekey/even",
            "anchors_zero_fee_htlc_tx/even"
          ]
        },
        ignore_fee_limits: true,
        updates: {
          local: {
            htlc_minimum_msat: 0,
            htlc_maximum_msat: 2475000000,
            cltv_expiry_delta: 6,
            fee_base_msat: 1,
            fee_proportional_millionths: 10
          },
          remote: {
            htlc_minimum_msat: 0,
            htlc_maximum_msat: 2475000000,
            cltv_expiry_delta: 6,
            fee_base_msat: 1,
            fee_proportional_millionths: 10
          }
        },
        last_stable_connection: 1711141751,
        state: "CLOSINGD_COMPLETE",
        scratch_txid: "f04794e0bd5542139a5cf19c99ad294e97edb49f180d06ec5d634f2df63fb898",
        last_tx_fee_msat: 162000,
        lost_state: false,
        feerate: {
          perkw: 1255,
          perkb: 5020
        },
        short_channel_id: "585x2x0",
        direction: 1,
        channel_id: "14c728a339eb12a0f7401c653eb79990a2ecbfaef60b7e80b2e744ba6123af49",
        funding_txid: "bbecc5e19be2929080678eecd064cb035cc9f5a835f45fc86a8d87b0967c7349",
        funding_outnum: 0,
        close_to_addr: "bcrt1pepq4saxnve4xmddct6a6tdvv0je8tnd4sdu8yqctkjd755nxh4yqqf5u0p",
        close_to: "5120c8415874d3666a6db5b85ebba5b58c7cb275cdb5837872030bb49bea5266bd48",
        private: false,
        opener: "local",
        closer: "local",
        alias: {
          local: "9768659x4005740x44041",
          remote: "6891834x11681184x7487"
        },
        features: [
          "option_static_remotekey",
          "option_anchors_zero_fee_htlc_tx"
        ],
        funding: {
          local_funds_msat: 2500000000,
          remote_funds_msat: 0,
          pushed_msat: 0
        },
        to_us_msat: 2500000000,
        min_to_us_msat: 2500000000,
        max_to_us_msat: 2500000000,
        total_msat: 2500000000,
        fee_base_msat: 1,
        fee_proportional_millionths: 10,
        dust_limit_msat: 546000,
        max_total_htlc_in_msat: 18446744073709552000,
        their_reserve_msat: 25000000,
        our_reserve_msat: 25000000,
        spendable_msat: 2470656000,
        receivable_msat: 0,
        minimum_htlc_in_msat: 0,
        minimum_htlc_out_msat: 0,
        maximum_htlc_out_msat: 2475000000,
        their_to_self_delay: 6,
        our_to_self_delay: 6,
        max_accepted_htlcs: 483,
        state_changes: [
          {
            timestamp: "2024-03-22T21:02:22.590Z",
            old_state: "DUALOPEND_OPEN_COMMITTED",
            new_state: "DUALOPEND_AWAITING_LOCKIN",
            cause: "user",
            message: "Sigs exchanged, waiting for lock-in"
          },
          {
            timestamp: "2024-03-22T21:06:33.785Z",
            old_state: "DUALOPEND_AWAITING_LOCKIN",
            new_state: "CHANNELD_NORMAL",
            cause: "user",
            message: "Lockin complete"
          },
          {
            timestamp: "2024-03-22T21:23:16.665Z",
            old_state: "CHANNELD_NORMAL",
            new_state: "CHANNELD_SHUTTING_DOWN",
            cause: "user",
            message: "User or plugin invoked close command"
          },
          {
            timestamp: "2024-03-22T21:23:16.696Z",
            old_state: "CHANNELD_SHUTTING_DOWN",
            new_state: "CLOSINGD_SIGEXCHANGE",
            cause: "user",
            message: "Start closingd"
          },
          {
            timestamp: "2024-03-22T21:23:16.707Z",
            old_state: "CLOSINGD_SIGEXCHANGE",
            new_state: "CLOSINGD_COMPLETE",
            cause: "user",
            message: "Closing complete"
          }
        ],
        status: [
          "CHANNELD_NORMAL:Reconnected, and reestablished.",
          "CLOSINGD_SIGEXCHANGE:We agreed on a closing fee of 162 satoshi for tx:f04794e0bd5542139a5cf19c99ad294e97edb49f180d06ec5d634f2df63fb898"
        ],
        in_payments_offered: 0,
        in_offered_msat: 0,
        in_payments_fulfilled: 0,
        in_fulfilled_msat: 0,
        out_payments_offered: 0,
        out_offered_msat: 0,
        out_payments_fulfilled: 0,
        out_fulfilled_msat: 0,
        htlcs: [],
        node_alias: "CLNReg2",
        to_us_sat: 2500000,
        total_sat: 2500000,
        to_them_sat: 0,
        current_state: "PENDING"
      }
    ],
    inactiveChannels: [
      {
        peer_id: "03a183403bbcc01576516a5c237fac0f850f4662c0e3b06060b9dc60bdcaf1c43d",
        peer_connected: false,
        channel_type: {
          bits: [
            12,
            22
          ],
          names: [
            "static_remotekey/even",
            "anchors_zero_fee_htlc_tx/even"
          ]
        },
        ignore_fee_limits: true,
        updates: {
          local: {
            htlc_minimum_msat: 1,
            htlc_maximum_msat: 3366000000,
            cltv_expiry_delta: 6,
            fee_base_msat: 1,
            fee_proportional_millionths: 10
          },
          remote: {
            htlc_minimum_msat: 1000,
            htlc_maximum_msat: 3400000000,
            cltv_expiry_delta: 80,
            fee_base_msat: 1000,
            fee_proportional_millionths: 1
          }
        },
        last_stable_connection: 1711141812,
        state: "CHANNELD_NORMAL",
        scratch_txid: "4b43aa4be286b835805efb782e6b8e455e01c51dbd48c547d32d3164faae734b",
        last_tx_fee_msat: 1410000,
        lost_state: false,
        feerate: {
          perkw: 1255,
          perkb: 5020
        },
        short_channel_id: "589x1x0",
        direction: 1,
        channel_id: "42e9312bd05ab7c7f7c8b31f826f5978bfc1267779fbed65e019ed087b6e669d",
        funding_txid: "9d666e7b08ed19e065edfb797726c1bf78596f821fb3c8f7c7b75ad02b31e942",
        funding_outnum: 0,
        close_to_addr: "bcrt1pv48vz7h83a34ltsxfavjxvl7mz60dmgrfxv4ea7jr9nacjh8h66qr4pzyy",
        close_to: "5120654ec17ae78f635fae064f592333fed8b4f6ed0349995cf7d21967dc4ae7beb4",
        private: false,
        opener: "local",
        alias: {
          local: "7251588x3960060x41143"
        },
        features: [
          "option_static_remotekey",
          "option_anchors_zero_fee_htlc_tx"
        ],
        funding: {
          local_funds_msat: 3400000000,
          remote_funds_msat: 0,
          pushed_msat: 0
        },
        to_us_msat: 3398000000,
        min_to_us_msat: 3398000000,
        max_to_us_msat: 3400000000,
        total_msat: 3400000000,
        fee_base_msat: 1,
        fee_proportional_millionths: 10,
        dust_limit_msat: 546000,
        max_total_htlc_in_msat: 18446744073709552000,
        their_reserve_msat: 34000000,
        our_reserve_msat: 34000000,
        spendable_msat: 3359656000,
        receivable_msat: 0,
        minimum_htlc_in_msat: 0,
        minimum_htlc_out_msat: 1,
        maximum_htlc_out_msat: 3366000000,
        their_to_self_delay: 6,
        our_to_self_delay: 408,
        max_accepted_htlcs: 483,
        state_changes: [
          {
            timestamp: "2024-03-22T21:09:32.499Z",
            old_state: "CHANNELD_AWAITING_LOCKIN",
            new_state: "CHANNELD_NORMAL",
            cause: "user",
            message: "Lockin complete"
          }
        ],
        status: [
          "CHANNELD_NORMAL:Will attempt reconnect in 8 seconds"
        ],
        in_payments_offered: 0,
        in_offered_msat: 0,
        in_payments_fulfilled: 0,
        in_fulfilled_msat: 0,
        out_payments_offered: 1,
        out_offered_msat: 2000000,
        out_payments_fulfilled: 1,
        out_fulfilled_msat: 2000000,
        htlcs: [],
        node_alias: "LNDReg2",
        to_us_sat: 3398000,
        total_sat: 3400000,
        to_them_sat: 2000,
        current_state: "INACTIVE"
      }
    ],
    isLoading: false
  },
  listInvoices: {
    invoices: [
      {
        label: "f6f68cefe4ab28548fc746a13b671eceff11ce47339dfa6cb32a831bf14d08ff-02cb4bdd37056558257e4fa8599082c6403509c8592e1a9d711311cecc89a4b07e-0",
        bolt12: "lni1qqg20jpqx7tk3z6ljpmugunj7espyq3qqc3xu3s3rg94nj40zfsy866mhu5vxne6tcej5878k2mneuvgjy8sspz8s6xqqzs3fejhwueqwd6kyumrwf5hqarfdahpvggr5wym8ghh4fhe7nxvr8et673wh2p4je5eap4hzh924g28lsmlx9z9qgqxyfhyvyg6pdvu4tcjvpp7kkal9rp57wj7xv4pl3ajku70rzy3pavzzqktf0wnwpt9tqjhunagtxgg93jqx5yuskfwr2whzyc3emxgnf9s06sfsqar3xe69aa2d705enqe727h5t46sdvkdx0gddc4e242z3luxle3gsp4ndg8tz0fre32pmsr5tdt0edvfymfgeys5lm03mh9yfr8nmscknqpq0t3rcn4kwdx0t8we7yxrq9dgtgk8dfl6k7lk4fn9n9m8p27yfujkqpj2dzr3dv2gv3vyea94t0033wmgfxdtqssatx3dn8fwgwdu88f36fjsmp2jkv98dn3pycfn24fvq7vwxh95gwqqqqqqqqqqqqqqq9qqqqqqqqqqqqqr5jt9hav2gqqqqqq5szxtl04wz5zqdlupvpv06mrz2x59tjgw9rhzck83chnwt59zmzzawxdjnksf0a34gzy0p5vqzczzqar3xe69aa2d705enqe727h5t46sdvkdx0gddc4e242z3luxle3gncyqfqjx5xmr9z0008smhn9wxzakmph30vgfuthrv6x4yakars20x9d7qwc6x5ukcfp050ma8hct9nkknxattp7mnjgwvrydegjuj6ag8ks",
        payment_hash: "37fc0b02c7eb63128d42ae4871477162c78e2f372e8516c42eb8cd94ed04bfb1",
        amount_msat: 1200000000,
        status: "paid",
        pay_index: 2,
        amount_received_msat: 1200000000,
        paid_at: 1711142277,
        payment_preimage: "6174acc80f0c12e3b8c36ee653c5be17a6182ff4ba6f7e0947d71903487d307d",
        description: "News subscription",
        expires_at: 1711149456,
        local_offer_id: "f6f68cefe4ab28548fc746a13b671eceff11ce47339dfa6cb32a831bf14d08ff",
        created_index: 2,
        updated_index: 2
      },
      {
        label: "invoicelblp2sh639hme81711141884955",
        bolt11: "lnbcrt80u1pjlmulusp54zr04y9qmzn5k40j57jmscsdswx4q2r84uvrmtzc5z58qnnuvskqpp5znn23w0l7f5y9082rflxvuv4qcq2q9wv6d587s8ar507lzuglfysdq2gdhkven9v5xqyjw5qcqp2rzjqg7jss6uuj6f7p5vje92e09km5g5x9a8pup7tfe3afedyh03ele4kqqzfyqqqqgqqqqqqqlgqqqqqqgq2q9qx3qysgqhgql4cvhejwtp4mrj64r86v9jj7amvkwcyr6z04z3yzardya6puy3df2q0z98mpd08hy47pz3tc23cnuqvh6ad9tf3vxmaxk9nxm32gpksda99",
        payment_hash: "14e6a8b9fff26842bcea1a7e6671950600a015ccd3687f40fd1d1fef8b88fa49",
        amount_msat: 8000000,
        status: "paid",
        pay_index: 1,
        amount_received_msat: 8000000,
        paid_at: 1711141983,
        payment_preimage: "ef6d57c86f874109b55b0598d5859cd98732d6ebb03fdef49e55b0842e8b7954",
        description: "Coffee",
        expires_at: 1711746684,
        created_index: 1,
        updated_index: 1
      }
    ],
    isLoading: false,
    error: null
  },
  listPayments: {
    payments: [
      {
        created_index: 2,
        id: 2,
        payment_hash: "cb4446c1d15f5f40efc34bb3e75152f081edbcdc2349856f87a09aa55507752c",
        groupid: 0,
        updated_index: 2,
        destination: "0348e58210bbc128b1cc3cc1a520a654aaa01e5fe65c65341e21b61a1f09da94d5",
        amount_msat: 50000000,
        amount_sent_msat: 50000000,
        created_at: 1711142515,
        completed_at: 1711142516,
        status: "complete",
        payment_preimage: "ddd198fac0fd3a4f54f371da9693aef0b6af9c6e34a91838f36a21ddd4c76913",
        is_group: false,
        is_expanded: false,
        total_parts: 1
      },
      {
        created_index: 1,
        id: 1,
        payment_hash: "3e250dc7e350f8430709cb0594acfcf00d5a2d1bba935d7c1aabad783a082a3e",
        groupid: 1,
        updated_index: 1,
        destination: "03a183403bbcc01576516a5c237fac0f850f4662c0e3b06060b9dc60bdcaf1c43d",
        amount_msat: 2000000,
        amount_sent_msat: 2000000,
        created_at: 1711142369,
        completed_at: 1711142370,
        status: "complete",
        payment_preimage: "cb49eac5012d71c73636f75bf0349755abbbc066c87a8e182afd11f8dd6341b9",
        bolt11: "lnbcrt1pjlmaw2pp58cjsm3lr2ruyxpcfevzeft8u7qx45tgmh2f46lq64wkhswsg9glqdqqcqzzsxqyz5vqsp5aqvc3kpt7dfen6cp8mxjdwa0690u5fq8lnr9dwj0urgzudjy96ys9qyyssq5d3t9ffap7mlyee0pfawjcft0358cg3t580t4ra492w54a0u85c9zktgk7es5sw9yj9tle690f7q8lavdnlglg63603p0yfavhta26qqkl8mnd",
        is_group: false,
        is_expanded: false,
        total_parts: 1
      }
    ],
    isLoading: false,
    error: null
  },
  listOffers: {
    offers: [
      {
        offer_id: "f6f68cefe4ab28548fc746a13b671eceff11ce47339dfa6cb32a831bf14d08ff",
        active: true,
        single_use: false,
        bolt12: "lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrcgq3rcdrqqpgg5uethwvs8xatzwd3hy6tsw35k7mskyyp68zdn5tm65mulfnxpnu4a0ght4q6ev6v7s6m3tj4259rlcdlnz3q",
        used: true
      }
    ],
    isLoading: false,
    error: null
  },
  listLightningTransactions: {
    isLoading: false,
    error: null,
    clnTransactions: [
      {
        type: "PAYMENT",
        payment_hash: "cb4446c1d15f5f40efc34bb3e75152f081edbcdc2349856f87a09aa55507752c",
        status: "complete",
        amount_msat: 50000000,
        payment_preimage: "ddd198fac0fd3a4f54f371da9693aef0b6af9c6e34a91838f36a21ddd4c76913",
        created_at: 1711142515,
        amount_sent_msat: 50000000,
        destination: "0348e58210bbc128b1cc3cc1a520a654aaa01e5fe65c65341e21b61a1f09da94d5",
        expires_at: null,
        paid_at: null
      },
      {
        type: "PAYMENT",
        payment_hash: "3e250dc7e350f8430709cb0594acfcf00d5a2d1bba935d7c1aabad783a082a3e",
        status: "complete",
        amount_msat: 2000000,
        bolt11: "lnbcrt1pjlmaw2pp58cjsm3lr2ruyxpcfevzeft8u7qx45tgmh2f46lq64wkhswsg9glqdqqcqzzsxqyz5vqsp5aqvc3kpt7dfen6cp8mxjdwa0690u5fq8lnr9dwj0urgzudjy96ys9qyyssq5d3t9ffap7mlyee0pfawjcft0358cg3t580t4ra492w54a0u85c9zktgk7es5sw9yj9tle690f7q8lavdnlglg63603p0yfavhta26qqkl8mnd",
        payment_preimage: "cb49eac5012d71c73636f75bf0349755abbbc066c87a8e182afd11f8dd6341b9",
        created_at: 1711142369,
        amount_sent_msat: 2000000,
        destination: "03a183403bbcc01576516a5c237fac0f850f4662c0e3b06060b9dc60bdcaf1c43d",
        expires_at: null,
        paid_at: null
      },
      {
        type: "INVOICE",
        payment_hash: "37fc0b02c7eb63128d42ae4871477162c78e2f372e8516c42eb8cd94ed04bfb1",
        status: "paid",
        amount_msat: 1200000000,
        label: "f6f68cefe4ab28548fc746a13b671eceff11ce47339dfa6cb32a831bf14d08ff-02cb4bdd37056558257e4fa8599082c6403509c8592e1a9d711311cecc89a4b07e-0",
        description: "News subscription",
        bolt12: "lni1qqg20jpqx7tk3z6ljpmugunj7espyq3qqc3xu3s3rg94nj40zfsy866mhu5vxne6tcej5878k2mneuvgjy8sspz8s6xqqzs3fejhwueqwd6kyumrwf5hqarfdahpvggr5wym8ghh4fhe7nxvr8et673wh2p4je5eap4hzh924g28lsmlx9z9qgqxyfhyvyg6pdvu4tcjvpp7kkal9rp57wj7xv4pl3ajku70rzy3pavzzqktf0wnwpt9tqjhunagtxgg93jqx5yuskfwr2whzyc3emxgnf9s06sfsqar3xe69aa2d705enqe727h5t46sdvkdx0gddc4e242z3luxle3gsp4ndg8tz0fre32pmsr5tdt0edvfymfgeys5lm03mh9yfr8nmscknqpq0t3rcn4kwdx0t8we7yxrq9dgtgk8dfl6k7lk4fn9n9m8p27yfujkqpj2dzr3dv2gv3vyea94t0033wmgfxdtqssatx3dn8fwgwdu88f36fjsmp2jkv98dn3pycfn24fvq7vwxh95gwqqqqqqqqqqqqqqq9qqqqqqqqqqqqqr5jt9hav2gqqqqqq5szxtl04wz5zqdlupvpv06mrz2x59tjgw9rhzck83chnwt59zmzzawxdjnksf0a34gzy0p5vqzczzqar3xe69aa2d705enqe727h5t46sdvkdx0gddc4e242z3luxle3gncyqfqjx5xmr9z0008smhn9wxzakmph30vgfuthrv6x4yakars20x9d7qwc6x5ukcfp050ma8hct9nkknxattp7mnjgwvrydegjuj6ag8ks",
        payment_preimage: "6174acc80f0c12e3b8c36ee653c5be17a6182ff4ba6f7e0947d71903487d307d",
        created_at: null,
        amount_sent_msat: null,
        destination: null,
        expires_at: 1711149456,
        amount_received_msat: 1200000000,
        paid_at: 1711142277
      },
      {
        type: "INVOICE",
        payment_hash: "14e6a8b9fff26842bcea1a7e6671950600a015ccd3687f40fd1d1fef8b88fa49",
        status: "paid",
        amount_msat: 8000000,
        label: "invoicelblp2sh639hme81711141884955",
        bolt11: "lnbcrt80u1pjlmulusp54zr04y9qmzn5k40j57jmscsdswx4q2r84uvrmtzc5z58qnnuvskqpp5znn23w0l7f5y9082rflxvuv4qcq2q9wv6d587s8ar507lzuglfysdq2gdhkven9v5xqyjw5qcqp2rzjqg7jss6uuj6f7p5vje92e09km5g5x9a8pup7tfe3afedyh03ele4kqqzfyqqqqgqqqqqqqlgqqqqqqgq2q9qx3qysgqhgql4cvhejwtp4mrj64r86v9jj7amvkwcyr6z04z3yzardya6puy3df2q0z98mpd08hy47pz3tc23cnuqvh6ad9tf3vxmaxk9nxm32gpksda99",
        description: "Coffee",
        payment_preimage: "ef6d57c86f874109b55b0598d5859cd98732d6ebb03fdef49e55b0842e8b7954",
        created_at: null,
        amount_sent_msat: null,
        destination: null,
        expires_at: 1711746684,
        amount_received_msat: 8000000,
        paid_at: 1711141983
      }
    ]
  },
  listBitcoinTransactions: {
    isLoading: false,
    error: null,
    btcTransactions: [
      {
        account: "wallet",
        type: "chain",
        tag: "withdrawal",
        credit_msat: 0,
        debit_msat: 3400166000,
        currency: "bcrt",
        outpoint: "bbecc5e19be2929080678eecd064cb035cc9f5a835f45fc86a8d87b0967c7349:1",
        txid: "9d666e7b08ed19e065edfb797726c1bf78596f821fb3c8f7c7b75ad02b31e942",
        timestamp: 1711141772,
        blockheight: 589
      },
      {
        account: "wallet",
        type: "chain",
        tag: "withdrawal",
        credit_msat: 0,
        debit_msat: 2500166000,
        currency: "bcrt",
        outpoint: "c2fa5f179e62a0a615c9e3010d6bbcd4366f691d75ba481e460f74f4751d5389:0",
        txid: "bbecc5e19be2929080678eecd064cb035cc9f5a835f45fc86a8d87b0967c7349",
        timestamp: 1711141592,
        blockheight: 585
      },
      {
        account: "wallet",
        type: "chain",
        tag: "deposit",
        credit_msat: 80000000000,
        debit_msat: 0,
        currency: "bcrt",
        outpoint: "c2fa5f179e62a0a615c9e3010d6bbcd4366f691d75ba481e460f74f4751d5389:0",
        timestamp: 1711141292,
        blockheight: 584
      }
    ]
  },
  walletBalances: {
    isLoading: false,
    clnLocalBalance: 1158000,
    clnRemoteBalance: 60342000,
    clnPendingBalance: 0,
    clnInactiveBalance: 3398000,
    btcSpendableBalance: 74099668,
    btcReservedBalance: 2499838,
    error: null
  }
};
