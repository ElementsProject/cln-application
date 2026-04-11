export interface NodeProfile {
  id: string;
  label: string;
  pubkey: string;
  wsHost: string;
  wsPort: number;
  network?: string;
  alias?: string;
  blockheight?: number;
  lastSeen?: number;
}

export interface NodesState {
  isLoading: boolean;
  profiles: NodeProfile[];
  activeProfileId: string | null;
  isConnected: boolean;
  isSwitching: boolean;
  isDiscovering: boolean;
  error: any;
}
