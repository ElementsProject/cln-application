import './LadderingTimeline.scss';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectNodeInfo } from '../../../store/rootSelectors';
import { selectFactories, selectFactoriesLoading } from '../../../store/factoriesSelectors';
import { FactoryLifecycle } from '../../../types/factories.type';

const LadderingTimeline = () => {
  const nodeInfo = useSelector(selectNodeInfo);
  const factories = useSelector(selectFactories);
  const isLoading = useSelector(selectFactoriesLoading);

  const currentBlock = nodeInfo.blockheight || 0;
  const timelineFactories = factories
    .filter(f => f.creation_block > 0 && f.expiry_block > 0)
    .sort((a, b) => a.creation_block - b.creation_block);

  if (isLoading || timelineFactories.length === 0) {
    return null;
  }

  const minBlock = Math.min(...timelineFactories.map(f => f.creation_block));
  const maxBlock = Math.max(...timelineFactories.map(f => f.expiry_block));
  const range = maxBlock - minBlock || 1;

  const getColor = (lifecycle: FactoryLifecycle) => {
    switch (lifecycle) {
      case FactoryLifecycle.ACTIVE: return '#33db95';
      case FactoryLifecycle.INIT: return '#e1ba2d';
      case FactoryLifecycle.DYING: return '#fe8e02';
      case FactoryLifecycle.EXPIRED: return '#dc3545';
      default: return '#6c757d';
    }
  };

  const currentPosition = ((currentBlock - minBlock) / range) * 100;

  return (
    <Card className='inner-box-shadow mb-4' data-testid='laddering-timeline'>
      <Card.Body className='px-4 pt-3 pb-3'>
        <div className='fs-18px fw-bold text-dark mb-3'>Factory Timeline</div>
        <div className='timeline-container'>
          {timelineFactories.map(factory => {
            const left = ((factory.creation_block - minBlock) / range) * 100;
            const width = ((factory.expiry_block - factory.creation_block) / range) * 100;
            return (
              <div key={factory.instance_id} className='timeline-row mb-2'>
                <div className='fs-8 text-light mb-1'>
                  {factory.instance_id.substring(0, 10)}...
                </div>
                <div className='timeline-bar-container'>
                  <div
                    className='timeline-bar'
                    style={{
                      left: `${left}%`,
                      width: `${Math.max(width, 1)}%`,
                      backgroundColor: getColor(factory.lifecycle),
                    }}
                    title={`Blocks ${factory.creation_block} - ${factory.expiry_block} (${factory.lifecycle})`}
                  />
                </div>
              </div>
            );
          })}
          {currentPosition >= 0 && currentPosition <= 100 && (
            <div
              className='timeline-current-marker'
              style={{ left: `${currentPosition}%` }}
              title={`Current: block ${currentBlock}`}
            />
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LadderingTimeline;
