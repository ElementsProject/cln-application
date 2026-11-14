import { useEffect, useState } from 'react';
import { Form, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { HttpService } from '../../../services/http.service';
import { setChannelLabel } from '../../../store/rootSlice';

export default function ChannelLabel({ channel }) {
  const dispatch = useDispatch();
  const [label, setLabel] = useState(channel.channel_label || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!editing) setLabel(channel.channel_label || '');
  }, [channel.channel_label, editing]);
  const save = async () => {
    if (saving) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const result: any = await HttpService.clnCall('setchannellabel', {
        channel_id: channel.channel_id,
        label,
      });
      dispatch(setChannelLabel(result));
      setEditing(false);
      setMessage(result.label ? 'Channel label saved.' : 'Channel label removed.');
    } catch (e) {
      setError('Could not save channel label: ' + String(e));
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="mt-3 mb-3" data-testid="channel-label-editor">
      {channel.channel_label_error && (
        <Alert variant="warning">{channel.channel_label_error}</Alert>
      )}
      <Form.Label className="text-dark" htmlFor="channel-label">
        Channel label
      </Form.Label>
      <InputGroup>
        <Form.Control
          id="channel-label"
          maxLength={80}
          value={label}
          disabled={saving}
          placeholder="Optional"
          onChange={e => {
            setLabel(e.target.value);
            setEditing(true);
            setMessage('');
          }}
        />
      </InputGroup>
      <div className="fs-7 text-light mt-1">
        Private to your node. Leave blank to use the peer alias.
      </div>
      <div className="d-flex gap-2 mt-2">
        <button
          type="button"
          className="btn-rounded bg-primary"
          onClick={save}
          disabled={saving || !editing}
        >
          {saving ? 'Saving…' : 'Save label'}
        </button>
        {editing && (
          <button
            type="button"
            className="btn-rounded"
            disabled={saving}
            onClick={() => {
              setEditing(false);
              setError('');
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {message && (
        <p role="status" className="mt-2">
          {message}
        </p>
      )}
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
    </section>
  );
}
