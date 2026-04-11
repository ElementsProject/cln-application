export interface NodeProfile {
  id: string; // sha256(pubkey+wsHost+wsPort) truncated to 12 hex
  label: string; // user-friendly name (defaults to alias from getinfo)
  pubkey: string; // LIGHTNING_PUBKEY
  rune: string; // LIGHTNING_RUNE
  wsHost: string;
  wsPort: number;
  network?: string; // from getinfo
  alias?: string; // from getinfo
  blockheight?: number; // from getinfo
  lastSeen?: number; // unix timestamp
}

export interface NodeProfilesConfig {
  version: 1;
  activeProfileId: string | null;
  profiles: NodeProfile[];
}
