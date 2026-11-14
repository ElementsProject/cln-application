import { useRef, useState } from 'react';
import { Alert, Form, InputGroup } from 'react-bootstrap';
import { HttpService } from '../../../services/http.service';

// Keep an unresolved submission visible even after closing the channel drawer.
export default function SpliceChannel({ channel }) {
  const key = 'splice:' + channel.channel_id;
  const [direction, setDirection] = useState('splicein');
  const [amount, setAmount] = useState('');
  const [review, setReview] = useState(false);
  const [record, setRecord] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const value = JSON.parse(raw);
      if (
        !value ||
        !['splicein', 'spliceout'].includes(value.direction) ||
        typeof value.amount !== 'string' ||
        typeof value.funding !== 'string'
      )
        throw new Error('Invalid saved splice');
      return value;
    } catch {
      return { storageError: true };
    }
  });
  const [settled, setSettled] = useState(false);
  const [aborted, setAborted] = useState(false);
  const [status, setStatus] = useState('');
  const submitting = useRef(false);
  const confirmed =
    settled ||
    (!!record?.txid && channel.state === 'CHANNELD_NORMAL' && channel.funding_txid === record.txid);
  const save = value => {
    localStorage.setItem(key, JSON.stringify(value));
    setRecord(value);
  };
  const valid = /^[1-9][0-9]{0,15}$/.test(amount) && Number.isSafeInteger(Number(amount));
  const available =
    channel.state === 'CHANNELD_NORMAL' &&
    channel.peer_connected === true &&
    !channel.inflight?.length;
  const submit = async () => {
    if (!valid || !available || record || submitting.current) return;
    submitting.current = true;
    setReview(false);
    const pending = {
      direction,
      amount,
      funding: channel.funding_txid,
      time: new Date().toISOString(),
    };
    try {
      save(pending);
    } catch {
      setStatus('Cannot save the splice record in this browser. No splice was submitted.');
      submitting.current = false;
      return;
    }
    setStatus('Negotiating splice with the peer. Do not submit another splice.');
    try {
      const result: any = await HttpService.clnCall(direction, {
        channel: channel.channel_id,
        amount,
      });
      const completed = {
        ...pending,
        txid: result.txid,
        result: result.txid
          ? 'Broadcast; waiting for confirmations.'
          : 'Node returned without a transaction ID; check channel status before retrying.',
      };
      setRecord(completed);
      try {
        save(completed);
      } catch {
        setStatus(
          'The node replied, but the result could not be saved in this browser. Keep the transaction ID and check the node before another splice.',
        );
        return;
      }
      setStatus('');
    } catch (error) {
      setStatus('');
      const failed = { ...pending, error: String(error) };
      setRecord(failed);
      try {
        save(failed);
      } catch {
        setStatus(
          'Browser storage is unavailable. Check the node before submitting any further splice.',
        );
      }
    } finally {
      submitting.current = false;
    }
  };
  const refresh = async () => {
    try {
      const result: any = await HttpService.clnCall('listpeerchannels', { id: channel.peer_id });
      const current = result.channels.find(c => c.channel_id === channel.channel_id);
      if (!current) {
        setStatus('Channel not found. Do not repeat the splice.');
        return;
      }
      setAborted(
        !!record?.error &&
          current.state === 'CHANNELD_NORMAL' &&
          !current.inflight?.length &&
          current.funding_txid === record.funding,
      );
      setSettled(
        current.state === 'CHANNELD_NORMAL' &&
          !current.inflight?.length &&
          !!record?.txid &&
          current.funding_txid === record.txid,
      );
      setStatus(
        'State: ' +
          current.state +
          '; capacity: ' +
          (Number(current.total_msat) / 1000).toLocaleString() +
          ' sats; funding transaction: ' +
          current.funding_txid +
          '; pending splices: ' +
          (current.inflight?.length || 0),
      );
    } catch (error) {
      setStatus('Status check failed: ' + String(error));
    }
  };
  const dismiss = (archive = false) => {
    try {
      if (archive) {
        let history: any[] = [];
        try {
          const stored = JSON.parse(localStorage.getItem(key + ':history') || '[]');
          if (Array.isArray(stored)) history = stored;
        } catch {
          /* Keep the current record in the replacement history. */
        }
        localStorage.setItem(key + ':history', JSON.stringify([...history, record].slice(-20)));
      }
      localStorage.removeItem(key);
      setRecord(null);
      setAborted(false);
      setSettled(false);
      setStatus('');
    } catch {
      setStatus(
        'Could not dismiss the saved splice record. It has been kept; no new splice was submitted.',
      );
    }
  };
  if (record?.storageError)
    return (
      <Alert variant="warning">
        The saved splice record cannot be read. Check the node’s channel and wallet history before
        attempting another splice.
      </Alert>
    );
  if (channel.splice_supported === false)
    return (
      <p className="mt-3">
        Splicing requires a REST or Commando connection. It is unavailable through this
        application’s gRPC schema.
      </p>
    );
  if (!record && channel.state === 'CHANNELD_AWAITING_SPLICE') return null;
  return (
    <section className="mt-4 mb-3" aria-label="Splice channel">
      <h5>Splice channel</h5>
      <p className="fs-7">
        Add on-chain funds or withdraw local funds without closing the channel. Both nodes must
        support splicing.
      </p>
      {record ? (
        <Alert variant={record.error ? 'warning' : 'info'}>
          <div>
            {record.direction === 'splicein' ? 'Splice in' : 'Splice out'}:{' '}
            {Number(record.amount).toLocaleString()} sats
          </div>
          <div>{record.time}</div>
          <div style={{ overflowWrap: 'anywhere' }}>
            {confirmed
              ? 'Splice confirmed.'
              : record.error || record.result || 'Submission in progress or outcome unknown.'}
          </div>
          {record.txid && (
            <div style={{ overflowWrap: 'anywhere' }}>Transaction: {record.txid}</div>
          )}
          <p>
            Check the channel and transaction before any further splice. A lost reply does not mean
            it failed.
          </p>
          <button type="button" className="btn-rounded bg-primary" onClick={refresh}>
            Refresh splice status
          </button>
          {aborted && (
            <div className="mt-2">
              <p>
                The node reports the original funding transaction and no pending splice. Check
                wallet transactions and allow outstanding node operations to finish before
                dismissing this record. A missing inflight entry alone does not prove a lost request
                failed.
              </p>
              <button type="button" className="btn-rounded" onClick={() => dismiss(true)}>
                Dismiss record after checking node
              </button>
            </div>
          )}
          {confirmed && (
            <button type="button" className="btn-rounded mt-2" onClick={() => dismiss()}>
              Splice confirmed — dismiss result
            </button>
          )}
        </Alert>
      ) : (
        <>
          <Form.Label className="text-dark" htmlFor="splice-direction">
            Direction
          </Form.Label>
          <InputGroup>
            <Form.Select
              className="form-control"
              id="splice-direction"
              value={direction}
              onChange={e => {
                setDirection(e.target.value);
                setReview(false);
              }}
            >
              <option value="splicein">Add funds from on-chain wallet</option>
              <option value="spliceout">Withdraw funds to on-chain wallet</option>
            </Form.Select>
          </InputGroup>
          <Form.Label className="mt-2 text-dark" htmlFor="splice-amount">
            Amount in sats
          </Form.Label>
          <InputGroup>
            <Form.Control
              id="splice-amount"
              inputMode="numeric"
              value={amount}
              onChange={e => {
                setAmount(e.target.value);
                setReview(false);
              }}
            />
          </InputGroup>
          <p className="fs-7 mt-2">
            {direction === 'splicein'
              ? 'The network fee is paid separately from the on-chain wallet.'
              : 'The network fee is also deducted from channel funds.'}{' '}
            Core Lightning selects the fee rate with its normal fee safety checks.
          </p>
          {!available && (
            <p>Connect the peer and wait for the channel to become active before splicing.</p>
          )}
          {review ? (
            <Alert variant="warning">
              <p>
                Confirm {direction === 'splicein' ? 'adding' : 'withdrawing'}{' '}
                {Number(amount).toLocaleString()} sats {direction === 'splicein' ? 'to' : 'from'}{' '}
                this channel, plus the network fee?
              </p>
              <button type="button" className="btn-rounded bg-primary me-2" onClick={submit}>
                Confirm splice
              </button>
              <button type="button" className="btn-rounded" onClick={() => setReview(false)}>
                Cancel
              </button>
            </Alert>
          ) : (
            <button
              type="button"
              className="btn-rounded bg-primary"
              disabled={!valid || !available}
              onClick={() => setReview(true)}
            >
              Review splice
            </button>
          )}
        </>
      )}
      {status && (
        <p role="status" style={{ overflowWrap: 'anywhere' }}>
          {status}
        </p>
      )}
    </section>
  );
}
