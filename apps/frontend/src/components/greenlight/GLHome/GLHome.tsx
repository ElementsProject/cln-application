import React, { useContext } from 'react';

import './GLHome.scss';
import { Row, Col } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { Loading } from '../../ui/Loading/Loading';
import GLHeader from '../GLHeader/GLHeader';
import CapacityCard from '../CapacityCard/CapacityCard';
import PaymentsList from '../PaymentsList/PaymentsList';
import { GLContext } from '../../../store/GLContext';
import { RootContext } from '../../../store/RootContext';

function GLHome() {
  const location = useLocation();
  const rootCtx = useContext(RootContext);
  const glCtx = useContext(GLContext);

  if (rootCtx.authStatus.isAuthenticated && glCtx.nodeInfo.isLoading) {
    return (<Loading />);
  }

  if (glCtx.nodeInfo.error) {
    return (
      <Row className='message invalid mt-10'>
        <Col xs={12} className='d-flex align-items-center justify-content-center'>
          {glCtx.nodeInfo.error}
        </Col>
      </Row>
    );
  }

  return (
    <>
      <div data-testid='gl-container'>
        <GLHeader />
        <Outlet />
      </div>
      {location.pathname === '/gl' && (
        <>
        <Row className='px-3'>
          <Col xs={12} lg={6}>
            <CapacityCard direction='receive' />
          </Col>
          <Col xs={12} lg={6}>
            <CapacityCard direction='send' />
          </Col>
        </Row>
        <Row className='px-3'>
          <Col xs={12} className='cards-container'>
            <PaymentsList />
          </Col>
        </Row>
        </>
      )}
    </>
  );
}

export default GLHome;
