export interface Address {
  type?: string;
  address?: string;
  port?: number;
}

export interface GetInfo {
  id: string;
  alias?: string;
  color?: string;
  version?: string;
  network?: string;
  blockheight?: number;
  num_peers?: number;
  num_pending_channels?: number;
  num_active_channels?: number;
  num_inactive_channels?: number;
  msatoshi_fees_collected?: number;
  address?: Address[];
  binding?: Address[];
  our_features?: any;
}
