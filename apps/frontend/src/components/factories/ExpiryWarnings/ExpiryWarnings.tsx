import './ExpiryWarnings.scss';
import { Card, ListGroup, ProgressBar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectNodeInfo } from '../../../store/rootSelectors';
import { selectFactories, selectFactoriesLoading } from '../../../store/factoriesSelectors';
import { FactoryLifecycle } from '../../../types/factories.type';

const ExpiryWarnings = () => {
  const nodeInfo = useSelector(selectNodeInfo);
  const factories = useSelector(selectFactories);
  const isLoading = useSelector(selectFactoriesLoading);

  const currentBlock = nodeInfo.blockheight || 0;
  const activeFactories = factories
    .filter(f => f.lifecycle !== FactoryLifecycle.EXPIRED && f.expiry_block > 0)
    .sort((a, b) => a.expiry_block - b.expiry_block);

  const getWarningLevel = (blocksRemaining: number) => {
    if (blocksRemaining <= 144) return 'danger';   // ~1 day
    if (blocksRemaining <= 432) return 'warning';   // ~3 days
    return 'success';
  };

  const getProgress = (factory: typeof activeFactories[0]) => {
    const total = factory.expiry_block - factory.creation_block;
    const elapsed = currentBlock - factory.creation_block;
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  return (
    <Card className='inner-box-shadow mb-4' data-testid='expiry-warnings'>
      <Card.Body className='px-4 pt-3 pb-2'>
        <div className='fs-18px fw-bold text-dark mb-2'>Factory Expiry</div>
        {isLoading ? null :
          activeFactories.length === 0 ? (
            <div className='fs-7 text-light py-2'>No active factories</div>
          ) : (
            <ListGroup variant='flush'>
              {activeFactories.map(factory => {
                const blocksRemaining = factory.expiry_block - currentBlock;
                const level = getWarningLevel(blocksRemaining);
                const progress = getProgress(factory);
                return (
                  <ListGroup.Item key={factory.instance_id} className='px-0 py-2'>
                    <div className='d-flex justify-content-between align-items-center mb-1'>
                      <span className='fs-7 text-dark'>
                        {factory.instance_id.substring(0, 12)}...
                      </span>
                      <span className={`fs-7 fw-bold text-${level}`}>
                        {blocksRemaining > 0 ? `${blocksRemaining} blocks` : 'Expired'}
                      </span>
                    </div>
                    <ProgressBar
                      now={progress}
                      variant={level}
                      className='expiry-progress'
                    />
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )
        }
      </Card.Body>
    </Card>
  );
};

export default ExpiryWarnings;
