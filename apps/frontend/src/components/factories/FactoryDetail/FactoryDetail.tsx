import './FactoryDetail.scss';
import { useState } from 'react';
import { Card, Row, Col, ListGroup, Alert, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CallStatus, CLEAR_STATUS_ALERT_DELAY } from '../../../utilities/constants';
import { Factory, FactoryLifecycle, FactoryCeremony } from '../../../types/factories.type';
import { FactoriesService } from '../../../services/http.service';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import { useSelector } from 'react-redux';
import { selectNodeInfo } from '../../../store/rootSelectors';
import CeremonyProgress from '../CeremonyProgress/CeremonyProgress';

type FactoryDetailProps = {
  factory: Factory;
  onClose: () => void;
};

const FactoryDetail = ({ factory, onClose }: FactoryDetailProps) => {
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');
  const nodeInfo = useSelector(selectNodeInfo);

  const resetStatus = () => {
    setTimeout(() => {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }, CLEAR_STATUS_ALERT_DELAY);
  };

  const handleRotate = async () => {
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Rotating factory...');
    try {
      const res = await FactoriesService.rotateFactory(factory.instance_id);
      setResponseStatus(CallStatus.SUCCESS);
      setResponseMessage(`Rotated: epoch ${res.old_epoch} -> ${res.new_epoch}`);
      FactoriesService.fetchFactoriesData();
      resetStatus();
    } catch (err: any) {
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(typeof err === 'string' ? err : err.message || 'Rotation failed');
      resetStatus();
    }
  };

  const handleClose = async () => {
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Closing factory...');
    try {
      const res = await FactoriesService.closeFactory(factory.instance_id);
      setResponseStatus(CallStatus.SUCCESS);
      setResponseMessage(`Close initiated: ${res.status}`);
      FactoriesService.fetchFactoriesData();
      resetStatus();
    } catch (err: any) {
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(typeof err === 'string' ? err : err.message || 'Close failed');
      resetStatus();
    }
  };

  const handleForceClose = async () => {
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Force closing factory...');
    try {
      const res = await FactoriesService.forceCloseFactory(factory.instance_id);
      setResponseStatus(CallStatus.SUCCESS);
      setResponseMessage(`Force closed: ${res.n_signed_txs} transactions broadcast`);
      FactoriesService.fetchFactoriesData();
      resetStatus();
    } catch (err: any) {
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(typeof err === 'string' ? err : err.message || 'Force close failed');
      resetStatus();
    }
  };

  const handleOpenChannels = async () => {
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Opening channels...');
    try {
      await FactoriesService.openChannels(factory.instance_id);
      setResponseStatus(CallStatus.SUCCESS);
      setResponseMessage('Channel opening initiated');
      FactoriesService.fetchFactoriesData();
      resetStatus();
    } catch (err: any) {
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(typeof err === 'string' ? err : err.message || 'Open channels failed');
      resetStatus();
    }
  };

  const handleInvite = () => {
    const text = `Factory ID: ${factory.instance_id}\nLSP Pubkey: ${nodeInfo.id || 'unknown'}`;
    copyTextToClipboard(text);
    setResponseStatus(CallStatus.SUCCESS);
    setResponseMessage('Invite info copied to clipboard');
    resetStatus();
  };

  const canRotate = factory.lifecycle === FactoryLifecycle.ACTIVE && factory.ceremony === FactoryCeremony.COMPLETE && !factory.rotation_in_progress;
  const canClose = factory.lifecycle === FactoryLifecycle.ACTIVE;
  const canForceClose = factory.lifecycle !== FactoryLifecycle.EXPIRED;
  const canOpenChannels = factory.lifecycle === FactoryLifecycle.ACTIVE && factory.ceremony === FactoryCeremony.COMPLETE;
  const canInvite = factory.is_lsp && factory.lifecycle === FactoryLifecycle.ACTIVE;

  return (
    <Card className='h-100 d-flex align-items-stretch px-4 pt-4 pb-3' data-testid='factory-detail'>
      <Card.Header className='px-1 pb-2 p-0 d-flex justify-content-between align-items-center'>
        <span className='fs-18px fw-bold text-dark'>Factory Detail</span>
        <button className='btn btn-sm btn-outline-secondary btn-rounded' onClick={onClose}>Back</button>
      </Card.Header>
      <Card.Body className='py-2 px-1 factory-detail-scroll'>
        <Row className='mb-2'>
          <Col xs={12}>
            <div className='fs-7 text-light'>Instance ID</div>
            <OverlayTrigger placement='auto' overlay={<Tooltip>Click to copy</Tooltip>}>
              <div
                className='fw-bold text-dark fs-7 cursor-pointer text-break'
                onClick={() => copyTextToClipboard(factory.instance_id)}
              >
                {factory.instance_id}
              </div>
            </OverlayTrigger>
          </Col>
        </Row>

        <Row className='mb-2'>
          <Col xs={12}>
            <CeremonyProgress ceremony={factory.ceremony} />
          </Col>
        </Row>

        <Row className='mb-2'>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Lifecycle</div>
            <div className='fw-bold text-dark'>{factory.lifecycle}</div>
          </Col>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Role</div>
            <div className='fw-bold text-dark'>{factory.is_lsp ? 'LSP' : 'Client'}</div>
          </Col>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Clients</div>
            <div className='fw-bold text-dark'>{factory.n_clients}</div>
          </Col>
        </Row>

        <Row className='mb-2'>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Epoch</div>
            <div className='fw-bold text-dark'>{factory.epoch} / {factory.max_epochs}</div>
          </Col>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Channels</div>
            <div className='fw-bold text-dark'>{factory.n_channels}</div>
          </Col>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Rotation</div>
            <div className='fw-bold text-dark'>{factory.rotation_in_progress ? 'In Progress' : 'None'}</div>
          </Col>
        </Row>

        <Row className='mb-2'>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Creation Block</div>
            <div className='fw-bold text-dark'>{factory.creation_block}</div>
          </Col>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Expiry Block</div>
            <div className='fw-bold text-dark'>{factory.expiry_block}</div>
          </Col>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Breach Epochs</div>
            <div className={'fw-bold ' + (factory.n_breach_epochs > 0 ? 'text-danger' : 'text-dark')}>{factory.n_breach_epochs}</div>
          </Col>
        </Row>

        <Row className='mb-2'>
          <Col xs={6} md={4}>
            <div className='fs-7 text-light'>Dist TX Status</div>
            <div className='fw-bold text-dark'>{factory.dist_tx_status || 'N/A'}</div>
          </Col>
          <Col xs={6} md={8}>
            <div className='fs-7 text-light'>Funding TXID</div>
            <OverlayTrigger placement='auto' overlay={<Tooltip>Click to copy</Tooltip>}>
              <div
                className='fw-bold text-dark fs-7 cursor-pointer text-break'
                onClick={() => copyTextToClipboard(factory.funding_txid)}
              >
                {factory.funding_txid ? `${factory.funding_txid}:${factory.funding_outnum}` : 'N/A'}
              </div>
            </OverlayTrigger>
          </Col>
        </Row>

        {factory.channels && factory.channels.length > 0 && (
          <Row className='mb-2'>
            <Col xs={12}>
              <div className='fs-7 text-light fw-bold mb-1'>Factory Channels</div>
              <ListGroup variant='flush' className='fs-7'>
                {factory.channels.map((ch, idx) => (
                  <ListGroup.Item key={ch.channel_id || idx} className='px-0 py-1 d-flex justify-content-between'>
                    <OverlayTrigger placement='auto' overlay={<Tooltip>Click to copy</Tooltip>}>
                      <span className='text-dark cursor-pointer' onClick={() => copyTextToClipboard(ch.channel_id)}>
                        {ch.channel_id.substring(0, 20)}...
                      </span>
                    </OverlayTrigger>
                    <span className='text-light'>leaf {ch.leaf_index} ({ch.leaf_side})</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )}

        {factory.tree_nodes && (
          <Row className='mb-2'>
            <Col xs={12}>
              {typeof factory.tree_nodes === 'number' ? (
                <div className='fs-7 text-light'>Tree Nodes: <span className='fw-bold text-dark'>{factory.tree_nodes}</span></div>
              ) : Array.isArray(factory.tree_nodes) && factory.tree_nodes.length > 0 ? (
                <>
                  <div className='fs-7 text-light fw-bold mb-1'>Tree Nodes ({factory.tree_nodes.length})</div>
                  <ListGroup variant='flush' className='fs-7'>
                    {factory.tree_nodes.map((node, idx) => (
                      <ListGroup.Item key={idx} className='px-0 py-1 d-flex justify-content-between'>
                        <span className='text-dark'>#{node.node_idx} {node.type}</span>
                        {node.txid && (
                          <OverlayTrigger placement='auto' overlay={<Tooltip>Click to copy TXID</Tooltip>}>
                            <span className='text-light cursor-pointer' onClick={() => copyTextToClipboard(node.txid!)}>
                              {node.txid.substring(0, 16)}...
                            </span>
                          </OverlayTrigger>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              ) : null}
            </Col>
          </Row>
        )}

        {responseStatus !== CallStatus.NONE && (
          <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
        )}
      </Card.Body>
      <Card.Footer className='d-flex justify-content-center flex-wrap gap-2'>
        {canOpenChannels && (
          <button className='btn-rounded bg-success btn-sm' onClick={handleOpenChannels} disabled={responseStatus === CallStatus.PENDING}>
            Open Channels
          </button>
        )}
        {canRotate && (
          <button className='btn-rounded bg-primary btn-sm' onClick={handleRotate} disabled={responseStatus === CallStatus.PENDING}>
            Rotate
          </button>
        )}
        {canInvite && (
          <button className='btn btn-rounded btn-secondary btn-sm' onClick={handleInvite} disabled={responseStatus === CallStatus.PENDING}>
            Invite
          </button>
        )}
        {canClose && (
          <button className='btn-rounded bg-warning btn-sm' onClick={handleClose} disabled={responseStatus === CallStatus.PENDING}>
            Close
          </button>
        )}
        {canForceClose && (
          <button className='btn-rounded bg-danger btn-sm' onClick={handleForceClose} disabled={responseStatus === CallStatus.PENDING}>
            Force Close
          </button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default FactoryDetail;
