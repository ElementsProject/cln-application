import React from 'react';

import './GLRoot.scss';
import { ActionSVG } from '../../../svgs/Action';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

function Greenlight() {
  const navigate = useNavigate();
  return (
    <div data-testid='greenlight-container'>
      <Card className='d-flex align-items-stretch inner-box-shadow'>
        <Card.Body className='text-dark d-flex align-items-stretch flex-column pt-4'>
          <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
            <div className='fs-4 p-0 ps-3 fw-bold text-dark'>
              Greenlight
            </div>
          </Card.Header>
          <Card.Body className='pb-0 px-1 d-flex flex-column align-items-start justify-content-between'>
            <Row className='px-3 cards-container'>
              <Col xs={12}>
                Coming Soon!!!
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className='d-flex justify-content-center'>
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Greenlight;
