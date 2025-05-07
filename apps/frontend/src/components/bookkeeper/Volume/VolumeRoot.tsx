import './VolumeRoot.scss';
import { Card, Row, Col } from 'react-bootstrap';
import VolumeGraph from './VolumeGraph/VolumeGraph';
import { CloseSVG } from '../../../svgs/Close';
import { useNavigate } from 'react-router-dom';

const VolumeRoot = props => {
  const navigate = useNavigate();

  return (
    <div data-testid='volume-container' className='volume-container'>
      <Card className='h-100 p-3 pb-4'>
        <Card.Header className='fs-5 fw-bold text-dark mb-2'>
          <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={9} className='fs-4 fw-bold'>Volume Chart</Col>
            <Col className='text-end'>
              <span
                className='span-close-svg'
                onClick={() => {
                  navigate('..');
                }}
              >
                <CloseSVG />
              </span>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className='pb-4 d-flex flex-column align-items-center'>
          <Col xs={12} className='volume-graph-container'>
           <VolumeGraph />
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VolumeRoot;
