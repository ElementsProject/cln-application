import React from 'react';

import './ChannelOpen.scss';
import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

import logger from '../../../services/logger.service';
import useInput from '../../../hooks/use-input';
import useHttp from '../../../hooks/use-http';
import { CallStatus, FeeRate, BOUNCY_SPRING_VARIANTS_1, CLEAR_STATUS_ALERT_DELAY } from '../../../utilities/constants';
import { AppContext } from '../../../store/AppContext';
import { ActionSVG } from '../../../svgs/Action';
import { AmountSVG } from '../../../svgs/Amount';
import { AddressSVG } from '../../../svgs/Address';
import FiatBox from '../../shared/FiatBox/FiatBox';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { CloseSVG } from '../../../svgs/Close';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import FeerateRange from '../../shared/FeerateRange/FeerateRange';


const ChannelOpen = (props) => {
  const appCtx = useContext(AppContext);
  const { openChannel } = useHttp();
  const [selFeeRate, setSelFeeRate] = useState(FeeRate.NORMAL)
  const [announce, setAnnounce] = useState(true);
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');
  const isValidAmount = (value) => value.trim() !== '' && value > 0 && value <= (appCtx.walletBalances.btcSpendableBalance || 0);
  const isValidPubkey = (value) => value.includes('@') && value.includes(':');

  const {
    value: pubkeyValue,
    isValid: pubkeyIsValid,
    hasError: pubkeyHasError,
    valueChangeHandler: pubkeyChangeHandler,
    inputBlurHandler: pubkeyBlurHandler,
    reset: resetPubkey,
  } = useInput(isValidPubkey);
  const {
    value: amountValue,
    isValid: amountIsValid,
    hasError: amountHasError,
    valueChangeHandler: amountChangeHandler,
    inputBlurHandler: amountBlurHandler,
    reset: resetAmount,
  } = useInput(isValidAmount);

  let formIsValid = false;

  if (pubkeyIsValid && amountIsValid) {
    formIsValid = true;
  };
  
  const selFeeRateChangeHandler = (event) => {
    switch (+(event.target.value)) {
      case 0:
        setSelFeeRate(FeeRate.SLOW);
        break;
      case 2:
        setSelFeeRate(FeeRate.URGENT);
        break;
      default:
        setSelFeeRate(FeeRate.NORMAL);
        break;
    }
  };

  const touchFormControls = () => {
    pubkeyBlurHandler(null);
    amountBlurHandler(null);
  };

  const resetFormValues = () => {
    resetPubkey();
    resetAmount();
    setAnnounce(true);
    setSelFeeRate(FeeRate.NORMAL);
  };

  const delayedClearStatusAlert = (shouldClose: boolean, channelId: string = '') => {
    setTimeout(() => {
      logger.info('Should Close: ' + shouldClose);
      if(shouldClose) { props.onClose(channelId); }
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');  
    }, CLEAR_STATUS_ALERT_DELAY);
  }

  const ChannelOpenHandler = (event) => {
    event.preventDefault();
    touchFormControls();
    if (!formIsValid) { return; }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Opening Channel...');
    openChannel(pubkeyValue, +amountValue, selFeeRate.toLowerCase(), announce)
    .then((response: any) => {
      logger.info(response);
      if (response.data && (response.data.channel_id || response.data.txid)) {
        setResponseStatus(CallStatus.SUCCESS);
        setResponseMessage('Channel opened with ' + (response.data.channel_id ? ('channel id ' + response.data.channel_id) : ('transaction id ' + response.data.txid)));
        resetFormValues();
        delayedClearStatusAlert(true, response.data.channel_id);
      } else {
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(response.response.data || response.message || 'Unknown Error');
        delayedClearStatusAlert(false);
      }
    })
    .catch(err => {
      logger.error(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
      delayedClearStatusAlert(false);
    });
  };

  return (
    <form onSubmit={ChannelOpenHandler} className='h-100'>
      <Card className='h-100 d-flex align-items-stretch'>
        <Card.Body className='text-dark d-flex align-items-stretch flex-column pt-4'>
            <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
              <div className='fs-4 p-0 fw-bold text-dark'>
                Open Channel
              </div>
              <span className='span-close-svg' onClick={props.onClose}><CloseSVG /></span>
            </Card.Header>
            <Card.Body className='pb-0 px-1 d-flex flex-column align-items-start justify-content-between'>
              <Row className='d-flex align-items-start justify-content-center'>
                <Col xs={12}>
                  <Form.Label className='text-dark'>Node ID*</Form.Label>
                  <InputGroup className={(pubkeyHasError ? 'invalid' : '')}>
                    <InputGroup.Text className='form-control-addon form-control-addon-left'>
                      <AddressSVG />
                    </InputGroup.Text>
                    <Form.Control
                      tabIndex={1}
                      id='pubkey'
                      type='text'
                      placeholder='Pubkey@Ip:Port'
                      aria-label='pubkey'
                      aria-describedby='addon-pubkey'
                      className='form-control-right'
                      value={pubkeyValue}
                      onChange={pubkeyChangeHandler}
                      onBlur={pubkeyBlurHandler}
                    />
                  </InputGroup>
                  {(pubkeyHasError) ?
                    <InvalidInputMessage message={'Invalid Node ID'} /> : <div className='message'></div>
                  }
                </Col>
                <Col xs={12}>
                  <Form.Label className='text-dark'>Amount*</Form.Label>
                  <InputGroup className={(amountHasError ? 'invalid ' : '')}>
                    <InputGroup.Text className='form-control-addon form-control-addon-left'>
                      <AmountSVG />
                    </InputGroup.Text>
                    <Form.Control
                      tabIndex={2}
                      id='amount'
                      type='number'
                      placeholder={'Amount (Between 1 - ' + parseFloat((appCtx.walletBalances.btcSpendableBalance || 0).toString()).toLocaleString('en-us')  + ' Sats)'}
                      aria-label='amount'
                      aria-describedby='addon-amount'
                      className='form-control-right'
                      value={amountValue}
                      onChange={amountChangeHandler}
                      onBlur={amountBlurHandler}
                    />
                  </InputGroup>
                  {
                    !amountHasError ?
                      amountValue ?
                        <p className='fs-7 text-light d-flex align-items-center justify-content-end'>
                          ~ <FiatBox value={(+amountValue || 0)} fiatUnit={appCtx.appConfig.fiatUnit} symbol={appCtx.fiatConfig.symbol} rate={appCtx.fiatConfig.rate} />
                        </p>
                      :
                        <p className='message'></p>
                    :
                      <InvalidInputMessage message={
                        (+amountValue <= 0) ? 
                          'Amount should be greater than 0'
                        : (+amountValue > (appCtx.walletBalances.btcSpendableBalance || 0)) ? 
                          'Amount should be lesser then ' + (appCtx.walletBalances.btcSpendableBalance || 0)
                        :
                          'Invalid Amount'
                      } />
                  }
                </Col>
                <Col xs={12} className='d-flex align-items-center mb-3'>
                  <Form.Label className='text-dark me-4'>Announce</Form.Label>
                  <div tabIndex={3} className='switch' data-isswitchon={announce} onClick={() => setAnnounce(!announce)}>
                    <motion.div className='handle' layout transition={BOUNCY_SPRING_VARIANTS_1} />
                  </div>
                </Col>
                <Col xs={12}>
                  <FeerateRange tabIndex={4} selFeeRate={selFeeRate} selFeeRateChangeHandler={selFeeRateChangeHandler} />
                </Col>
              </Row>
              <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
            </Card.Body>
            <Card.Footer className='d-flex justify-content-center'>
              <button tabIndex={5} type='submit' className='btn-rounded bg-primary' disabled={responseStatus === CallStatus.PENDING}>
                Open Channel
                {responseStatus === CallStatus.PENDING ? <Spinner className='mt-1 ms-2 text-white-dark' size='sm' /> : <ActionSVG className='ms-3' />}
              </button>
            </Card.Footer>
        </Card.Body>
      </Card>
    </form>
  );
};

export default ChannelOpen;
