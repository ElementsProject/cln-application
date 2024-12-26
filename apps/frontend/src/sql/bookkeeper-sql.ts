export const BalanceSheetSQL =
  "SELECT peerchannels.short_channel_id, " +
    "nodes.alias, " + 
    "bkpr_accountevents.credit_msat, " + 
    "bkpr_accountevents.debit_msat, " + 
    "bkpr_accountevents.account, " + 
    "bkpr_accountevents.timestamp " + 
  "FROM bkpr_accountevents " + 
    "LEFT JOIN peerchannels ON upper(bkpr_accountevents.account)=hex(peerchannels.channel_id) " + 
    "LEFT JOIN nodes ON peerchannels.peer_id=nodes.nodeid " + 
  "WHERE bkpr_accountevents.type != 'onchain_fee' " +
    "AND bkpr_accountevents.account != 'external';";

export const SatsFlowSQL = (startTimestamp: number, endTimestamp: number): string =>
  "SELECT account, " +
    "tag, " +
    "credit_msat, " +
    "debit_msat, " +
    "currency, " +
    "timestamp, " +
    "description, " +
    "outpoint, " +
    "txid, " +
    "payment_id " +
  "FROM bkpr_income " +
  "WHERE bkpr_income.timestamp BETWEEN " + startTimestamp + " AND " + endTimestamp + ";";

  export const VolumeSQL =
    "SELECT in_channel, " +
      "(SELECT peer_id FROM peerchannels WHERE peerchannels.short_channel_id=in_channel) AS in_channel_peerid, " +
      "(SELECT nodes.alias FROM nodes WHERE nodes.nodeid=(SELECT peer_id FROM peerchannels WHERE peerchannels.short_channel_id=in_channel)) AS in_channel_peer_alias, " +
      "SUM(in_msat), " +
      "out_channel, " +
      "(SELECT peer_id FROM peerchannels WHERE peerchannels.short_channel_id=out_channel) AS out_channel_peerid, " +
      "(SELECT nodes.alias FROM nodes WHERE nodes.nodeid=(SELECT peer_id FROM peerchannels WHERE peerchannels.short_channel_id=out_channel)) AS out_channel_peer_alias, " +
      "SUM(out_msat), " +
      "SUM(fee_msat) " +
    "FROM forwards " +
    "WHERE forwards.status='settled' " +
    "GROUP BY in_channel, out_channel;";
