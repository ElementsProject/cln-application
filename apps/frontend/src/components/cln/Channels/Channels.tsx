import './Channels.scss';
import { motion } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Spinner, Card, Row, Col, ListGroup, Alert, ProgressBar, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { formatCurrency, titleCase } from '../../../utilities/data-formatters';
import { ActionSVG } from '../../../svgs/Action';
import { STAGERRED_SPRING_VARIANTS_3, Units } from '../../../utilities/constants';
import { NoChannelLightSVG } from '../../../svgs/NoChannelLight';
import { NoChannelDarkSVG } from '../../../svgs/NoChannelDark';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsDarkMode, selectListChannels, selectUIConfigUnit } from '../../../store/rootSelectors';

const Channels = (props) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const listChannels = useSelector(selectListChannels);
  const allChannelsMerged = [...listChannels.activeChannels, ...listChannels.pendingChannels, ...listChannels.inactiveChannels];

  return (
    <Card className='h-100 d-flex align-items-stretch px-4 pt-4 pb-3' data-testid='channels'>
      <Card.Header className='px-1 fs-18px p-0 fw-bold text-dark'>Payment Channels</Card.Header>
      <Card.Body className='py-0 px-1 channels-scroll-container'>
        { isAuthenticated && listChannels.isLoading ? 
            <span className='h-100 d-flex justify-content-center align-items-center'>
              <Spinner animation='grow' variant='primary' data-testid='channels-spinner'/>
            </span> 
          :
          listChannels.error ? 
            <Alert className='fs-8' variant='danger' data-testid='channels-error'>{listChannels.error}</Alert> : 
            allChannelsMerged && allChannelsMerged.length && allChannelsMerged.length > 0 ?
              <PerfectScrollbar>
                <ListGroup as='ul' variant='flush' className='list-channels'>
                  {allChannelsMerged.map((channel, idx) => (
                    <motion.li
                      data-testid='list-item-channel'
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
                              <span data-testid='channel-node-alias'>
                                <div className={'d-inline-block mx-1 dot ' + (channel.current_state?.toLowerCase() === 'active' ? 'bg-success' : channel.current_state?.toLowerCase() === 'pending' ? 'bg-warning' : 'bg-danger')}></div>
                                {channel.node_alias}
                              </span>
                            </OverlayTrigger>
                          </div>
                          <ProgressBar>
                            <ProgressBar variant='primary' now={(channel.to_us_sat > 1000000 || channel.to_them_sat > 1000000) ? (channel.to_us_sat / 1000) : channel.to_us_sat} key={1} />
                            <ProgressBar variant='light' now={(channel.to_us_sat > 1000000 || channel.to_them_sat > 1000000) ? (channel.to_them_sat / 1000) : channel.to_them_sat} key={2} />
                          </ProgressBar>
                          <Row className='text-light d-flex align-items-end justify-content-between'>
                            <Col xs={6} className='fs-7 fw-bold d-flex justify-content-start text-primary'>
                              {formatCurrency(channel.to_us_sat, Units.SATS, uiConfigUnit, false, 5, 'string')} {uiConfigUnit}
                            </Col>
                            <Col xs={6} className='fs-7 fw-bold d-flex justify-content-end'>
                              {formatCurrency(channel.to_them_sat, Units.SATS, uiConfigUnit, false, 5, 'string')} {uiConfigUnit}
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
                  { isDarkMode ? 
                    <NoChannelDarkSVG className='no-channel-dark mt-5 pb-1' /> :
                    <NoChannelLightSVG className='no-channel-light mt-5 pb-1' />
                  }
                  <Row className='text-center pb-4'>No channel found. Open channel to start!</Row>
                </Row>
              </Row>
        }
      </Card.Body>
      <Card.Footer className='d-flex justify-content-center'>
        <button data-testid='button-open-channel' tabIndex={1} className='btn-rounded bg-primary' onClick={props.onOpenChannel}>
          Open Channel
          <ActionSVG className='ms-3' />
        </button>
      </Card.Footer>
    </Card>
  );
};

export default Channels;
