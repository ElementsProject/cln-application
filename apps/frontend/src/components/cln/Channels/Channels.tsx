import React from 'react';

import './Channels.scss';
import { useContext } from 'react';
import { motion } from "framer-motion";
import PerfectScrollbar from 'react-perfect-scrollbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { AppContext } from '../../../store/AppContext';
import { formatCurrency, titleCase } from '../../../utilities/data-formatters';
import { ActionSVG } from '../../../svgs/Action';
import { ApplicationModes, STAGERRED_SPRING_VARIANTS_3, Units } from '../../../utilities/constants';
import { NoChannelLightSVG } from '../../../svgs/NoChannelLight';
import { NoChannelDarkSVG } from '../../../svgs/NoChannelDark';

const Channels = (props) => {
  const appCtx = useContext(AppContext);
  const allChannelsMerged = [...(appCtx.channels.activeChannels || []), ...(appCtx.channels.pendingChannels || []), ...(appCtx.channels.inactiveChannels || [])];

  return (
    <Card className='h-100 d-flex align-items-stretch px-4 pt-4 pb-3' data-testid='channels'>
      <Card.Header className='px-1 fs-18px p-0 fw-bold text-dark'>Payment Channels</Card.Header>
      <Card.Body className='py-0 px-1 channels-scroll-container'>
        { appCtx.authStatus.isAuthenticated && appCtx.channels.isLoading ? 
            <span className='h-100 d-flex justify-content-center align-items-center'>
              <Spinner animation='grow' variant='primary' data-testid='channels-spinner'/>
            </span> 
          :
          appCtx.channels.error ? 
            <Alert className='fs-8' variant='danger' data-testid='channels-error'>{appCtx.channels.error}</Alert> : 
            allChannelsMerged && allChannelsMerged.length && allChannelsMerged.length > 0 ?
              <PerfectScrollbar className='ps-show-always'>
                <ListGroup as='ul' variant='flush' className='list-channels'>
                  {allChannelsMerged.map((channel, idx) => (
                    <motion.li
                      key={channel.short_channel_id || channel.node_alias || idx}
                      className={'list-group-item list-item-channel ' + (props.newlyOpenedChannelId === channel.channel_id ? 'newly-opened' : '')}
                      variants={props.newlyOpenedChannelId === channel.channel_id ? STAGERRED_SPRING_VARIANTS_3 : {}} initial='hidden' animate='visible' exit='hidden' custom={0}
                      onClick={() => (props.onChannelClick(channel))}
                    >
                      <div className='flex-fill text-dark'>
                        <>
                          <div className='fw-bold'>
                            <OverlayTrigger
                              placement='auto'
                              delay={{ show: 250, hide: 250 }}
                              overlay={<Tooltip>{titleCase(channel.current_state)}</Tooltip>}
                              >
                              <span>
                                <div className={'d-inline-block mx-1 dot ' + (channel.current_state === 'ACTIVE' ? 'bg-success' : channel.current_state === 'PENDING' ? 'bg-warning' : 'bg-danger')}></div>
                                {channel.node_alias}
                              </span>
                            </OverlayTrigger>
                          </div>
                          <ProgressBar>
                            <ProgressBar variant='primary' now={(channel.satoshi_to_us > 1000000 || channel.satoshi_to_them > 1000000) ? (channel.satoshi_to_us / 1000) : channel.satoshi_to_us} key={1} />
                            <ProgressBar variant='light' now={(channel.satoshi_to_us > 1000000 || channel.satoshi_to_them > 1000000) ? (channel.satoshi_to_them / 1000) : channel.satoshi_to_them} key={2} />
                          </ProgressBar>
                          <Row className='text-light d-flex align-items-end justify-content-between'>
                            <Col xs={6} className='fs-7 fw-bold d-flex justify-content-start text-primary'>
                              {formatCurrency(channel.satoshi_to_us, Units.SATS, appCtx.appConfig.unit, false, 5, 'string')} {appCtx.appConfig.unit}
                            </Col>
                            <Col xs={6} className='fs-7 fw-bold d-flex justify-content-end'>
                              {formatCurrency(channel.satoshi_to_them, Units.SATS, appCtx.appConfig.unit, false, 5, 'string')} {appCtx.appConfig.unit}
                            </Col>
                          </Row>
                        </>
                      </div>
                    </motion.li>
                  ))}
                </ListGroup>
              </PerfectScrollbar>
            :
              <Row className='text-light fs-6 mt-3 h-100 mt-2 align-items-center justify-content-center'>
                <Row className='d-flex align-items-center justify-content-center'>
                  { appCtx.appConfig.appMode === ApplicationModes.DARK ? 
                    <NoChannelDarkSVG className='no-channel-dark mt-5 pb-1' /> :
                    <NoChannelLightSVG className='no-channel-light mt-5 pb-1' />
                  }
                  <Row className='text-center pb-4'>No channel found. Open channel to start!</Row>
                </Row>
              </Row>
        }
      </Card.Body>
      <Card.Footer className='d-flex justify-content-center'>
        <button tabIndex={1} className='btn-rounded bg-primary' onClick={props.onOpenChannel}>
          Open Channel
          <ActionSVG className='ms-3' />
        </button>
      </Card.Footer>
    </Card>
  );
};

export default Channels;
