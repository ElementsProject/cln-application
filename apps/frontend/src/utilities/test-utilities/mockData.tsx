import { ApplicationModes, TimeGranularity, Units } from '../constants';
import { Offer, LightningTransaction, Invoice, BkprTransaction, Rune } from '../../types/cln.type';
import { AccountEvents, BkprSummaryInfo, SatsFlow, VolumeData } from '../../types/bookkeeper.type';
import { PeerChannel } from '../../types/root.type';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

export const mockNewAddr = { bech32: 'bcrt1pns2fct20yudt54v8ta5jxqq909lwelu82gpwp2ym59ffelzcp7rqg0w646' };

export const mockDecodedInvoice = {
  type: "bolt11 invoice",
  currency: "bcrt",
  created_at: 1738000000,
  expiry: 604800,
  payee: "nodeid020202020202020202020202020202020202020202020202020202020202",
  amount_msat: 200000,
  description: "l22 description",
  min_final_cltv_expiry: 5,
  payment_secret: "paymentsecretinvl00220002200022000220002200022000220002200022000",
  features: "02024100",
  routes: [
    [
      {
        pubkey: "nodeid030303030303030303030303030303030303030303030303030303030303",
        short_channel_id: "111x1x1",
        fee_base_msat: 1,
        fee_proportional_millionths: 10,
        cltv_expiry_delta: 6
      }
    ]
  ],
  payment_hash: "paymenthashinvl0220022002200220022002200220022002200220022002200",
  signature: "dcde30c4bb50bed221009d010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101",
  valid: true
};

export const mockSendPayment = {
  message: "Monitor status with listpays or waitsendpay",
  created_index: 2,
  id: 2,
  payment_hash: "paymenthashinvl0310031003100310031003100310031003100310031003100",
  groupid: 1,
  destination: "nodeid030303030303030303030303030303030303030303030303030303030303",
  amount_msat: 10000,
  amount_sent_msat: 10001,
  created_at: 1738000000,
  status: "pending"
};

export const mockFetchInvoice = {
  invoice: "lni1qqg0qe02020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202",
  changes: {}
};

export const mockInvoiceRune: Rune = {
  rune: 'aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==',
  unique_id: '1',
};

export const mockInvoice: Invoice = {
  label: 'Mvtkt',
  bolt11:
    'lnbcrt12500n1pjlm76nsp58eas344ssezy53zyy0rly6945amyzngk2e2j207mjesywpsnj0cqpp5757mjylkl2tjmekw0ekgupke8k46cumq8l49f3eq334hjfjjq2qsdq5f4hhv6t9yp2xjcmtv46qxqyjw5qcqp2rzjqdywtqssh0qj3vwv8nq62g9x2j42q8jluewx2dq7yxmp58cfm22d2qqz2yqqqqgqqqqqqqqpqqqqqzsqqc9qx3qysgqp68f5g7ncjsg2e3c9xhhawxy28ue672ay70rurx54f2zph77srpnz808mgtv98eczaf7s7ggdze8p8ud4n4slwxlmxevh8vu0e95pfcql3e2xk',
  payment_hash: 'f53db913f6fa972de6ce7e6c8e06d93dabac73603fea54c7208c6b7926520281',
  amount_msat: 1250000,
  status: 'unpaid',
  description: 'Movie Ticket',
  expires_at: 1711748563,
  created_index: 3,
};

export const mockBkprSummaryData: BkprSummaryInfo = { isLoading: false };
export const mockAccountEventsData: AccountEvents = { isLoading: false, events: [], periods: [], timeGranularity: TimeGranularity.DAILY, startTimestamp: 0, endTimestamp: 0 };
export const mockSatsFlowData: SatsFlow = { isLoading: false, satsFlowEvents: [], periods: [], timeGranularity: TimeGranularity.DAILY, startTimestamp: 0, endTimestamp: 0 };
export const mockVolumeData: VolumeData = { isLoading: false, forwards: [] };

export const mockOffer: Offer = {
  offer_id: 'f6f68cefe4ab28548fc746a13b671eceff11ce47339dfa6cb32a831bf14d08ff',
  active: true,
  single_use: false,
  bolt12:
    'lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrcgq3rcdrqqpgg5uethwvs8xatzwd3hy6tsw35k7mskyyp68zdn5tm65mulfnxpnu4a0ght4q6ev6v7s6m3tj4259rlcdlnz3q',
  used: true,
  valid: true,
};

export const mockClnTransaction: LightningTransaction = {
  type: 'INVOICE',
  label: 'invoicelblreh70ik94m1711145685831',
  bolt11:
    'lnbcrt500u1pjluqk4sp5z4zw6lkseaj2fefddsefykvhg4wzrwyeaqn6grs5ksun5r8rzccqpp57s0xrg45sxpw57pfdwm2lt69mkthmfczahwylhrfytlpv9mflmqsdq0gfex2cttveshxaqxqyjw5qcqp2rzjqdywtqssh0qj3vwv8nq62g9x2j42q8jluewx2dq7yxmp58cfm22d2qqz2yqqqqgqqqqqqqqpqqqqqzsqqc9qx3qysgqa0zd6aserdx5nxvtjkeye7l3ft7dq6t2fdz2afnu3drafcg37qn5yyy25t7s73ck3lqw77srscqznluz8mu22aqmjew9hd7qdmkxc7cps7hzsc',
  payment_hash: 'f41e61a2b48182ea78296bb6afaf45dd977da702eddc4fdc6922fe161769fec1',
  amount_msat: 50000000,
  status: 'unpaid',
  description: 'Breakfast',
  expires_at: Date.now() + 3600000, // 1hr from now,
  created_index: 4,
};

export const mockBTCTransaction: BkprTransaction = {
  account: 'wallet',
  type: 'chain',
  tag: 'deposit',
  credit_msat: 37379100000,
  debit_msat: 0,
  currency: 'bcrt',
  outpoint: '05e4a3f71410f73042a7d0f8d1cbe1c0e902cb4ea44ed46609582e005dd38690:1',
  timestamp: 1711142164,
  blockheight: 593,
};

export const mockSelectedChannel: PeerChannel = {
  peer_id: '024244c0c7d23d1b411578a1a2376fb4cebf5526449e1a83241fd4a12801034c5b',
  peer_connected: false,
  current_state: 'ACTIVE',
  node_alias: 'CLNReg2',
  channel_type: {
    bits: [12],
    names: ['static_remotekey/even'],
  },
  ignore_fee_limits: true,
  updates: {
    local: {
      htlc_minimum_msat: 0,
      htlc_maximum_msat: 1485000000,
      cltv_expiry_delta: 6,
      fee_base_msat: 1,
      fee_proportional_millionths: 10,
    },
  },
  state: 'CHANNELD_NORMAL',
  scratch_txid: '4fe207694ae089014b9008f2463dbf438553e26a2ad94ba2e455357c84692400',
  last_tx_fee_msat: 183000,
  lost_state: false,
  feerate: {
    perkw: 253,
    perkb: 1012,
  },
  short_channel_id: '185x1x1',
  direction: 1,
  channel_id: 'e84435b002a67feedbe958aeb01710cb0d832fd20281e63a2e9943c5c4c4d7e1',
  funding_txid: 'caef9fceb32991981ca39501d8cd807c7f4d4732de46c1381aac5b3027bd75ee',
  funding_outnum: 1,
  close_to_addr: 'bcrt1pns2fct20yudt54v8ta5jxqq909lwelu82gpwp2ym59ffelzcp7rqg0w646',
  close_to: '51209c149c2d4f271aba55875f69230005797eecff875202e0a89ba1529cfc580f86',
  private: false,
  opener: 'remote',
  alias: {
    local: '13947255x7038877x61250',
  },
  features: ['option_static_remotekey'],
  funding: {
    local_funds_msat: 0,
    remote_funds_msat: 1500000000,
    pushed_msat: 0,
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
      timestamp: '2023-09-14T17:53:38.684Z',
      old_state: 'DUALOPEND_OPEN_COMMITTED',
      new_state: 'DUALOPEND_AWAITING_LOCKIN',
      cause: 'remote',
      message: 'Sigs exchanged, waiting for lock-in',
    },
    {
      timestamp: '2023-09-14T17:56:31.918Z',
      old_state: 'DUALOPEND_AWAITING_LOCKIN',
      new_state: 'CHANNELD_NORMAL',
      cause: 'remote',
      message: 'Lockin complete',
    },
  ],
  status: ['CHANNELD_NORMAL:Will attempt reconnect in 300 seconds'],
  in_payments_offered: 0,
  in_offered_msat: 0,
  in_payments_fulfilled: 0,
  in_fulfilled_msat: 0,
  out_payments_offered: 0,
  out_offered_msat: 0,
  out_payments_fulfilled: 0,
  out_fulfilled_msat: 0,
  htlcs: [],
};

export const mockAuthStatus = {
  isAuthenticated: true,
  isValidPassword: true,
  isLoading: false,
};

export const mockShowModals = {
  nodeInfoModal: false,
  connectWalletModal: false,
  loginModal: false,
  logoutModal: false,
  setPasswordModal: false,
  sqlTerminalModal: false,
};

export const mockShowToast = {
  show: false,
  message: ""
};

export const mockConnectWallet = {
  isLoading: false,
  SINGLE_SIGN_ON: false,
  LOCAL_HOST: "http://user.local",
  DEVICE_DOMAIN_NAME: "user.local",
  TOR_SERVICE: "oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion",
  BITCOIN_NODE_IP: "localhost",
  BITCOIN_NETWORK: "regtest",
  APP_CONFIG_FILE: "/home/data/app/config.json",
  APP_LOG_FILE: "/home/data/app/application-cln.log",
  APP_MODE: "testing",
  APP_CONNECT: "REST",
  APP_PROTOCOL: "http",
  APP_IP: "localhost",
  APP_PORT: "2103",
  LIGHTNING_IP: "localhost",
  LIGHTNING_PATH: "/home/network",
  HIDDEN_SERVICE_URL: "http://oqaerkq7qd.onion",
  LIGHTNING_NODE_TYPE: "CLN",
  COMMANDO_CONFIG: "/home/network/.commando",
  LIGHTNING_WS_PORT: 5001,
  LIGHTNING_REST_PROTOCOL: "https",
  LIGHTNING_REST_PORT: 3001,
  LIGHTNING_CERTS_PATH: "/home/network/regtest/",
  LIGHTNING_GRPC_PROTOCOL: "https",
  LIGHTNING_GRPC_PORT: 2106,
  APP_VERSION: "0.0.7",
  NODE_PUBKEY: "03ccf00822d92442b7da24e2ac94e9f9b43a2ff6bd261ba9c42749dc1f857fe976",
  COMMANDO_RUNE: "mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j",
  CLIENT_KEY: "ClientKey",
  CLIENT_CERT: "ClientCert",
  CA_CERT: "CACert"
};

export const mockUIConfig = {
  fiatUnit: "CAD",
  appMode: ApplicationModes.DARK,
  unit: Units.SATS
};

export const mockServerConfig = {
  appConnect: "REST",
  appPort: "2103",
  appProtocol: "http",
  appVersion: "0.0.7",
  lightningNodeType: "CLN",
  singleSignOn: false
};

export const mockAppConfig = {
  isLoading: false,
  uiConfig: mockUIConfig,
  serverConfig: mockServerConfig
};

export const mockFiatConfig = {
  isLoading: false,
  venue: "BULLBITCOIN",
  rate: 134770.88948787062,
  symbol: faDollarSign
};

export const mockWalletBalances = {
  isLoading: false,
  clnLocalBalance: 74888500,
  clnRemoteBalance: 32911500,
  clnPendingBalance: 0,
  clnInactiveBalance: 0,
  btcSpendableBalance: 74100000,
  btcReservedBalance: 0,
};

export const mockNodeInfo = {
  address: [
    {
      address: "127.0.0.1",
      port: 19743,
      type: "ipv4"
    }
  ],
  alias: "REDNET-v25.02-31-g08210da",
  binding: [
    {
      address: "127.0.0.1",
      port: 7373,
      type: "ipv4"
    }
  ],
  blockheight: 169,
  color: "03ccf0",
  fees_collected_msat: 154,
  id: "03ccf00822d92442b7da24e2ac94e9f9b43a2ff6bd261ba9c42749dc1f857fe976",
  "lightning-dir": "/home/network/regtest",
  network: "regtest",
  num_active_channels: 3,
  num_inactive_channels: 0,
  num_peers: 2,
  num_pending_channels: 0,
  our_features: {
    channel: "",
    init: "08a0880a8a59a1",
    invoice: "02000002024100",
    node: "88a0880a8a59a1"
  },
  version: "v25.02-31-g08210da",
  warning_bitcoind_sync: "Bitcoind is not up-to-date with network.",
  isLoading: false
};

export const mockListFunds = {
  channels: [
    {
      amount_msat: 21700000000,
      channel_id: "ed3df2aed5a51b5ed9fc1fa534cb000282fa3dfcfba93628da1907387b0e6303",
      connected: true,
      funding_output: 0,
      funding_txid: "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded",
      our_amount_msat: 21687599955,
      peer_id: "03fbdd0a9ddba420be1ec9146802c9b95f6233b1a36c5e2c223884fde157be7ff5",
      short_channel_id: "116x1x0",
      state: "CHANNELD_NORMAL"
    },
    {
      amount_msat: 53200000000,
      channel_id: "a92862efdedca262243475c0b7d0210f7925bccd625892b73b9b30618fa1e6fc",
      connected: true,
      funding_output: 0,
      funding_txid: "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9",
      our_amount_msat: 53175900000,
      peer_id: "03fbdd0a9ddba420be1ec9146802c9b95f6233b1a36c5e2c223884fde157be7ff5",
      short_channel_id: "146x1x0",
      state: "CHANNELD_NORMAL"
    },
    {
      amount_msat: 32900000000,
      channel_id: "af9ce84737dde7bd2f58ec5c142e9a1f1368e3b67fe1d7feff63f50788c60b30",
      connected: true,
      funding_output: 0,
      funding_txid: "300bc68807f563fffed7e17fb6e368131f9a2e145cec582fbde7dd3747e89caf",
      our_amount_msat: 25000154,
      peer_id: "020371140f2ec44c4d6cea50c018310e9409c97c410c56fbc120de3e85b0358d02",
      short_channel_id: "110x1x0",
      state: "CHANNELD_NORMAL"
    }
  ],
  outputs: [
    {
      address: "bcrt1pzqq8ue5araly5897sedzx6xs7wa0ufk9z6fgkm03nnx9p3s2nmgsja0n5x",
      amount_msat: 25099668000,
      blockheight: 146,
      output: 1,
      reserved: false,
      scriptpubkey: "512010007e669d1f7e4a1cbe865a2368d0f3bafe26c516928b6df19ccc50c60a9ed1",
      status: "confirmed",
      txid: "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9"
    }
  ],
  isLoading: false
};

export const mockListPeers = {
  peers: [
    {
      connected: true,
      features: "08a0880a8a59a1",
      id: "03fbdd0a9ddba420be1ec9146802c9b95f6233b1a36c5e2c223884fde157be7ff5",
      netaddr: ["127.0.0.1:7171"],
      num_channels: 2
    },
    {
      connected: true,
      features: "08a0880a8a59a1",
      id: "020371140f2ec44c4d6cea50c018310e9409c97c410c56fbc120de3e85b0358d02",
      netaddr: ["127.0.0.1:58232"],
      num_channels: 1
    }
  ],
  isLoading: false
};

// Channel type definition
export const mockChannelType = {
  bits: [12, 22],
  names: ["static_remotekey/even", "anchors/even"]
};

// Channel updates definition
export const mockChannelUpdates = {
  local: {
    cltv_expiry_delta: 6,
    fee_base_msat: 1,
    fee_proportional_millionths: 10,
    htlc_maximum_msat: 52668000000,
    htlc_minimum_msat: 0
  },
  remote: {
    cltv_expiry_delta: 6,
    fee_base_msat: 1,
    fee_proportional_millionths: 10,
    htlc_maximum_msat: 52668000000,
    htlc_minimum_msat: 0
  }
};

// Channel funding information
export const mockChannelFunding = {
  local_funds_msat: 53200000000,
  pushed_msat: 0,
  remote_funds_msat: 0
};

// State changes
export const mockStateChanges = [
  {
    cause: "user",
    message: "Lockin complete",
    new_state: "CHANNELD_NORMAL",
    old_state: "CHANNELD_AWAITING_LOCKIN",
    timestamp: "2025-04-21T22:21:17.460Z"
  }
];

// Channel status
export const mockChannelStatus = [
  "CHANNELD_NORMAL:Reconnected, and reestablished.",
  "CHANNELD_NORMAL:Channel ready for use."
];

// Active channel 1
export const mockActiveChannel1 = {
  alias: {
    local: "9749859x10595065x16239",
    remote: "16000500x15461963x54799"
  },
  channel_id: "a92862efdedca262243475c0b7d0210f7925bccd625892b73b9b30618fa1e6fc",
  channel_type: mockChannelType,
  close_to: "51206bda820b0a1ce59177e3b853a121e8d213b9ca50c125d72950292e2f86c24b15",
  close_to_addr: "bcrt1pd0dgyzc2rnjezalrhpf6zg0g6gfmnjjscyjaw22s9yhzlpkzfv2szp3p3g",
  direction: 0,
  dust_limit_msat: 546000,
  features: ["option_static_remotekey", "option_anchors"],
  fee_base_msat: 1,
  fee_proportional_millionths: 10,
  feerate: {
    perkb: 5020,
    perkw: 1255
  },
  funding: mockChannelFunding,
  funding_outnum: 0,
  funding_txid: "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9",
  htlcs: [],
  ignore_fee_limits: true,
  in_fulfilled_msat: 0,
  in_offered_msat: 0,
  in_payments_fulfilled: 0,
  in_payments_offered: 0,
  last_stable_connection: 1745615242,
  last_tx_fee_msat: 1410000,
  lost_state: false,
  max_accepted_htlcs: 483,
  max_to_us_msat: 53200000000,
  maximum_htlc_out_msat: 52668000000,
  min_to_us_msat: 53175900000,
  minimum_htlc_in_msat: 0,
  minimum_htlc_out_msat: 0,
  opener: "local",
  our_max_htlc_value_in_flight_msat: 18446744073709552000,
  our_reserve_msat: 532000000,
  our_to_self_delay: 6,
  out_fulfilled_msat: 24100000,
  out_offered_msat: 24100000,
  out_payments_fulfilled: 3,
  out_payments_offered: 3,
  owner: "channeld",
  peer_connected: true,
  peer_id: "03fbdd0a9ddba420be1ec9146802c9b95f6233b1a36c5e2c223884fde157be7ff5",
  private: false,
  receivable_msat: 0,
  reestablished: true,
  scratch_txid: "b229da2a237f7cb23c001be5aef8851b66924a54c1bf5af2a2318704d3e2f82b",
  short_channel_id: "146x1x0",
  spendable_msat: 52639594000,
  state: "CHANNELD_NORMAL",
  state_changes: mockStateChanges,
  status: mockChannelStatus,
  their_max_htlc_value_in_flight_msat: 18446744073709552000,
  their_reserve_msat: 532000000,
  their_to_self_delay: 6,
  to_us_msat: 53175900000,
  total_msat: 53200000000,
  updates: mockChannelUpdates,
  node_alias: "SLICKERMAESTRO-25.02-31-g08210da",
  to_us_sat: 53175900,
  total_sat: 53200000,
  to_them_sat: 24100,
  current_state: "ACTIVE"
};

// Active channel 2
export const mockActiveChannel2 = {
  alias: {
    local: "1284028x9198573x16431",
    remote: "6689196x4726342x50397"
  },
  channel_id: "af9ce84737dde7bd2f58ec5c142e9a1f1368e3b67fe1d7feff63f50788c60b30",
  channel_type: mockChannelType,
  close_to: "51202ea1c721ff1d85a430414a4f44133791b867b951ce76101148639af566d6281f",
  close_to_addr: "bcrt1p96suwg0lrkz6gvzpff85gyehjxux0w23eempqy2gvwd02ekk9q0suejuxv",
  direction: 1,
  dust_limit_msat: 546000,
  features: ["option_static_remotekey", "option_anchors"],
  fee_base_msat: 1,
  fee_proportional_millionths: 10,
  feerate: {
    perkb: 5020,
    perkw: 1255
  },
  funding: {
    local_funds_msat: 0,
    pushed_msat: 0,
    remote_funds_msat: 32900000000
  },
  funding_outnum: 0,
  funding_txid: "300bc68807f563fffed7e17fb6e368131f9a2e145cec582fbde7dd3747e89caf",
  htlcs: [],
  ignore_fee_limits: true,
  in_fulfilled_msat: 25000154,
  in_offered_msat: 25000154,
  in_payments_fulfilled: 4,
  in_payments_offered: 4,
  last_stable_connection: 1745615244,
  last_tx_fee_msat: 1411000,
  lost_state: false,
  max_accepted_htlcs: 483,
  max_to_us_msat: 25000154,
  maximum_htlc_out_msat: 32571000000,
  min_to_us_msat: 0,
  minimum_htlc_in_msat: 0,
  minimum_htlc_out_msat: 0,
  opener: "remote",
  our_max_htlc_value_in_flight_msat: 18446744073709552000,
  our_reserve_msat: 329000000,
  our_to_self_delay: 6,
  out_fulfilled_msat: 0,
  out_offered_msat: 0,
  out_payments_fulfilled: 0,
  out_payments_offered: 0,
  owner: "channeld",
  peer_connected: true,
  peer_id: "020371140f2ec44c4d6cea50c018310e9409c97c410c56fbc120de3e85b0358d02",
  private: false,
  receivable_msat: 32541693846,
  reestablished: true,
  scratch_txid: "2e3eb7719cf4c515559d11433d986eee7c42ffa1be770488db4d0eb9059a8408",
  short_channel_id: "110x1x0",
  spendable_msat: 0,
  state: "CHANNELD_NORMAL",
  state_changes: [
    {
      cause: "remote",
      message: "Lockin complete",
      new_state: "CHANNELD_NORMAL",
      old_state: "CHANNELD_AWAITING_LOCKIN",
      timestamp: "2025-04-21T03:54:20.696Z"
    }
  ],
  status: mockChannelStatus,
  their_max_htlc_value_in_flight_msat: 18446744073709552000,
  their_reserve_msat: 329000000,
  their_to_self_delay: 6,
  to_us_msat: 25000154,
  total_msat: 32900000000,
  updates: {
    local: {
      cltv_expiry_delta: 6,
      fee_base_msat: 1,
      fee_proportional_millionths: 10,
      htlc_maximum_msat: 32571000000,
      htlc_minimum_msat: 0
    },
    remote: {
      cltv_expiry_delta: 6,
      fee_base_msat: 1,
      fee_proportional_millionths: 10,
      htlc_maximum_msat: 32571000000,
      htlc_minimum_msat: 0
    }
  },
  node_alias: "IRATESPORK-v25.02-31-g08210da",
  to_us_sat: 25000,
  total_sat: 32900000,
  to_them_sat: 32874999,
  current_state: "ACTIVE"
};

// Active channel 3
export const mockActiveChannel3 = {
  alias: {
    local: "5136490x3267302x62634",
    remote: "3161493x9309674x12583"
  },
  channel_id: "ed3df2aed5a51b5ed9fc1fa534cb000282fa3dfcfba93628da1907387b0e6303",
  channel_type: mockChannelType,
  close_to: "512083ca5e65a7989cf4f597aa21cea7f43af624e67d3a5141350a67ba6f366509eb",
  close_to_addr: "bcrt1ps099ued8nzw0favh4gsuafl58tmzfena8fg5zdg2v7ax7dn9p84s4vq0tl",
  direction: 0,
  dust_limit_msat: 546000,
  features: ["option_static_remotekey", "option_anchors"],
  fee_base_msat: 1,
  fee_proportional_millionths: 10,
  feerate: {
    perkb: 5020,
    perkw: 1255
  },
  funding: {
    local_funds_msat: 21700000000,
    pushed_msat: 0,
    remote_funds_msat: 0
  },
  funding_outnum: 0,
  funding_txid: "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded",
  htlcs: [],
  ignore_fee_limits: true,
  in_fulfilled_msat: 0,
  in_offered_msat: 0,
  in_payments_fulfilled: 0,
  in_payments_offered: 0,
  last_stable_connection: 1745615242,
  last_tx_fee_msat: 1411000,
  lost_state: false,
  max_accepted_htlcs: 483,
  max_to_us_msat: 21700000000,
  maximum_htlc_out_msat: 21483000000,
  min_to_us_msat: 21687599955,
  minimum_htlc_in_msat: 0,
  minimum_htlc_out_msat: 0,
  opener: "local",
  our_max_htlc_value_in_flight_msat: 18446744073709552000,
  our_reserve_msat: 217000000,
  our_to_self_delay: 6,
  out_fulfilled_msat: 12400045,
  out_offered_msat: 12400045,
  out_payments_fulfilled: 2,
  out_payments_offered: 2,
  owner: "channeld",
  peer_connected: true,
  peer_id: "03fbdd0a9ddba420be1ec9146802c9b95f6233b1a36c5e2c223884fde157be7ff5",
  private: false,
  receivable_msat: 0,
  reestablished: true,
  scratch_txid: "c600136519899af0fc96f8bf747a24594416e3ba1d44789f583ba8d58a1c1fdd",
  short_channel_id: "116x1x0",
  spendable_msat: 21466293955,
  state: "CHANNELD_NORMAL",
  state_changes: [
    {
      cause: "user",
      message: "Lockin complete",
      new_state: "CHANNELD_NORMAL",
      old_state: "CHANNELD_AWAITING_LOCKIN",
      timestamp: "2025-04-21T03:54:23.950Z"
    }
  ],
  status: mockChannelStatus,
  their_max_htlc_value_in_flight_msat: 18446744073709552000,
  their_reserve_msat: 217000000,
  their_to_self_delay: 6,
  to_us_msat: 21687599955,
  total_msat: 21700000000,
  updates: {
    local: {
      cltv_expiry_delta: 6,
      fee_base_msat: 1,
      fee_proportional_millionths: 10,
      htlc_maximum_msat: 21483000000,
      htlc_minimum_msat: 0
    },
    remote: {
      cltv_expiry_delta: 6,
      fee_base_msat: 1,
      fee_proportional_millionths: 10,
      htlc_maximum_msat: 21483000000,
      htlc_minimum_msat: 0
    }
  },
  node_alias: "ORANGEFIRE-25.02-31-g08210da",
  to_us_sat: 21687599,
  total_sat: 21700000,
  to_them_sat: 12400,
  current_state: "ACTIVE"
};

export const mockActiveChannels = [mockActiveChannel1, mockActiveChannel2, mockActiveChannel3];
export const mockPendingChannels = [];
export const mockInactiveChannels = [];

export const mockListChannels = {
  activeChannels: mockActiveChannels,
  pendingChannels: mockPendingChannels,
  inactiveChannels: mockInactiveChannels,
  mergedChannels: [...mockActiveChannels, ...mockPendingChannels, ...mockInactiveChannels],
  isLoading: false
};

export const mockRootStoreData = {
  authStatus: mockAuthStatus,
  showModals: mockShowModals,
  showToast: mockShowToast,
  connectWallet: mockConnectWallet,
  walletBalances: mockWalletBalances,
  nodeInfo: mockNodeInfo,
  listFunds: mockListFunds,
  appConfig: mockAppConfig,
  fiatConfig: mockFiatConfig,
  listPeers: mockListPeers,
  listChannels: mockListChannels,
};

export const mockListInvoices = {
  invoices: [
    {
      amount_msat: 5400000,
      bolt11: "lnbcrt54u1p5qnrk7sp5krk2d2dx00jkajavadwxmp9umzxavqh0c4nr38p9ezzawy0axu3spp5jvxwlqy3se7adns4pwuu9fprzf0whsn3su4pgtt7uwmpxvzcqgdqdpz2fjkxetfwe5kueeqg9kk7atwwssr2dpsxqxqyjw5qcqp2rzjqgphz9q09mzycntvafgvqxp3p62qnjtugyx9d77pyr0rapdsxkxsyqqqdcqqqqgqqqqqqqqpqqqqqzsqqc9qxpqysgqzv9q5gzql8vkc4kh64twa6cdvl8qdue520asl5vsjj3x6ksghq2nnymuyycvn5tp8dv5d55ct4ay05ru6pjxzsm4hf950u40842faacq84ypnl",
      created_index: 5,
      description: "Receiving Amount 5400",
      expires_at: 1746061662,
      label: "invat1745456862540029645",
      payment_hash: "930cef8091867dd6ce150bb9c2a423125eebc271872a142d7ee3b6133058021a",
      status: "unpaid"
    },
  ],
  isLoading: false
};

export const mockListPayments = {
  payments: [
    {
      amount_msat: 4400000,
      amount_sent_msat: 4400045,
      bolt11: "lnbcrt44u1p5qnrkjsp5apveynxgcs2r5tgz0nap4lzfr5ychcr6k4z05pcxg2laxer5pnpqpp5xxe6mj8tcd2d2gtgpqpadc3dz2tjdz3qd0a7a6armz7utaakxvfqdpz2fjkxetfwe5kueeqg9kk7atwwssrgdpsxqxqyjw5qcqp2rzjq0aa6z5amwjzp0s7ey2xsqkfh90kyva35dk9utpz8zz0mc2hhell2qqqncqqqqgqqqqqqqqpqqqqqzsqqc9qxpqysgq9zunju6l9aheelfn0squhdz0jtxlupqf920laf05xzquftuqds9zz3368afl3a7ewh3rdyp0vl0zg4ggc8hatusy255wu2qclcph0ycqhwqxc8",
      completed_at: 1745456852,
      created_at: 1745456851,
      created_index: 3,
      destination: "034624b42c92abcdcd9738703d0700eab52c34833469668876ef9183771ea03c9d",
      groupid: 1,
      id: 3,
      payment_hash: "31b3adc8ebc354d521680803d6e22d1297268a206bfbeeeba3d8bdc5f7b63312",
      payment_preimage: "858193eaeb9a4f8b060e0ead93d2b58b0963a95e265f0d335394c3c2d93b0d63",
      status: "complete",
      updated_index: 3,
      is_group: false,
      is_expanded: false,
      total_parts: 1
    },
  ],
  isLoading: false
};

export const mockOffer1 = {
  offer_id: "offeridl23000002300000230000023000002300000230000023000002300000",
  active: true,
  single_use: false,
  bolt12: "lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrcgq3rcdrqqpgg5uethwvs8xatzwd3hy6tsw35k7mskyyp68zdn5tm65mulfnxpnu4a0ght4q6ev6v7s6m3tj4259rlcdlnz3q",
  used: false
};

export const mockListOffers = {
  offers: [mockOffer1],
  isLoading: false
};

export const mockListLightningTransactions = {
  isLoading: false,
  clnTransactions: [
    {
      type: "INVOICE",
      payment_hash: "930cef8091867dd6ce150bb9c2a423125eebc271872a142d7ee3b6133058021a",
      status: "unpaid",
      amount_msat: 5400000,
      label: "invat1745456862540029645",
      bolt11: "lnbcrt54u1p5qnrk7sp5krk2d2dx00jkajavadwxmp9umzxavqh0c4nr38p9ezzawy0axu3spp5jvxwlqy3se7adns4pwuu9fprzf0whsn3su4pgtt7uwmpxvzcqgdqdpz2fjkxetfwe5kueeqg9kk7atwwssr2dpsxqxqyjw5qcqp2rzjqgphz9q09mzycntvafgvqxp3p62qnjtugyx9d77pyr0rapdsxkxsyqqqdcqqqqgqqqqqqqqpqqqqqzsqqc9qxpqysgqzv9q5gzql8vkc4kh64twa6cdvl8qdue520asl5vsjj3x6ksghq2nnymuyycvn5tp8dv5d55ct4ay05ru6pjxzsm4hf950u40842faacq84ypnl",
      description: "Receiving Amount 5400",
      expires_at: 1746061662
    },
  ]
};

export const mockListBitcoinTransactions = {
  isLoading: false,
  btcTransactions: [
    {
      account: "wallet",
      blockheight: 146,
      credit_msat: 0,
      currency: "bcrt",
      debit_msat: 53200166000,
      outpoint: "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded:1",
      tag: "withdrawal",
      timestamp: 1745274077,
      txid: "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9",
      type: "chain"
    },
  ]
};

export const mockFeeRate = {
  onchain_fee_estimates: {
    htlc_success_satoshis: 177,
    htlc_timeout_satoshis: 167,
    mutual_close_satoshis: 170,
    opening_channel_satoshis: 177,
    unilateral_close_nonanchor_satoshis: 151,
    unilateral_close_satoshis: 1390
  },
  perkb: {
    estimates: [
      {
        blockcount: 2,
        feerate: 1012,
        smoothed_feerate: 1012
      },
    ],
    floor: 1012,
    max_acceptable: 10120,
    min_acceptable: 1012,
    mutual_close: 1012,
    opening: 1012,
    penalty: 1012,
    unilateral_anchor_close: 5000,
    unilateral_close: 1012
  },
  isLoading: false
};

export const mockCLNStoreData = {
  listInvoices: mockListInvoices,
  listPayments: mockListInvoices,
  listOffers: mockListOffers,
  listLightningTransactions: mockListLightningTransactions,
  listBitcoinTransactions: mockListBitcoinTransactions,
  feeRate: mockFeeRate
};

export const mockSQLResponse = {
  "rows": [
    [
      1,
      "wallet",
      "chain",
      "deposit",
      100000000000,
      0,
      "bcrt",
      1745207653,
      null,
      "b29c0a4e8cf39d3a80af395735b8fb91798d207bc918600e7a5d65f99b59f5ed:0",
      107,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      2,
      "af9ce84737dde7bd2f58ec5c142e9a1f1368e3b67fe1d7feff63f50788c60b30",
      "chain",
      "channel_open",
      0,
      0,
      "bcrt",
      1745207660,
      null,
      "300bc68807f563fffed7e17fb6e368131f9a2e145cec582fbde7dd3747e89caf:0",
      110,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      3,
      "wallet",
      "chain",
      "withdrawal",
      0,
      100000000000,
      "bcrt",
      1745207663,
      null,
      "b29c0a4e8cf39d3a80af395735b8fb91798d207bc918600e7a5d65f99b59f5ed:0",
      116,
      null,
      null,
      "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded",
      null,
      null,
      null
    ],
    [
      4,
      "wallet",
      "chain",
      "deposit",
      78299834000,
      0,
      "bcrt",
      1745207663,
      null,
      "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded:1",
      116,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      5,
      "ed3df2aed5a51b5ed9fc1fa534cb000282fa3dfcfba93628da1907387b0e6303",
      "chain",
      "channel_open",
      21700000000,
      0,
      "bcrt",
      1745207663,
      null,
      "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded:0",
      116,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      6,
      "wallet",
      "onchain_fee",
      "onchain_fee",
      21700166000,
      0,
      "bcrt",
      1745207663,
      null,
      null,
      null,
      null,
      null,
      "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded",
      null,
      null,
      null
    ],
    [
      7,
      "wallet",
      "onchain_fee",
      "onchain_fee",
      0,
      21700166000,
      "bcrt",
      1745207663,
      null,
      null,
      null,
      null,
      null,
      "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded",
      null,
      null,
      null
    ],
    [
      8,
      "ed3df2aed5a51b5ed9fc1fa534cb000282fa3dfcfba93628da1907387b0e6303",
      "onchain_fee",
      "onchain_fee",
      166000,
      0,
      "bcrt",
      1745207663,
      null,
      null,
      null,
      null,
      null,
      "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded",
      null,
      null,
      null
    ],
    [
      9,
      "ed3df2aed5a51b5ed9fc1fa534cb000282fa3dfcfba93628da1907387b0e6303",
      "channel",
      "invoice",
      0,
      8000000,
      "bcrt",
      1745274076,
      "Receiving Amount 8000",
      null,
      null,
      null,
      "2f85ae433a31b4c15336bbe17e46b559c2a504ec0dd891e00fb8db408e89e10f",
      null,
      null,
      0,
      0
    ],
    [
      10,
      "wallet",
      "chain",
      "withdrawal",
      0,
      78299834000,
      "bcrt",
      1745274077,
      null,
      "03630e7b380719da2836a9fbfc3dfa820200cb34a51ffcd95e1ba5d5aef23ded:1",
      146,
      null,
      null,
      "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9",
      null,
      null,
      null
    ],
    [
      11,
      "wallet",
      "chain",
      "deposit",
      25099668000,
      0,
      "bcrt",
      1745274077,
      null,
      "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9:1",
      146,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      12,
      "a92862efdedca262243475c0b7d0210f7925bccd625892b73b9b30618fa1e6fc",
      "chain",
      "channel_open",
      53200000000,
      0,
      "bcrt",
      1745274077,
      null,
      "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9:0",
      146,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      13,
      "wallet",
      "onchain_fee",
      "onchain_fee",
      53200166000,
      0,
      "bcrt",
      1745274077,
      null,
      null,
      null,
      null,
      null,
      "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9",
      null,
      null,
      null
    ],
    [
      14,
      "wallet",
      "onchain_fee",
      "onchain_fee",
      0,
      53200166000,
      "bcrt",
      1745274077,
      null,
      null,
      null,
      null,
      null,
      "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9",
      null,
      null,
      null
    ],
    [
      15,
      "a92862efdedca262243475c0b7d0210f7925bccd625892b73b9b30618fa1e6fc",
      "onchain_fee",
      "onchain_fee",
      166000,
      0,
      "bcrt",
      1745274077,
      null,
      null,
      null,
      null,
      null,
      "fce6a18f61309b3bb7925862cdbc25790f21d0b7c075342462a2dcdeef6228a9",
      null,
      null,
      null
    ],
    [
      16,
      "a92862efdedca262243475c0b7d0210f7925bccd625892b73b9b30618fa1e6fc",
      "channel",
      "invoice",
      0,
      8900000,
      "bcrt",
      1745274078,
      "Receiving Amount 8900",
      null,
      null,
      null,
      "3855ea7584974d115cd2abada265b359d9e7f104496be43968941c6f5a06c0be",
      null,
      null,
      0,
      0
    ],
    [
      17,
      "a92862efdedca262243475c0b7d0210f7925bccd625892b73b9b30618fa1e6fc",
      "channel",
      "routed",
      0,
      6100000,
      "bcrt",
      1745323951,
      null,
      null,
      null,
      null,
      "63269343980800a2105f3dc817e9ec157b2a2ec5844bb567ca9e2c60055478c1",
      null,
      62,
      0,
      0
    ],
    [
      18,
      "af9ce84737dde7bd2f58ec5c142e9a1f1368e3b67fe1d7feff63f50788c60b30",
      "channel",
      "routed",
      6100062,
      0,
      "bcrt",
      1745323951,
      null,
      null,
      null,
      null,
      "63269343980800a2105f3dc817e9ec157b2a2ec5844bb567ca9e2c60055478c1",
      null,
      62,
      0,
      0
    ],
    [
      19,
      "af9ce84737dde7bd2f58ec5c142e9a1f1368e3b67fe1d7feff63f50788c60b30",
      "channel",
      "invoice",
      4700000,
      0,
      "bcrt",
      1745456841,
      "Receiving Amount 4700",
      null,
      null,
      null,
      "d809e472c9be9a3644ec28b0404bbd14008c2a172fbe1822f97c54e0c6552f79",
      null,
      null,
      0,
      0
    ],
    [
      20,
      "ed3df2aed5a51b5ed9fc1fa534cb000282fa3dfcfba93628da1907387b0e6303",
      "channel",
      "invoice",
      0,
      4400045,
      "bcrt",
      1745456853,
      "Receiving Amount 4400",
      null,
      null,
      null,
      "31b3adc8ebc354d521680803d6e22d1297268a206bfbeeeba3d8bdc5f7b63312",
      null,
      45,
      0,
      0
    ],
    [
      21,
      "a92862efdedca262243475c0b7d0210f7925bccd625892b73b9b30618fa1e6fc",
      "channel",
      "routed",
      0,
      9100000,
      "bcrt",
      1745538207,
      null,
      null,
      null,
      null,
      "7c51b8db7a373ca79e52fc85000e2722f7aa3635e9e75624eb6e9e4b81619060",
      null,
      92,
      0,
      0
    ],
    [
      22,
      "af9ce84737dde7bd2f58ec5c142e9a1f1368e3b67fe1d7feff63f50788c60b30",
      "channel",
      "routed",
      9100092,
      0,
      "bcrt",
      1745538207,
      null,
      null,
      null,
      null,
      "7c51b8db7a373ca79e52fc85000e2722f7aa3635e9e75624eb6e9e4b81619060",
      null,
      92,
      0,
      0
    ],
    [
      23,
      "af9ce84737dde7bd2f58ec5c142e9a1f1368e3b67fe1d7feff63f50788c60b30",
      "channel",
      "invoice",
      5100000,
      0,
      "bcrt",
      1745538212,
      "Receiving Amount 5100",
      null,
      null,
      null,
      "38e3a07721364a8c91b73f2a1b7b69968ed6b2db45f302884eca3d2eeb82775e",
      null,
      null,
      0,
      0
    ]
  ]
};

export const mockBKPRSummary = {
  isLoading: false,
  onchain_fee_msat: 332000,
  routing_revenue_msat: 154,
  total_invoice_received_msat: 9800000,
  total_payments_sent_msat: 21300000,
  inflows_for_period_msat: 100009800154,
  outflows_for_period_msat: 21632045,
  total_fee_msat: 154,
  most_traffic_route: {
    channel_scids: "110x1x0 -> 146x1x0",
    channel_aliases: "IRATESPORK-v25.02-31-g08210da -> SLICKERMAESTRO-25.02-31-g08210da",
    fee_msat: 154
  },
  least_traffic_route: {
    channel_scids: "110x1x0 -> 146x1x0",
    channel_aliases: "IRATESPORK-v25.02-31-g08210da -> ORANGEFIRE-25.02-31-g08210da",
    fee_msat: 19
  },
  errors: []
};

export const mockBKPRAccountEvents = {
  isLoading: false,
  timeGranularity: TimeGranularity.DAILY,
  startTimestamp: 1742972400,
  endTimestamp: 1745650799,
  events: [
    {
      credit_msat: 100000000000,
      debit_msat: 0,
      account: "wallet",
      timestamp: 1745207653,
      balance_msat: 0
    },
  ],
  periods: [
    {
      period_key: "2025-04-20",
      accounts: [
        {
          short_channel_id: "wallet",
          remote_alias: "n/a",
          credit_msat: 203399502000,
          debit_msat: 178299834000,
          account: "wallet",
          timestamp: 1745207653,
          balance_msat: 25099668000
        },
      ],
      total_balance_across_accounts: 199999668000
    },
  ],
};

export const mockBKPRSatsFlowEvents = {
  isLoading: false,
  timeGranularity: TimeGranularity.DAILY,
  startTimestamp: 1742972400,
  endTimestamp: 1745650799,
  satsFlowEvents: [
    {
      account: "wallet",
      tag: "deposit",
      credit_msat: 100000000000,
      debit_msat: 0,
      currency: "bcrt",
      timestamp: 1745207653,
      outpoint: "b29c0a4e8cf39d3a80af395735b8fb91798d207bc918600e7a5d65f99b59f5ed:0",
    },
  ],
  periods: [
    {
      period_key: "2025-04-20",
      tag_groups: [
        {
          events: [
            {
              account: "wallet",
              tag: "deposit",
              credit_msat: 100000000000,
              debit_msat: 0,
              currency: "bcrt",
              timestamp: 1745207653,
              outpoint: "b29c0a4e8cf39d3a80af395735b8fb91798d207bc918600e7a5d65f99b59f5ed:0",
            }
          ],
          tag: "deposit",
          credit_msat: 100000000000,
          debit_msat: 0
        },
      ],
      inflow_msat: 100000000000,
      outflow_msat: 166000
    },
  ],
};

export const mockBKPRVolume = {
  isLoading: false,
  forwards: [
    {
      in_channel_scid: "110x1x0",
      in_channel_peer_id: "020371140f2ec44c4d6cea50c018310e9409c97c410c56fbc120de3e85b0358d02",
      in_channel_peer_alias: "IRATESPORK",
      in_msat: 15200154,
      out_channel_scid: "146x1x0",
      out_channel_peer_id: "03fbdd0a9ddba420be1ec9146802c9b95f6233b1a36c5e2c223884fde157be7ff5",
      out_channel_peer_alias: "SLICKERMAESTRO",
      out_msat: 15200000,
      fee_msat: 154
    }
  ]
};

export const mockBKPRStoreData = {
  summary: mockBkprSummaryData,
  accountEvents: mockBKPRAccountEvents,
  satsFlow: mockBKPRSatsFlowEvents,
  volume: mockBKPRVolume
};

export const mockAppStore = {
  root: mockRootStoreData,
  cln: mockCLNStoreData,
  bkpr: mockBKPRStoreData
};
