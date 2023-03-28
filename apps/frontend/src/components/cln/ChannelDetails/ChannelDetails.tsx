import './ChannelDetails.scss';
import { useContext, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import useHttp from '../../../hooks/use-http';
import { copyTextToClipboard, formatCurrency, titleCase } from '../../../utilities/data-formatters';
import { CallStatus, CLEAR_STATUS_ALERT_DELAY, Units } from '../../../utilities/constants';
import { AppContext } from '../../../store/AppContext';
import { ActionSVG } from '../../../svgs/Action';
import { CloseSVG } from '../../../svgs/Close';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import logger from '../../../services/logger.service';
import { CopySVG } from '../../../svgs/Copy';
import { OpenLinkSVG } from '../../../svgs/OpenLink';
import ToastMessage from '../../shared/ToastMessage/ToastMessage';

const ChannelDetails = (props) => {
  const appCtx = useContext(AppContext);
  const { closeChannel } = useHttp();
  const [showToast, setShowToast] = useState(false);
  const [channelClosed, setChannelClosed] = useState(props.selChannel.current_state !== 'ACTIVE');
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const openLinkHandler = (event) => {
    window.open('https://blockstream.info/' + (appCtx.nodeInfo.network === 'testnet' ? 'testnet/' : '') + 'tx/' + event.target.id, '_blank');
  };

  const ChannelCloseHandler = (event) => {
    event.preventDefault();
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('');
    setShowToast(true);
  };

  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'Channel ID':
        textToCopy = props.selChannel.channel_id;
        break;
      case 'Funding ID':
        textToCopy = props.selChannel.funding_txid;
        break;
      default:
        textToCopy = props.selChannel.channel_id;
        break;
    }
    copyTextToClipboard(textToCopy).then((response) => {
      appCtx.setShowToast({show: true, message: (event.target.id + ' Copied Successfully!'), bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  const delayedClearStatusAlert = () => {
    setTimeout(() => {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }, CLEAR_STATUS_ALERT_DELAY);
  }

  const confirmResponseHandler = (response) => {
    setShowToast(false);
    if (response) {
      setResponseStatus(CallStatus.PENDING);
      setResponseMessage('Closing Channel...');
      closeChannel(props.selChannel.channel_id)
      .then((response: any) => {
        logger.info(response);
        if (response.data && response.data.type) {
          setChannelClosed(true);
          setResponseStatus(CallStatus.SUCCESS);
          setResponseMessage('Channel ' + response.data.type + ' closed' + (response.data.txid ? (' with transaction id ' + response.data.txid) : ''));
          delayedClearStatusAlert();
        } else {
          setResponseStatus(CallStatus.ERROR);
          setResponseMessage(response.response.data || response.message || 'Unknown Error');
          delayedClearStatusAlert();          
        }
      })
      .catch(err => {
        logger.error(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
        delayedClearStatusAlert();
      });
    } else {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }
  };

  return (
    <form onSubmit={ChannelCloseHandler} className='h-100'>
      <Card className='h-100 d-flex align-items-stretch'>
        <Card.Body className='text-dark d-flex align-items-stretch flex-column pt-4'>
            <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
              <div className='fs-4 p-0 fw-bold text-dark'>
                Channel Detail
              </div>
              <span className='span-close-svg' onClick={props.onClose}><CloseSVG /></span>
            </Card.Header>
            <Card.Body className='pt-1 pb-0 px-1 d-flex flex-column align-items-stretch justify-content-between channel-scroll-container'>
              <PerfectScrollbar className='ps-show-always' options={{suppressScrollX:true}}>
                <Row className='d-flex align-items-start justify-content-start'>
                  <Col className='me-3'>
                    <OverlayTrigger
                      placement='auto'
                      delay={{ show: 250, hide: 250 }}
                      overlay={<Tooltip>{titleCase(props.selChannel.current_state)}</Tooltip>}
                      >
                      <span className='d-flex align-items-center justify-content-start fw-bold'>
                        <div className={'d-inline-block mx-1 dot ' + (props.selChannel.current_state === 'ACTIVE' ? 'bg-success' : props.selChannel.current_state === 'PENDING' ? 'bg-warning' : 'bg-danger')}></div>
                        {props.selChannel.node_alias}
                      </span>
                    </OverlayTrigger>
                    <ProgressBar>
                      <ProgressBar variant='primary' now={(props.selChannel.satoshi_to_us > 1000000 || props.selChannel.satoshi_to_them > 1000000) ? (props.selChannel.satoshi_to_us / 1000) : props.selChannel.satoshi_to_us} key={1} />
                      <ProgressBar variant='light' now={(props.selChannel.satoshi_to_us > 1000000 || props.selChannel.satoshi_to_them > 1000000) ? (props.selChannel.satoshi_to_them / 1000) : props.selChannel.satoshi_to_them} key={2} />
                    </ProgressBar>
                    <Row className='text-light d-flex align-items-end justify-content-between'>
                      <Col xs={6} className='fs-7 fw-bold d-flex justify-content-start text-primary'>
                        {formatCurrency(props.selChannel.satoshi_to_us, Units.SATS, appCtx.appConfig.unit, false, 5, 'string')} {appCtx.appConfig.unit}
                      </Col>
                      <Col xs={6} className='fs-7 fw-bold d-flex justify-content-end'>
                        {formatCurrency(props.selChannel.satoshi_to_them, Units.SATS, appCtx.appConfig.unit, false, 5, 'string')} {appCtx.appConfig.unit}
                      </Col>
                    </Row>
                  </Col>
                  <Row className='mt-1'>
                    <Col xs={12} className='fs-7 text-light'>Short Channel Id</Col>
                    <Col xs={12} className='pe-1 overflow-x-ellipsis fw-bold'>
                      {props.selChannel.short_channel_id}
                    </Col>
                  </Row>
                  <Row className='mt-12px'>
                    <Col xs={12} className='fs-7 text-light'>Withdrawal Timelock</Col>
                    <Col xs={12} className='pe-1 overflow-x-ellipsis fw-bold'>
                      {props.selChannel.their_to_self_delay} Blocks
                    </Col>
                  </Row>
                  <Row className='mt-12px'>
                    <Col xs={12} className='fs-7 text-light'>Opened By</Col>
                    <Col xs={12} className='pe-1 overflow-x-ellipsis fw-bold'>
                      {titleCase(props.selChannel.opener)}
                    </Col>
                  </Row>
                  <Row className='mt-12px'>
                    <Col xs={12} className='fs-7 text-light'>Channel Type</Col>
                    <Col xs={12} className='pe-1 overflow-x-ellipsis fw-bold'>
                      {props.selChannel.private ? 'Private' : 'Public'}
                    </Col>
                  </Row>
                  <Row className='mt-12px'>
                    <Col xs={12} className='fs-7 text-light'>Dust Limit</Col>
                    <Col xs={12} className='pe-1 overflow-x-ellipsis fw-bold'>
                      {formatCurrency(props.selChannel.dust_limit_satoshis, Units.SATS, appCtx.appConfig.unit, false, 8, 'string')} {appCtx.appConfig.unit}
                    </Col>
                  </Row>
                  <Row className='mt-12px'>
                    <Col xs={12} className='fs-7 text-light'>Spendable</Col>
                    <Col xs={12} className='pe-1 overflow-x-ellipsis fw-bold'>
                      {formatCurrency(props.selChannel.spendable_msatoshi, Units.MSATS, appCtx.appConfig.unit, false, 8, 'string')} {appCtx.appConfig.unit}
                    </Col>
                  </Row>
                  <Row className='mt-12px'>
                    <Col xs={12} className='fs-7 text-light'>Receivable</Col>
                    <Col xs={12} className='pe-1 overflow-x-ellipsis fw-bold'>
                      {formatCurrency(props.selChannel.receivable_msatoshi, Units.MSATS, appCtx.appConfig.unit, false, 8, 'string')} {appCtx.appConfig.unit}
                    </Col>
                  </Row>
                  <Row className='mt-12px'>
                    <Col xs={12} className='fs-7 text-light'>Channel ID</Col>
                    <Col xs={11} className='pe-1 overflow-x-ellipsis fw-bold'>{props.selChannel.channel_id}</Col>
                    <Col xs={1} onClick={copyHandler} className='btn-sm-svg btn-svg-copy'><CopySVG id='Channel ID' showTooltip={true} /></Col>
                  </Row>
                  <Row className='mt-12px'>
                    <Col xs={12} className='fs-7 text-light'>Funding ID</Col>
                    <Col xs={10} className='pe-1 overflow-x-ellipsis fw-bold'>{props.selChannel.funding_txid}</Col>
                    <Col xs={1} onClick={copyHandler} className='btn-sm-svg btn-svg-copy'><CopySVG id='Funding ID' showTooltip={true} /></Col>
                    <Col xs={1} onClick={openLinkHandler} className='btn-sm-svg btn-svg-open'><OpenLinkSVG id={props.selChannel.funding_txid} /></Col>
                  </Row>
                </Row>
                <ToastMessage showOnComponent={true} show={showToast} type={'CONFIRM'} message={'Close this channel?'} bg={'primary'} className={'opaque'} containerClassName={'bottom-0'} onConfirmResponse={confirmResponseHandler} />
                </PerfectScrollbar>
                {!showToast ? <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} /> : <></> }
              </Card.Body>
            {channelClosed ?
              <></> 
              :
              <Card.Footer className='d-flex justify-content-center'>
                <button tabIndex={5} type='submit' className='btn-rounded bg-primary' disabled={responseStatus === CallStatus.PENDING}>
                  Close Channel
                  {responseStatus === CallStatus.PENDING ? <Spinner className='mt-1 ms-2 text-white-dark' size='sm' /> : <ActionSVG className='ms-3' />}
                </button>
              </Card.Footer>
            }
        </Card.Body>
      </Card>
    </form>
  );
};

export default ChannelDetails;
