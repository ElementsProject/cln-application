import './Overview.scss';
import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Card, Col, Row, Spinner, Alert } from 'react-bootstrap';

import useBreakpoint from '../../../hooks/use-breakpoint';
import { Breakpoints, COUNTUP_DURATION } from '../../../utilities/constants';
import { BalanceSVG } from '../../../svgs/Balance';
import { PeersSVG } from '../../../svgs/Peers';
import { CapacitySVG } from '../../../svgs/Capacity';
import { ChannelsSVG } from '../../../svgs/Channels';
import CurrencyBox from '../../shared/CurrencyBox/CurrencyBox';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectListChannels, selectListPeers, selectWalletBalances } from '../../../store/rootSelectors';

const Overview = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const walletBalances = useSelector(selectWalletBalances);
  const listPeers = useSelector(selectListPeers);
  const listChannels = useSelector(selectListChannels);
  const currentScreenSize = useBreakpoint();
  const countChannels: any = useMotionValue(0);
  let roundedChannels: any = useTransform(countChannels, Math.round);
  const countPeers: any = useMotionValue(0);
  const roundedPeers: any = useTransform(countPeers, Math.round);

  useEffect(() => {
    if (listChannels.activeChannels?.length > 0 && countChannels.prev === 0) {
      countChannels.current = 0;
      countChannels.prev = 0;
      const animationChannels = animate(countChannels, listChannels.activeChannels?.length, { duration: COUNTUP_DURATION });
      return animationChannels.stop;
    } else {
      countChannels.current = listChannels.activeChannels?.length;
      const animationChannels = animate(countChannels, listChannels.activeChannels?.length, { duration: COUNTUP_DURATION });
      return animationChannels.stop;
    }
  }, [listChannels.activeChannels, countChannels]);

  useEffect(() => {
    if (listPeers.peers && listPeers.peers.length && listPeers.peers.length > 0
      && countPeers.prev === 0) {
      countPeers.current = 0;
      countPeers.prev = 0;
      const animationPeers = animate(countPeers, listPeers.peers.length, { duration: COUNTUP_DURATION });
      return animationPeers.stop;
    }
  }, [listPeers.peers, countPeers]);

  return (
    <Row className='mx-1 align-items-stretch'>
      <Col xs={12} lg={3} className='d-lg-flex d-xl-flex mb-4'>
        <Card className='card overview-balance-card' data-testid='overview-balance-card'>
          <Card.Body className='d-flex align-items-center'>
            <Row className='flex-fill'>
              <Col xs={6} lg={8} xxl={6} data-testid='overview-total-balance-col'>
                <div className='fs-6 fw-bold' data-testid='overview-total-balance-container'>Total Balance</div>
                { isAuthenticated && walletBalances.isLoading ? 
                  <Spinner animation='grow' variant='secondary' data-testid='overview-total-spinner'/> : 
                  walletBalances.error ? 
                    <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='overview-total-error'>{walletBalances.error}</Alert> : 
                    <CurrencyBox value={(walletBalances.btcSpendableBalance || 0) + (walletBalances.clnLocalBalance || 0)} shorten={false} rootClasses='d-inline-flex flex-column' currencyClasses='lh-1 fs-4 fw-bold' unitClasses='fs-7 fw-bold'></CurrencyBox>
                }
              </Col>
              <Col xs={6} lg={4} xxl={6} className="d-flex align-items-center justify-content-end">
                <BalanceSVG />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} lg={9} className="mb-4">
        <Card className="inner-box-shadow h-100" data-testid='overview-channels-card'>
          <Card.Body className="px-4">
            <Row className='h-100'>
              <Col
                xs={12}
                md={4}
                lg={4}
                className="d-flex align-items-center justify-content-start"
              >
                <div className="d-flex align-items-center justify-content-start">
                  <ChannelsSVG className="me-4" />
                  <div>
                    <div className='text-light-white'>Active Channels</div>
                    <div className='fs-4 fw-bold text-dark-primary'>
                      { isAuthenticated && listChannels.isLoading ? 
                        <Spinner animation='grow' variant='primary' data-testid='overview-active-channels-spinner'/> : 
                        listChannels.error ? 
                          <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='overview-active-channels-error'>{listChannels.error}</Alert> : 
                          <motion.div data-testid='overview-active-channels'>{roundedChannels}</motion.div>
                      }
                    </div>
                  </div>
                </div>
              </Col>
              <Col
                xs={12}
                md={3}
                lg={3}
                className={
                  'd-flex align-items-center justify-content-start ' +
                  (currentScreenSize === Breakpoints.XS || currentScreenSize === Breakpoints.SM
                    ? 'my-5'
                    : '')
                }
              >
                <div className="d-flex align-items-center justify-content-start">
                  <PeersSVG className="me-4" />
                  <div>
                    <div className='text-light-white'>Peers</div>
                    <div className='fs-4 fw-bold text-dark-primary'>
                    { isAuthenticated && listChannels.isLoading ? 
                      <Spinner animation='grow' variant='primary' data-testid='overview-peers-spinner'/> : 
                      listChannels.error ? 
                        <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='overview-peers-error'>{listChannels.error}</Alert> : 
                        <motion.div data-testid='overview-peers'>{roundedPeers}</motion.div>
                    }
                    </div>
                  </div>
                </div>
              </Col>
              <Col
                xs={12}
                md={5}
                lg={5}
                xxl={5}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <CapacitySVG className="me-4" />
                  <Col>
                    <div className='d-flex align-items-center justify-content-between w-100'>
                      <div className='text-light-white'>{(currentScreenSize === Breakpoints.MD || currentScreenSize === Breakpoints.LG) ? 'Max Send' : 'Maximum Send'}</div>
                      { isAuthenticated && walletBalances.isLoading ? 
                          <Spinner animation='grow' variant='primary' data-testid='overview-cln-local-balances-spinner'/> : 
                        walletBalances.error ? 
                          <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='overview-cln-local-balances-error'>{walletBalances.error}</Alert> : 
                          <CurrencyBox value={walletBalances.clnLocalBalance} shorten={true} rootClasses='d-inline-flex flex-row align-items-center' currencyClasses='fw-bold text-dark-primary' unitClasses='fw-bold ms-2 text-dark-primary'></CurrencyBox>
                      }
                    </div>
                    <div className='d-flex align-items-center justify-content-between' data-testid='max-receive-amount'>
                      <div className='text-light-white'>{(currentScreenSize === Breakpoints.MD || currentScreenSize === Breakpoints.LG) ? 'Max Receive' : 'Maximum Receive'}</div>
                      { isAuthenticated && walletBalances.isLoading ? 
                          <Spinner animation='grow' variant='primary' data-testid='overview-cln-remote-balances-spinner'/> : 
                        walletBalances.error ? 
                          <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='overview-cln-remote-balances-error'>{walletBalances.error}</Alert> : 
                          <CurrencyBox value={walletBalances.clnRemoteBalance} shorten={true} rootClasses='d-inline-flex flex-row align-items-center' currencyClasses='fw-bold text-dark-primary' unitClasses='fw-bold ms-2 text-dark-primary'></CurrencyBox>
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
};

export default Overview;
