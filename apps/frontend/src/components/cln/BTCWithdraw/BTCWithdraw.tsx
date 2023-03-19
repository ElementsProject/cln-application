import './BTCWithdraw.scss';
import { useContext, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

import logger from '../../../services/logger.service';
import useInput from '../../../hooks/use-input';
import useHttp from '../../../hooks/use-http';
import { CallStatus, CLEAR_STATUS_ALERT_DELAY, FeeRate, FEE_RATES } from '../../../utilities/constants';
import { AppContext } from '../../../store/AppContext';
import { ActionSVG } from '../../../svgs/Action';
import { AmountSVG } from '../../../svgs/Amount';
import { AddressSVG } from '../../../svgs/Address';
import { BitcoinWalletSVG } from '../../../svgs/BitcoinWallet';
import FiatBox from '../../shared/FiatBox/FiatBox';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { CloseSVG } from '../../../svgs/Close';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import FeerateRange from '../../shared/FeerateRange/FeerateRange';

const BTCWithdraw = (props) => {
  const appCtx = useContext(AppContext);
  const { btcWithdraw } = useHttp();
  const [selFeeRate, setSelFeeRate] = useState(FeeRate.NORMAL);
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidAmount = (value) => value === 'All' || (value > 0 && value <= (appCtx.walletBalances.btcSpendableBalance || 0));
  const isValidAddress = (value) => value.trim() !== '';

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

  let formIsValid = false;

  if (addressIsValid && amountIsValid) {
    formIsValid = true;
  };
  
  const selFeeRateChangeHandler = (event) => {
    setSelFeeRate(FEE_RATES[+event.target.value]);
  };

  const touchFormControls = () => {
    addressBlurHandler(null);
    amountBlurHandler(null);
  };

  const resetFormValues = () => {
    resetAddress();
    resetAmount();
    setSelFeeRate(FeeRate.NORMAL);
  };

  const delayedClearStatusAlert = () => {
    setTimeout(() => {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }, CLEAR_STATUS_ALERT_DELAY);
  }

  const withdrawHandler = (event) => {
    event.preventDefault();
    touchFormControls();
    if (!formIsValid) { return; }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Sending Transaction...');
    btcWithdraw(addressValue, amountValue.toLowerCase(), selFeeRate.toLowerCase())
    .then((response: any) => {
      logger.info(response);
      if (response.data && response.data.txid) {
        setResponseStatus(CallStatus.SUCCESS);
        setResponseMessage('Transaction sent with transaction id ' + response.data.txid);
        resetFormValues();
        delayedClearStatusAlert();
      } else {
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(response.data || response.message || 'Unknown Error');
        delayedClearStatusAlert();
      }
    })
    .catch(err => {
      logger.error(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
      delayedClearStatusAlert();
    });
  };

  return (
    <form onSubmit={withdrawHandler} className='h-100'>
      <Card className='h-100 d-flex align-items-stretch'>
        <Card.Body className='d-flex align-items-stretch flex-column pt-4'>
            <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
              <div className='p-0 fw-bold text-primary d-flex align-items-center'>
                <BitcoinWalletSVG svgClassName='svg-small me-2' className='fill-primary' />
                <span className='fw-bold'>Bitcoin Wallet</span>
              </div>
              <span className='span-close-svg' onClick={props.onClose}><CloseSVG /></span>
            </Card.Header>
            <h4 className='text-blue fw-bold'>Withdraw</h4>
            <Card.Body className='py-0 px-1 d-flex flex-column align-items-start justify-content-between'>
              <Row className='d-flex align-items-start justify-content-center'>
              <Col xs={12}>
                  <Form.Label className='text-dark d-flex align-items-center justify-content-between'>
                    <span>Amount</span>
                    {amountValue !== 'All' ? 
                      <Button variant='link' onClick={() => amountChangeHandler({target: {value: 'All'}})}>Send All</Button>
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
                      placeholder={'Amount (Between 1 - ' + parseFloat((appCtx.walletBalances.btcSpendableBalance || 0).toString()).toLocaleString('en-us')  + ' Sats)'}
                      aria-label='amount'
                      aria-describedby='addon-amount'
                      className={amountValue === 'All' ? 'form-control-middle' : 'form-control-right'}
                      value={amountValue}
                      onChange={amountChangeHandler}
                      onBlur={amountBlurHandler}
                      disabled={amountValue === 'All'}
                    />
                    { amountValue === 'All' ? 
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
                          ~ <FiatBox value={(+amountValue || 0)} symbol={appCtx.fiatConfig.symbol} rate={appCtx.fiatConfig.rate} />
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
                <Col xs={12}>
                  <Form.Label className=' text-dark'>Address</Form.Label>
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
                <Col xs={12}>
                  <FeerateRange tabIndex={3} selFeeRate={selFeeRate} selFeeRateChangeHandler={selFeeRateChangeHandler} />
                </Col>
              </Row>
              <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
            </Card.Body>
            <Card.Footer className='d-flex justify-content-center'>
              <Button tabIndex={4} type='submit' variant='primary' className='btn-rounded' disabled={responseStatus === CallStatus.PENDING}>
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
