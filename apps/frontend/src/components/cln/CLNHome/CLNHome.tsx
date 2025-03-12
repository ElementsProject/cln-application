import React from 'react';

import './CLNHome.scss';
import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';

import { CLNContext } from '../../../store/CLNContext';
import Overview from '../Overview/Overview';
import BTCCard from '../BTCCard/BTCCard';
import CLNCard from '../CLNCard/CLNCard';
import ChannelsCard from '../ChannelsCard/ChannelsCard';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../ui/Header/Header';
import { EmptyHome } from '../../ui/Loading/Loading';
import { RootContext } from '../../../store/RootContext';

function CLNHome() {
  const location = useLocation();
  const rootCtx = useContext(RootContext);
  const clnCtx = useContext(CLNContext);

  if (!rootCtx.authStatus.isAuthenticated || (rootCtx.authStatus.isAuthenticated && clnCtx.nodeInfo.isLoading)) {
    return (<EmptyHome />);
  }

  if (clnCtx.nodeInfo.error) {
    return (
      <Row className='message invalid mt-10'>
        <Col xs={12} className='d-flex align-items-center justify-content-center'>
          {clnCtx.nodeInfo.error}
        </Col>
      </Row>
    );
  }

  return (
    <>
      <div data-testid='cln-container'>
        <Header />
        <Outlet />
      </div>
      {location.pathname === '/cln' && (
        <>
        <Row>
          <Col className='mx-1'>
            <Overview />
          </Col>
        </Row>
        <Row className='px-3'>
          <Col xs={12} lg={4} className='cards-container'>
            <BTCCard />
          </Col>
          <Col xs={12} lg={4} className='cards-container'>
            <CLNCard />
          </Col>
          <Col xs={12} lg={4} className='cards-container'>
            <ChannelsCard />
          </Col>
        </Row>
        </>
      )}
    </>
  );
}

export default CLNHome;
