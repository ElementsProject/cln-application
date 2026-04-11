import './FactoryList.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Spinner, Card, Row, Col, ListGroup, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ActionSVG } from '../../../svgs/Action';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../../store/rootSelectors';
import { selectFactories, selectFactoriesLoading, selectFactoriesError } from '../../../store/factoriesSelectors';
import { Factory, FactoryLifecycle } from '../../../types/factories.type';

const SectionHeader = ({ label, count }: { label: string; count: number }) => (
  <div className='factory-section-header d-flex align-items-center gap-2 px-0 py-2'>
    <span className='factory-section-label fw-bold fs-7'>{label}</span>
    <span className='badge bg-secondary rounded-pill'>{count}</span>
  </div>
);

const lifecycleBadge = (lifecycle: FactoryLifecycle) => {
  switch (lifecycle) {
    case FactoryLifecycle.ACTIVE: return 'bg-success';
    case FactoryLifecycle.INIT: return 'bg-warning';
    case FactoryLifecycle.DYING: return 'bg-warning';
    case FactoryLifecycle.EXPIRED: return 'bg-danger';
    default: return 'bg-secondary';
  }
};

type FactoryListProps = {
  onCreateFactory: () => void;
  onFactoryClick: (factory: Factory) => void;
};

const FactoryListItem = ({ factory, onClick }: { factory: Factory; onClick: () => void }) => (
  <li
    className='list-group-item list-item-channel cursor-pointer'
    onClick={onClick}
    data-testid='list-item-factory'
  >
    <div className='list-item-div flex-fill text-dark'>
      <div className='d-flex align-items-center justify-content-between'>
        <div className='fw-bold'>
          <OverlayTrigger
            placement='auto'
            delay={{ show: 250, hide: 250 }}
            overlay={<Tooltip>{factory.lifecycle} - {factory.ceremony}</Tooltip>}
          >
            <span>
              <div className={'d-inline-block mx-1 dot ' + lifecycleBadge(factory.lifecycle)}></div>
              {factory.instance_id.substring(0, 16)}...
            </span>
          </OverlayTrigger>
        </div>
        <span className={'badge bg-' + (factory.lifecycle === 'active' ? 'success' : factory.ceremony === 'complete' ? 'primary' : 'secondary')}>
          {factory.lifecycle === 'active' ? 'Active' : factory.ceremony === 'complete' ? 'Signed' : factory.ceremony}
        </span>
      </div>
      <Row className='text-light fs-7 mt-1'>
        <Col xs={3}>
          <span className='fw-bold text-dark'>{factory.n_channels}</span> ch
        </Col>
        <Col xs={3}>
          <span className='fw-bold text-dark'>{factory.n_clients}</span> clients
        </Col>
        <Col xs={3}>
          Ep <span className='fw-bold text-dark'>{factory.epoch}/{factory.max_epochs || '?'}</span>
        </Col>
        <Col xs={3}>
          <span className='fw-bold text-dark'>{typeof factory.tree_nodes === 'number' ? factory.tree_nodes : Array.isArray(factory.tree_nodes) ? factory.tree_nodes.length : 0}</span> nodes
        </Col>
      </Row>
    </div>
  </li>
);

const FactoryList = (props: FactoryListProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const factories = useSelector(selectFactories);
  const isLoading = useSelector(selectFactoriesLoading);
  const error = useSelector(selectFactoriesError);

  const hosted = factories ? factories.filter(f => f.is_lsp) : [];
  const joined = factories ? factories.filter(f => !f.is_lsp) : [];

  return (
    <Card className='h-100 d-flex align-items-stretch px-4 pt-4 pb-3' data-testid='factory-list'>
      <Card.Header className='px-1 pb-2 fs-18px p-0 fw-bold text-dark'>Channel Factories</Card.Header>
      <Card.Body className='py-0 px-1 channels-scroll-container'>
        {isAuthenticated && isLoading ?
          <span className='h-100 d-flex justify-content-center align-items-center'>
            <Spinner animation='grow' variant='primary' />
          </span>
          :
          error ?
            <Alert className='fs-8' variant='danger'>{error}</Alert> :
            factories && factories.length > 0 ?
              <PerfectScrollbar>
                {hosted.length > 0 && (
                  <>
                    <SectionHeader label='HOSTING' count={hosted.length} />
                    <ListGroup as='ul' variant='flush' className='list-channels mb-2'>
                      {hosted.map((factory, idx) => (
                        <FactoryListItem
                          key={factory.instance_id || idx}
                          factory={factory}
                          onClick={() => props.onFactoryClick(factory)}
                        />
                      ))}
                    </ListGroup>
                  </>
                )}
                {joined.length > 0 && (
                  <>
                    <SectionHeader label='JOINED' count={joined.length} />
                    <ListGroup as='ul' variant='flush' className='list-channels'>
                      {joined.map((factory, idx) => (
                        <FactoryListItem
                          key={factory.instance_id || idx}
                          factory={factory}
                          onClick={() => props.onFactoryClick(factory)}
                        />
                      ))}
                    </ListGroup>
                  </>
                )}
              </PerfectScrollbar>
              :
              <Row className='text-light fs-6 mt-3 h-100 mt-2 align-items-center justify-content-center'>
                <Row className='d-flex align-items-center justify-content-center'>
                  <Row className='text-center pb-4'>No factories found. Create a factory to start!</Row>
                </Row>
              </Row>
        }
      </Card.Body>
      <Card.Footer className='d-flex justify-content-center'>
        <button tabIndex={1} className='btn-rounded bg-primary' onClick={props.onCreateFactory} data-testid='button-create-factory'>
          Host Factory
          <ActionSVG className='ms-3' />
        </button>
      </Card.Footer>
    </Card>
  );
};

export default FactoryList;
