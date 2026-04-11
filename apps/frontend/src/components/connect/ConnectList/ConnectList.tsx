import './ConnectList.scss';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Card, Row, Col, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUIConfigUnit, selectFiatConfig } from '../../../store/rootSelectors';
import { Units, BTC_SATS } from '../../../utilities/constants';
import { CoordinationFactory, SAMPLE_COORDINATION_FACTORIES } from '../../../types/coordination.type';
import { copyTextToClipboard } from '../../../utilities/data-formatters';

type SortFilter = 'all' | 'forming' | 'rotating';
type JoinStatus = 'requested' | 'confirmed';

const blocksToApproxDays = (blocks: number): string => {
  const days = Math.round(blocks * 10 / 60 / 24);
  if (days < 1) return '<1 day';
  return `~${days} day${days !== 1 ? 's' : ''}`;
};

const ConnectList = () => {
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  const [sortFilter, setSortFilter] = useState<SortFilter>('all');
  const [joinRequests, setJoinRequests] = useState<Record<string, JoinStatus>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const formatSats = (sats: number): string => {
    if (uiConfigUnit === Units.BTC) {
      return `${(sats / BTC_SATS).toFixed(6)} BTC`;
    }
    return `${sats.toLocaleString()} sats`;
  };

  const sorted = [...SAMPLE_COORDINATION_FACTORIES]
    .filter(f => sortFilter === 'all' || f.status === sortFilter)
    .sort((a, b) => {
      if (sortFilter !== 'all') return 0;
      if (a.status === 'forming' && b.status !== 'forming') return -1;
      if (a.status !== 'forming' && b.status === 'forming') return 1;
      return 0;
    });

  const handleRowClick = (id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  const handleJoin = () => {
    if (!selectedId || joinRequests[selectedId]) return;
    setJoinRequests(prev => ({ ...prev, [selectedId]: 'requested' }));
  };

  const handleCancel = () => {
    if (!selectedId || joinRequests[selectedId] !== 'requested') return;
    setJoinRequests(prev => {
      const next = { ...prev };
      delete next[selectedId];
      return next;
    });
  };

  const selectedStatus = selectedId ? joinRequests[selectedId] : undefined;
  const canJoin = !!selectedId && !selectedStatus;
  const canCancel = !!selectedId && selectedStatus === 'requested';

  return (
    <Card className='h-100 d-flex align-items-stretch px-4 pt-4 pb-3' data-testid='connect-list'>
      <Card.Header className='px-1 pb-2 p-0'>
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <span className='fs-18px fw-bold text-dark'>Open Factories</span>
        </div>
        <div className='d-flex gap-2'>
          {(['all', 'forming', 'rotating'] as SortFilter[]).map(f => (
            <button
              key={f}
              className={`connect-filter-chip btn-rounded btn-sm ${sortFilter === f ? 'bg-primary' : 'bg-secondary'}`}
              onClick={() => setSortFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </Card.Header>

      <Card.Body className='py-0 px-1 channels-scroll-container'>
        {sorted.length === 0 ? (
          <Row className='text-light fs-6 mt-3 h-100 align-items-center justify-content-center'>
            <Row className='text-center pb-4'>No {sortFilter !== 'all' ? sortFilter : ''} factories available right now.</Row>
          </Row>
        ) : (
          <PerfectScrollbar>
            <ListGroup variant='flush' className='fs-7'>
              {sorted.map((factory: CoordinationFactory) => {
                const request = joinRequests[factory.id];
                const isSelected = selectedId === factory.id;
                const perSlotSats = Math.floor(factory.total_capacity_sats / factory.total_slots);

                return (
                  <ListGroup.Item
                    key={factory.id}
                    className={`connect-list-item px-0 py-2 ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleRowClick(factory.id)}
                  >
                    <div className='d-flex justify-content-between align-items-start'>
                      <div className='fw-bold text-dark d-flex align-items-center gap-1'>
                        {factory.lsp_alias}
                        {factory.n_breach_epochs > 0 && (
                          <OverlayTrigger placement='auto' overlay={<Tooltip>{factory.n_breach_epochs} breach epoch(s) on record</Tooltip>}>
                            <span className='badge bg-danger fs-8'>! breach</span>
                          </OverlayTrigger>
                        )}
                      </div>
                      <div className='d-flex align-items-center gap-1'>
                        {request === 'requested' && (
                          <span className='badge bg-warning text-dark'>⏳ Requested</span>
                        )}
                        {request === 'confirmed' && (
                          <span className='badge bg-success'>✓ Confirmed</span>
                        )}
                        <span className={`badge ${factory.status === 'forming' ? 'bg-primary' : 'bg-info text-dark'}`}>
                          {factory.status === 'forming' ? 'Forming' : 'Rotating'}
                        </span>
                      </div>
                    </div>

                    <Row className='text-light mt-1'>
                      <Col xs={4}>
                        <span className='fw-bold text-dark'>{factory.open_slots}</span>/{factory.total_slots} slots
                      </Col>
                      <Col xs={4}>
                        {formatSats(factory.total_capacity_sats)}
                      </Col>
                      <Col xs={4}>
                        {factory.status === 'forming'
                          ? <span className='text-success fw-bold'>open now</span>
                          : <span>opens in {blocksToApproxDays(factory.blocks_until_rotation)}</span>
                        }
                      </Col>
                    </Row>

                    <Row className='text-light'>
                      <Col xs={6}>
                        Min ch: {formatSats(factory.min_channel_sats)}
                      </Col>
                      <Col xs={6}>
                        Per slot: {formatSats(perSlotSats)}
                      </Col>
                    </Row>

                    {isSelected && (
                      <Row className='mt-1'>
                        <Col xs={12}>
                          <OverlayTrigger placement='auto' overlay={<Tooltip>Click to copy LSP pubkey</Tooltip>}>
                            <span
                              className='text-light cursor-pointer connect-disclaimer'
                              onClick={(e) => { e.stopPropagation(); copyTextToClipboard(factory.lsp_pubkey); }}
                            >
                              LSP: {factory.lsp_pubkey.substring(0, 20)}...
                            </span>
                          </OverlayTrigger>
                        </Col>
                      </Row>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <div className='connect-disclaimer text-center mt-2 mb-1 px-2'>
              Sample data — coordination server coming soon
            </div>
          </PerfectScrollbar>
        )}
      </Card.Body>

      <Card.Footer className='d-flex justify-content-center gap-2'>
        <button
          className='btn-rounded bg-primary btn-sm'
          onClick={handleJoin}
          disabled={!canJoin}
        >
          Join Factory
        </button>
        <button
          className='btn-rounded bg-secondary btn-sm'
          onClick={handleCancel}
          disabled={!canCancel}
        >
          Cancel Request
        </button>
      </Card.Footer>
    </Card>
  );
};

export default ConnectList;
