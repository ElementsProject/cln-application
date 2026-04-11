export type CoordinationFactory = {
  id: string;
  lsp_alias: string;
  lsp_pubkey: string;
  status: 'forming' | 'rotating';
  open_slots: number;
  total_slots: number;
  total_capacity_sats: number;
  min_channel_sats: number;
  blocks_until_rotation: number;
  n_breach_epochs: number;
};

export const SAMPLE_COORDINATION_FACTORIES: CoordinationFactory[] = [
  {
    id: 'coord-001',
    lsp_alias: 'LiquidityNode Alpha',
    lsp_pubkey: '03a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    status: 'forming',
    open_slots: 8,
    total_slots: 10,
    total_capacity_sats: 10000000,
    min_channel_sats: 100000,
    blocks_until_rotation: 0,
    n_breach_epochs: 0,
  },
  {
    id: 'coord-002',
    lsp_alias: 'Signet LSP One',
    lsp_pubkey: '02b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    status: 'forming',
    open_slots: 4,
    total_slots: 5,
    total_capacity_sats: 5000000,
    min_channel_sats: 500000,
    blocks_until_rotation: 0,
    n_breach_epochs: 0,
  },
  {
    id: 'coord-003',
    lsp_alias: 'BlueNode Factory',
    lsp_pubkey: '03c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    status: 'rotating',
    open_slots: 3,
    total_slots: 10,
    total_capacity_sats: 20000000,
    min_channel_sats: 200000,
    blocks_until_rotation: 2016,
    n_breach_epochs: 0,
  },
  {
    id: 'coord-004',
    lsp_alias: 'DeepSats Provider',
    lsp_pubkey: '02d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    status: 'rotating',
    open_slots: 1,
    total_slots: 8,
    total_capacity_sats: 8000000,
    min_channel_sats: 100000,
    blocks_until_rotation: 4032,
    n_breach_epochs: 0,
  },
  {
    id: 'coord-005',
    lsp_alias: 'FactoryNet Hub',
    lsp_pubkey: '03e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    status: 'rotating',
    open_slots: 5,
    total_slots: 12,
    total_capacity_sats: 50000000,
    min_channel_sats: 1000000,
    blocks_until_rotation: 1008,
    n_breach_epochs: 0,
  },
  {
    id: 'coord-006',
    lsp_alias: 'CautionNode LSP',
    lsp_pubkey: '02f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    status: 'forming',
    open_slots: 9,
    total_slots: 10,
    total_capacity_sats: 3000000,
    min_channel_sats: 50000,
    blocks_until_rotation: 0,
    n_breach_epochs: 2,
  },
];
