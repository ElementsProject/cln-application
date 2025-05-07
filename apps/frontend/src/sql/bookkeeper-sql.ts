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
  "WHERE type != 'onchain_fee' AND bkpr_accountevents.account != 'external';";

export const SatsFlowSQL =
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
  "FROM bkpr_income;";
