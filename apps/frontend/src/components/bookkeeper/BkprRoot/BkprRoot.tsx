import React from 'react';

import './BkprRoot.scss';
import { ActionSVG } from '../../../svgs/Action';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Bookkeeper() {
  const navigate = useNavigate();
  return (
    <div data-testid='bookkeeper-container'>
      <Card className='d-flex align-items-stretch inner-box-shadow'>
        <Card.Body className='text-dark d-flex align-items-stretch flex-column pt-4'>
          <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
            <div className='fs-4 p-0 ps-3 fw-bold text-dark'>
              Bookkeeper
            </div>
          </Card.Header>
          <Card.Body className='pb-0 px-1 d-flex flex-column align-items-start justify-content-between'>
            <Row className='px-3 cards-container'>
              <Col xs={12}>
                Coming Soon!!!
                <button tabIndex={1} type='submit' className='mt-5 btn-rounded bg-primary' onClick={() => navigate('/cln')}>
                  Home<ActionSVG className='ms-3' />
                </button>
                <button tabIndex={1} type='submit' className='mt-5 btn-rounded bg-primary' onClick={() => navigate('/bookkeeper/balancesheet')}>
                  Balance Sheet<ActionSVG className='ms-3' />
                </button>
                <button tabIndex={2} type='submit' className='mt-5 btn-rounded bg-primary' onClick={() => navigate('/bookkeeper/satsflow')}>
                  Sats Flow<ActionSVG className='ms-3' />
                </button>
                <button tabIndex={2} type='submit' className='mt-5 btn-rounded bg-primary' onClick={() => navigate('/bookkeeper/volume')}>
                  Volume<ActionSVG className='ms-3' />
                </button>                
                <button tabIndex={3} type='submit' className='mt-5 btn-rounded bg-primary' onClick={() => navigate('/bookkeeper/terminal')}>
                  Terminal<ActionSVG className='ms-3' />
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Bookkeeper;
