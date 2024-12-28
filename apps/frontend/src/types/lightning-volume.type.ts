export type VolumeData = {
  forwards: Forward[],
  totalOutboundSat: number,
  totalFeeSat: number
};

export type Forward = {
  inboundChannelSCID: string,
  inboundPeerId: string,
  inboundPeerAlias: string,
  inboundSat: number,
  outboundChannelSCID: string,
  outboundPeerId: string,
  outboundPeerAlias: string,
  outboundSat: number,
  feeSat: number
};

export type VolumeResultSet = {
  rows: VolumeRow[]
};

export type VolumeRow = {
  inChannelSCID: string,
  inChannelPeerId: string,
  inChannelPeerAlias: string,
  inMsat: number,
  outChannelSCID: string,
  outChannelPeerId: string,
  outChannelPeerAlias: string,
  outMsat: number,
  feeMsat: number
};

const mapToVolume = (row: (string | number)[]): VolumeRow => ({
  inChannelSCID: row[0] as string,
  inChannelPeerId: row[1] as string,
  inChannelPeerAlias: row[2] as string,
  inMsat: row[3] as number,
  outChannelSCID: row[4] as string,
  outChannelPeerId: row[5] as string,
  outChannelPeerAlias: row[6] as string,
  outMsat: row[7] as number,
  feeMsat: row[8] as number
});

export const convertRawToVolumeResultSet = (raw: RawVolumeResultSet): VolumeResultSet => {
  return {
    rows: raw.rows.map(mapToVolume)
  };
};

export type RawVolumeResultSet = {
  rows: RawVolumeRow[]
};

export type RawVolumeRow = [
  in_channel: string,
  in_channel_peer_id: string,
  in_channel_peer_alias: string,
  in_msat: number,
  out_channel: string,
  out_channel_peer_id: string,
  out_channel_peer_alias: string,
  out_msat: number,
  fee_msat: number
];
