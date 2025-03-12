import React from 'react';

import './CapacityCard.scss';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CapacityCard = (props) => {
  const navigate = useNavigate();

  return (
    <Card className='h-100 d-flex align-items-stretch' data-testid='capacity-card'>
      <Card.Body className='bg-primary capacity-card'></Card.Body>
      <Card.Footer className='d-flex justify-content-center'>
        <Button tabIndex={4} type='button' variant='primary' className='btn-rounded' onClick={() => navigate('./lsps')} >
          Top-Up
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default CapacityCard;
