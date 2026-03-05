import './BTCWithdraw.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, ChangeEvent } from 'react';
import { Spinner, Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';

import logger from '../../../services/logger.service';
import useInput from '../../../hooks/use-input';
import { CallStatus, CLEAR_STATUS_ALERT_DELAY, FeeRate, FEE_RATES } from '../../../utilities/constants';
import { ActionSVG } from '../../../svgs/Action';
import { AmountSVG } from '../../../svgs/Amount';
import { AddressSVG } from '../../../svgs/Address';
import { FeeRateSVG } from '../../../svgs/FeeRate';
import { BitcoinWalletSVG } from '../../../svgs/BitcoinWallet';
import FiatBox from '../../shared/FiatBox/FiatBox';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { CloseSVG } from '../../../svgs/Close';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import FeerateRange from '../../shared/FeerateRange/FeerateRange';
import { CLNService } from '../../../services/http.service';
import { useSelector } from 'react-redux';
import { selectFiatConfig, selectFiatUnit, selectWalletBalances } from '../../../store/rootSelectors';

const BTCWithdraw = (props) => {
  const fiatUnit = useSelector(selectFiatUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  const walletBalances = useSelector(selectWalletBalances);
  const [selFeeRate, setSelFeeRate] = useState(FeeRate.NORMAL);
  const [showCustomFeeRate, setShowCustomFeeRate] = useState(false);
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidAmount = (value) => value === 'All' || (value > 0 && value <= (walletBalances.btcSpendableBalance || 0));
  const isValidAddress = (value) => value.trim() !== '';
  const isValidFeeRate = (value) => !showCustomFeeRate || (value.trim() !== '' && value > 0);

  const {
    value: addressValue,
    isValid: addressIsValid,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
    reset: resetAddress,
  } = useInput(isValidAddress);
  const {
    value: amountValue,
    isValid: amountIsValid,
    hasError: amountHasError,
    valueChangeHandler: amountChangeHandler,
    inputBlurHandler: amountBlurHandler,
    reset: resetAmount,
  } = useInput(isValidAmount);
  const {
    value: feeRateValue,
    isValid: feeRateIsValid,
    hasError: feeRateHasError,
    valueChangeHandler: feeRateChangeHandler,
    inputBlurHandler: feeRateBlurHandler,
    reset: resetFeeRate,
  } = useInput(isValidFeeRate);

  let formIsValid = false;

  if (addressIsValid && amountIsValid && feeRateIsValid) {
    formIsValid = true;
  };

  const selFeeRateChangeHandler = (event) => {
    setSelFeeRate(FEE_RATES[+event.target.value]);
  };

  const touchFormControls = () => {
    addressBlurHandler();
    amountBlurHandler();
    feeRateBlurHandler();
  };

  const resetFormValues = () => {
    resetAddress();
    resetAmount();
    resetFeeRate();
    setSelFeeRate(FeeRate.NORMAL);
  };

  const delayedClearStatusAlert = () => {
    setTimeout(() => {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }, CLEAR_STATUS_ALERT_DELAY);
  }

  const showCustomFeeRateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setShowCustomFeeRate(event.target.checked);
  };

  const withdrawHandler = (event) => {
    event.preventDefault();
    touchFormControls();
    if (!formIsValid) { return; }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Sending Transaction...');
    CLNService.btcWithdraw(addressValue, amountValue.toLowerCase(), (!!showCustomFeeRate ? feeRateValue + 'perkw' : selFeeRate.toLowerCase()))
      .then((response: any) => {
        logger.info(response);
        if (response.txid) {
          setResponseStatus(CallStatus.SUCCESS);
          setResponseMessage('Transaction sent with transaction id ' + response.txid);
          resetFormValues();
          delayedClearStatusAlert();
        } else {
          setResponseStatus(CallStatus.ERROR);
          setResponseMessage(response.response || response.message || 'Unknown Error');
          delayedClearStatusAlert();
        }
      })
      .catch(err => {
        logger.error(err);
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(err);
        delayedClearStatusAlert();
      });
  };

  return (
    <form onSubmit={withdrawHandler} className='h-100' data-testid='btc-withdraw'>
      <Card className='h-100 d-flex align-items-stretch' data-testid="btc-withdraw-card">
        <Card.Body className='d-flex align-items-stretch flex-column pt-4'>
          <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
            <div className='p-0 fw-bold text-primary d-flex align-items-center'>
              <BitcoinWalletSVG svgClassName='svg-small me-2' className='fill-primary' />
              <span className='fw-bold'>Bitcoin Wallet</span>
            </div>
            <span role='button' data-testid='close-button' className='span-close-svg' onClick={props.onClose}><CloseSVG /></span>
          </Card.Header>
          <h4 className='text-blue fw-bold mt-2'>Withdraw</h4>
          <Card.Body className='py-0 px-1 d-flex flex-column align-items-start justify-content-between'>
            <Row className='d-flex align-items-start justify-content-center'>
              <Col xs={12}>
                <Form.Label className='text-dark d-flex align-items-center justify-content-between'>
                  <span>Amount*</span>
                  {amountValue !== 'All' ?
                    <Button variant='link' onClick={() => amountChangeHandler({ target: { value: 'All' } })}>Send All</Button>
                    :
                    <></>
                  }
                </Form.Label>
                <InputGroup className={(amountHasError ? 'invalid ' : '')}>
                  <InputGroup.Text className={'form-control-addon form-control-addon-left'}>
                    <AmountSVG />
                  </InputGroup.Text>
                  <Form.Control
                    tabIndex={1}
                    id='amount'
                    type={amountValue === 'All' ? 'text' : 'number'}
                    placeholder={'Amount (Between 1 - ' + parseFloat((walletBalances.btcSpendableBalance || 0).toString()).toLocaleString('en-us') + ' Sats)'}
                    aria-label='amount'
                    aria-describedby='addon-amount'
                    className={amountValue === 'All' ? 'form-control-middle' : 'form-control-right'}
                    value={amountValue}
                    onChange={amountChangeHandler}
                    onBlur={amountBlurHandler}
                    disabled={amountValue === 'All'}
                  />
                  {amountValue === 'All' ?
                    <InputGroup.Text className={'form-control-addon form-control-addon-right'}>
                      <span className='btn-addon-close' onClick={() => resetAmount()}><CloseSVG /></span>
                    </InputGroup.Text>
                    :
                    <></>
                  }
                </InputGroup>
                {
                  !amountHasError ?
                    amountValue && amountValue !== 'All' ?
                      <p className='fs-7 text-light d-flex align-items-center justify-content-end'>
                        ~ <FiatBox value={(+amountValue || 0)} fiatUnit={fiatUnit} symbol={fiatConfig.symbol} rate={fiatConfig.rate} />
                      </p>
                      :
                      <p className='message'></p>
                    :
                    <InvalidInputMessage message={
                      (+amountValue <= 0) ?
                        'Amount should be greater than 0'
                        : (+amountValue > (walletBalances.btcSpendableBalance || 0)) ?
                          'Amount should be lesser then ' + (walletBalances.btcSpendableBalance || 0)
                          :
                          'Invalid Amount'
                    } />
                }
              </Col>
              <Col xs={12}>
                <Form.Label className=' text-dark'>Address*</Form.Label>
                <InputGroup className={(addressHasError ? 'invalid ' : '')}>
                  <InputGroup.Text className='form-control-addon form-control-addon-left'>
                    <AddressSVG />
                  </InputGroup.Text>
                  <Form.Control
                    tabIndex={2}
                    id='address'
                    type='text'
                    placeholder='Address'
                    aria-label='address'
                    aria-describedby='addon-address'
                    className='form-control-right'
                    value={addressValue}
                    onChange={addressChangeHandler}
                    onBlur={addressBlurHandler}
                  />
                </InputGroup>
                {(addressHasError) ?
                  <InvalidInputMessage message={'Invalid Address'} />
                  :
                  <div className='message'></div>
                }
              </Col>
              <Col xs={12} className='d-flex align-items-center mb-3'>
                <Form.Check
                  tabIndex={5}
                  onChange={showCustomFeeRateChangeHandler}
                  checked={showCustomFeeRate}
                  inline
                  className='text-dark'
                  label='Custom Fee Rate'
                  name='showCustomFeeRate'
                  type='checkbox'
                  id='showCustomFeeRateCheckbox'
                  data-testid='show-custom-fee-rate'
                />
              </Col>
              <AnimatePresence mode="wait">
                {showCustomFeeRate ? (
                  <motion.div
                    key="custom"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Col xs={12} style={{ display: showCustomFeeRate ? 'block' : 'none' }}>
                      <Form.Label className='text-dark'>Fee Rate*</Form.Label>
                      <InputGroup className={(feeRateHasError ? 'invalid ' : '')}>
                        <InputGroup.Text className='form-control-addon form-control-addon-left'>
                          <FeeRateSVG />
                        </InputGroup.Text>
                        <Form.Control
                          tabIndex={3}
                          id='feeRate'
                          type='number'
                          placeholder={'Fee Rate'}
                          aria-label='feeRate'
                          aria-describedby='addon-feeRate'
                          className='form-control-middle'
                          value={feeRateValue}
                          onChange={feeRateChangeHandler}
                          onBlur={feeRateBlurHandler}
                        />
                        <InputGroup.Text data-testid='fee-rate-unit' id='Fee Rate Unit' className='form-control-addon form-control-addon-right text-light'>
                          perkw
                        </InputGroup.Text>
                      </InputGroup>
                      {(feeRateHasError) ?
                        <InvalidInputMessage message={(+feeRateValue <= 0) ? 'Fee Rate should be greater than 0' : 'Invalid Fee Rate'} /> : <div className='message'></div>
                      }
                    </Col>
                  </motion.div>
                ) : (
                  <motion.div
                    key="range"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Col xs={12} style={{ display: showCustomFeeRate ? 'none' : 'block' }}>
                      <FeerateRange tabIndex={4} selFeeRate={selFeeRate} selFeeRateChangeHandler={selFeeRateChangeHandler} />
                    </Col>
                  </motion.div>
                )}
              </AnimatePresence>
            </Row>
            <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
          </Card.Body>
          <Card.Footer className='d-flex justify-content-center'>
            <Button tabIndex={4} type='submit' data-testid='button-withdraw' variant='primary' className='btn-rounded' disabled={responseStatus === CallStatus.PENDING}>
              Withdraw
              {responseStatus === CallStatus.PENDING ? <Spinner className='mt-1 ms-2 text-white-dark' size='sm' /> : <ActionSVG className='ms-3' />}
            </Button>
          </Card.Footer>
        </Card.Body>
      </Card>
    </form>
  );
};

export default BTCWithdraw;
