import React from 'react';

import './CLNHome.scss';
import { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { AppContext } from '../../../store/AppContext';
import Overview from '../Overview/Overview';
import BTCCard from '../BTCCard/BTCCard';
import CLNCard from '../CLNCard/CLNCard';
import ChannelsCard from '../ChannelsCard/ChannelsCard';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../ui/Header/Header';
import { Loading } from '../../ui/Loading/Loading';

function CLNHome() {
  const location = useLocation();
  const appCtx = useContext(AppContext);
  if (appCtx.authStatus.isAuthenticated && appCtx.nodeInfo.isLoading) {
    return (<Loading />);
  }

  if (appCtx.nodeInfo.error) {
    return (
      <Row className='message invalid mt-10'>
        <Col xs={12} className='d-flex align-items-center justify-content-center'>
          {appCtx.nodeInfo.error}
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
