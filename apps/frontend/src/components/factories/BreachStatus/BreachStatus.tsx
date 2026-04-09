import './BreachStatus.scss';
import { Card, ListGroup, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectFactories, selectFactoriesLoading } from '../../../store/factoriesSelectors';

const BreachStatus = () => {
  const factories = useSelector(selectFactories);
  const isLoading = useSelector(selectFactoriesLoading);

  const breachedFactories = factories.filter(f => f.n_breach_epochs > 0);

  return (
    <Card className='inner-box-shadow mb-4' data-testid='breach-status'>
      <Card.Body className='px-4 pt-3 pb-2'>
        <div className='fs-18px fw-bold text-dark mb-2'>Breach Status</div>
        {isLoading ? null :
          breachedFactories.length === 0 ? (
            <div className='fs-7 text-light py-2'>No breaches detected</div>
          ) : (
            <ListGroup variant='flush'>
              {breachedFactories.map(factory => (
                <ListGroup.Item key={factory.instance_id} className='px-0 py-2'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <span className='fs-7 text-dark'>
                      {factory.instance_id.substring(0, 16)}...
                    </span>
                    <Alert variant='danger' className='py-0 px-2 mb-0 fs-7'>
                      {factory.n_breach_epochs} breach epoch{factory.n_breach_epochs > 1 ? 's' : ''}
                    </Alert>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )
        }
      </Card.Body>
    </Card>
  );
};

export default BreachStatus;
