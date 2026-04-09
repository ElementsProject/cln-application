import './FactoryCreate.scss';
import { useState } from 'react';
import { Card, Row, Col, Form, Spinner } from 'react-bootstrap';
import { CallStatus, CLEAR_STATUS_ALERT_DELAY } from '../../../utilities/constants';
import { FactoriesService } from '../../../services/http.service';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';

type FactoryCreateProps = {
  onClose: () => void;
};

const FactoryCreate = ({ onClose }: FactoryCreateProps) => {
  const [fundingSats, setFundingSats] = useState('');
  const [clientIds, setClientIds] = useState('');
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const handleCreate = async () => {
    const amount = parseInt(fundingSats, 10);
    if (!amount || amount <= 0) {
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage('Funding amount must be greater than 0');
      return;
    }

    const clients = clientIds
      .split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (clients.length === 0) {
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage('At least one client node ID is required');
      return;
    }

    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Creating factory...');

    try {
      const res = await FactoriesService.createFactory(amount, clients);
      setResponseStatus(CallStatus.SUCCESS);
      setResponseMessage(`Factory created: ${res.instance_id.substring(0, 16)}...`);
      FactoriesService.fetchFactoriesData();
      setTimeout(() => {
        onClose();
      }, CLEAR_STATUS_ALERT_DELAY);
    } catch (err: any) {
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(typeof err === 'string' ? err : err.message || 'Factory creation failed');
    }
  };

  return (
    <Card className='h-100 d-flex align-items-stretch px-4 pt-4 pb-3' data-testid='factory-create'>
      <Card.Header className='px-1 pb-2 p-0 d-flex justify-content-between align-items-center'>
        <span className='fs-18px fw-bold text-dark'>Create Factory</span>
        <button className='btn btn-sm btn-outline-secondary btn-rounded' onClick={onClose}>Cancel</button>
      </Card.Header>
      <Card.Body className='py-2 px-1'>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label className='fs-7 text-light'>Funding Amount (sats)</Form.Label>
            <Form.Control
              type='number'
              placeholder='100000'
              value={fundingSats}
              onChange={(e) => setFundingSats(e.target.value)}
              disabled={responseStatus === CallStatus.PENDING}
              data-testid='factory-create-amount'
              autoFocus
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label className='fs-7 text-light'>Client Node IDs (one per line)</Form.Label>
            <Form.Control
              as='textarea'
              rows={4}
              placeholder={'03abc123...def456\n02xyz789...ghi012'}
              value={clientIds}
              onChange={(e) => setClientIds(e.target.value)}
              disabled={responseStatus === CallStatus.PENDING}
              data-testid='factory-create-clients'
              className='fs-7'
            />
          </Form.Group>
        </Form>

        {responseStatus !== CallStatus.NONE && (
          <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
        )}
      </Card.Body>
      <Card.Footer className='d-flex justify-content-center'>
        <button
          className='btn-rounded bg-primary'
          onClick={handleCreate}
          disabled={responseStatus === CallStatus.PENDING}
          data-testid='button-submit-create-factory'
        >
          {responseStatus === CallStatus.PENDING ? (
            <Spinner animation='border' size='sm' className='me-2' />
          ) : null}
          Create Factory
        </button>
      </Card.Footer>
    </Card>
  );
};

export default FactoryCreate;
