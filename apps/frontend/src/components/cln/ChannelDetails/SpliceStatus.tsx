export default function SpliceStatus({ channel, detailed = false }) {
  if (channel.state !== 'CHANNELD_AWAITING_SPLICE') return null;
  const pending = channel.pending_splices || [];
  return (
    <div className="mt-2 mb-2 fs-7" role="status" aria-label="Pending splice">
      {pending.length ? (
        pending.map(splice => (
          <div key={splice.txid} className="mb-2">
            <div className="fw-bold text-warning">
              Splice pending: {splice.delta > 0 ? '+' : ''}
              {splice.delta.toLocaleString()} sats
            </div>
            <div className="text-dark">
              {splice.confirmations === null
                ? 'Confirmation count unavailable'
                : splice.confirmations === 0
                  ? '0 confirmations · waiting to be mined'
                  : splice.confirmations.toLocaleString() +
                    (splice.confirmations === 1 ? ' confirmation' : ' confirmations') +
                    ' · waiting for both peers to lock the splice'}
            </div>
            {detailed && (
              <>
                <div className="text-dark">
                  Channel capacity after splice: {splice.capacity.toLocaleString()} sats
                </div>
                <div className="text-light" style={{ overflowWrap: 'anywhere' }}>
                  Splice transaction: {splice.txid}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div className="fw-bold text-warning">
          Splice pending · waiting for both peers to lock the splice
        </div>
      )}
      {detailed && (
        <div className="text-light">
          Balances above show the current funding. The new capacity is pending. The peer’s required
          confirmation count is not reported by Core Lightning.
        </div>
      )}
      {channel.splice_status_error && (
        <div className="text-danger">Confirmation lookup failed: {channel.splice_status_error}</div>
      )}
    </div>
  );
}
