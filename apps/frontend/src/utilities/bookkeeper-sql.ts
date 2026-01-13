export const AccountEventsSQL =
  'SELECT peerchannels.short_channel_id, ' +
  'nodes.alias, ' +
  'bkpr_accountevents.credit_msat, ' +
  'bkpr_accountevents.debit_msat, ' +
  'bkpr_accountevents.account, ' +
  'bkpr_accountevents.timestamp ' +
  'FROM bkpr_accountevents ' +
  'LEFT JOIN peerchannels ON upper(bkpr_accountevents.account)=hex(peerchannels.channel_id) ' +
  'LEFT JOIN nodes ON peerchannels.peer_id=nodes.nodeid ' +
  "WHERE bkpr_accountevents.type != 'onchain_fee' " +
  "AND bkpr_accountevents.account != 'external';";

export const SatsFlowSQL = (startTimestamp: number, endTimestamp: number): string => 
  'SELECT account, ' +
  'tag, ' +
  'credit_msat, ' +
  'debit_msat, ' +
  'currency, ' +
  'timestamp, ' +
  'description, ' +
  'outpoint, ' +
  'txid, ' +
  'payment_id ' +
  'FROM bkpr_income ' +
  'WHERE bkpr_income.timestamp BETWEEN ' +
  startTimestamp +
  ' AND ' +
  endTimestamp +
  ';';

export const VolumeSQL = "SELECT f.in_channel, pc_in.peer_id AS in_channel_peerid, n_in.alias AS in_channel_peer_alias, SUM(f.in_msat) AS total_in_msat, f.out_channel, pc_out.peer_id AS out_channel_peerid, n_out.alias AS out_channel_peer_alias, SUM(f.out_msat) AS total_out_msat, SUM(f.fee_msat) AS total_fee_msat FROM forwards f LEFT JOIN peerchannels pc_in ON pc_in.short_channel_id = f.in_channel LEFT JOIN nodes n_in ON n_in.nodeid = pc_in.peer_id LEFT JOIN peerchannels pc_out ON pc_out.short_channel_id = f.out_channel LEFT JOIN nodes n_out ON n_out.nodeid = pc_out.peer_id WHERE f.status = 'settled' GROUP BY f.in_channel, pc_in.peer_id, n_in.alias, f.out_channel, pc_out.peer_id, n_out.alias;";