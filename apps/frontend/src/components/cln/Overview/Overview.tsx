import React from 'react';

import './Overview.scss';
import { useContext, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import useBreakpoint from '../../../hooks/use-breakpoint';
import { Breakpoints, COUNTUP_DURATION } from '../../../utilities/constants';
import { BalanceSVG } from '../../../svgs/Balance';
import { PeersSVG } from '../../../svgs/Peers';
import { CapacitySVG } from '../../../svgs/Capacity';
import { ChannelsSVG } from '../../../svgs/Channels';
import { AppContext } from '../../../store/AppContext';
import CurrencyBox from '../../shared/CurrencyBox/CurrencyBox';

const Overview = () => {
  const appCtx = useContext(AppContext);
  const currentScreenSize = useBreakpoint();
  const countChannels: any = useMotionValue(0);
  const roundedChannels: any = useTransform(countChannels, Math.round);
  const countPeers: any = useMotionValue(0);
  const roundedPeers: any = useTransform(countPeers, Math.round);

  useEffect(() => {
    if (appCtx.listChannels.activeChannels && appCtx.listChannels.activeChannels.length && appCtx.listChannels.activeChannels.length > 0
      && countChannels.prev === 0) {
      countChannels.current = 0;
      countChannels.prev = 0;
      const animationChannels = animate(countChannels, appCtx.listChannels.activeChannels.length, { duration: COUNTUP_DURATION });
      return animationChannels.stop;
    }
  }, [appCtx.listChannels.activeChannels, countChannels]);

  useEffect(() => {
    if (appCtx.listPeers.peers && appCtx.listPeers.peers.length && appCtx.listPeers.peers.length > 0
      && countPeers.prev === 0) {
      countPeers.current = 0;
      countPeers.prev = 0;
      const animationPeers = animate(countPeers, appCtx.listPeers.peers.length, { duration: COUNTUP_DURATION });
      return animationPeers.stop;
    }
  }, [appCtx.listPeers.peers, countPeers]);

  return (
    <Row className='mx-1'>
      <Col xs={12} lg={3} className='d-lg-flex d-xl-flex mb-4'>
        <Card className='ps-2 bg-primary flex-grow-1 inner-box-shadow'>
          <Card.Body className='d-flex align-items-center'>
            <Row className='flex-fill'>
              <Col xs={6} lg={8} xxl={6}>
                <div className='fs-6 fw-bold'>Total Balance</div>
                { appCtx.isAuthenticated && appCtx.walletBalances.isLoading ? 
                  <Spinner animation='grow' variant='secondary' /> : 
                  appCtx.walletBalances.error ? 
                    <Alert className='py-0 px-1 fs-7' variant='danger'>{appCtx.walletBalances.error}</Alert> : 
                    <CurrencyBox value={(appCtx.walletBalances.btcSpendableBalance || 0) + (appCtx.walletBalances.clnLocalBalance || 0)} shorten={false} rootClasses='d-inline-flex flex-column' currencyClasses='lh-1 fs-4 fw-bold' unitClasses='fs-7 fw-bold'></CurrencyBox>
                }
              </Col>
              <Col xs={6} lg={4} xxl={6} className='d-flex align-items-center justify-content-end'>
                <BalanceSVG />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} lg={9} className='mb-4'>
        <Card className='inner-box-shadow'>
          <Card.Body className='px-4'>
            <Row>
              <Col xs={12} md={4} lg={4} className='d-flex align-items-center justify-content-start'>
                <div className='d-flex align-items-center justify-content-start'>
                  <ChannelsSVG className='me-4' />
                  <div>
                    <div className='text-light-white'>Active Channels</div>
                    <div className='fs-4 fw-bold text-dark-primary'>
                      { appCtx.isAuthenticated && appCtx.listChannels.isLoading ? 
                        <Spinner animation='grow' variant='primary' /> : 
                        appCtx.listChannels.error ? 
                          <Alert className='py-0 px-1 fs-7' variant='danger'>{appCtx.listChannels.error}</Alert> : 
                          <motion.div>{roundedChannels}</motion.div>
                      }
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={3} lg={3} className={'d-flex align-items-center justify-content-start ' + ((currentScreenSize === Breakpoints.XS || currentScreenSize === Breakpoints.SM) ? 'my-5' : '')}>
                <div className='d-flex align-items-center justify-content-start'>
                  <PeersSVG className='me-4' />
                  <div>
                    <div className='text-light-white'>Peers</div>
                    <div className='fs-4 fw-bold text-dark-primary'>
                    { appCtx.isAuthenticated && appCtx.listPeers.isLoading ? 
                      <Spinner animation='grow' variant='primary' /> : 
                      appCtx.listPeers.error ? 
                        <Alert className='py-0 px-1 fs-7' variant='danger'>{appCtx.listPeers.error}</Alert> : 
                        <motion.div>{roundedPeers}</motion.div>
                    }
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={5} lg={5} xxl={5} className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-between w-100'>
                  <CapacitySVG className='me-4' />
                  <Col>
                    <div className='d-flex align-items-center justify-content-between w-100'>
                      <div className='text-light-white'>{(currentScreenSize === Breakpoints.MD || currentScreenSize === Breakpoints.LG) ? 'Max Send' : 'Maximum Send'}</div>
                      { appCtx.isAuthenticated && appCtx.walletBalances.isLoading ? 
                          <Spinner animation='grow' variant='primary' /> : 
                        appCtx.walletBalances.error ? 
                          <Alert className='py-0 px-1 fs-7' variant='danger'>{appCtx.walletBalances.error}</Alert> : 
                          <CurrencyBox value={appCtx.walletBalances.clnLocalBalance} shorten={true} rootClasses='d-inline-flex flex-row align-items-center' currencyClasses='fw-bold text-dark-primary' unitClasses='fw-bold ms-2 text-dark-primary'></CurrencyBox>
                      }
                    </div>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='text-light-white'>{(currentScreenSize === Breakpoints.MD || currentScreenSize === Breakpoints.LG) ? 'Max Receive' : 'Maximum Receive'}</div>
                      { appCtx.isAuthenticated && appCtx.walletBalances.isLoading ? 
                          <Spinner animation='grow' variant='primary' /> : 
                        appCtx.walletBalances.error ? 
                          <Alert className='py-0 px-1 fs-7' variant='danger'>{appCtx.walletBalances.error}</Alert> : 
                          <CurrencyBox value={appCtx.walletBalances.clnRemoteBalance} shorten={true} rootClasses='d-inline-flex flex-row align-items-center' currencyClasses='fw-bold text-dark-primary' unitClasses='fw-bold ms-2 text-dark-primary'></CurrencyBox>
                      }
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Overview;
