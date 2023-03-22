import './CLNSend.scss';
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
import { CallStatus, CLEAR_STATUS_ALERT_DELAY, PaymentType } from '../../../utilities/constants';
import { AppContext } from '../../../store/AppContext';
import { ActionSVG } from '../../../svgs/Action';
import { AmountSVG } from '../../../svgs/Amount';
import { AddressSVG } from '../../../svgs/Address';
import { LightningWalletSVG } from '../../../svgs/LightningWallet';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { CloseSVG } from '../../../svgs/Close';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';

const CLNSend = (props) => {
  const appCtx = useContext(AppContext);
  const { clnSendPayment, decodeInvoice, fetchInvoice } = useHttp();
  const [paymentType, setPaymentType] = useState(PaymentType.INVOICE);
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidAmount = (value) => value.trim() !== '' && value > 0 && value <= (appCtx.walletBalances.clnLocalBalance || 0);
  const isValidInvoice = (value) => value.trim() !== '';

  const {
    value: invoiceValue,
    isValid: invoiceIsValid,
    hasError: invoiceHasError,
    valueChangeHandler: invoiceChangeHandler,
    inputBlurHandler: invoiceBlurHandler,
    reset: resetInvoice,
  } = useInput(isValidInvoice);
  const {
    value: amountValue,
    isValid: amountIsValid,
    hasError: amountHasError,
    valueChangeHandler: amountChangeHandler,
    inputBlurHandler: amountBlurHandler,
    reset: resetAmount,
  } = useInput(isValidAmount);

  let formIsValid = false;

  if ((paymentType !== PaymentType.KEYSEND && invoiceIsValid) || (paymentType === PaymentType.KEYSEND && invoiceIsValid && amountIsValid)) {
    formIsValid = true;
  };

  const touchFormControls = () => {
    invoiceBlurHandler(null);
    amountBlurHandler(null);
  };

  const resetFormValues = () => {
    setPaymentType(PaymentType.INVOICE);
    resetInvoice();
    resetAmount();
  };

  const paymentTypeChangeHandler = (event) => {
    setPaymentType(event.target.id);
    resetInvoice();
    resetAmount();
  }

  const delayedClearStatusAlert = () => {
    setTimeout(() => {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }, CLEAR_STATUS_ALERT_DELAY);
  }

  const sendInvoice = (type: PaymentType, invoice: string, amount: number) => {
    clnSendPayment(type, invoice, amount)
    .then((response: any) => {
      logger.info(response);
      if (response.data && response.data.payment_hash) {
        setResponseStatus(CallStatus.SUCCESS);
        setResponseMessage('Payment sent with payment hash ' + response.data.payment_hash);
        resetFormValues();
        delayedClearStatusAlert();
      } else {
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(response.response.data || response.message || 'Unknown Error');
        delayedClearStatusAlert();
      }
    })
    .catch(err => {
      logger.error(err.response.data);
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(err.response.data);
      delayedClearStatusAlert();
    });
  };

  const CLNSendHandler = (event) => {
    event.preventDefault();
    touchFormControls();
    if (!formIsValid) { return; }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Sending Payment...');
    if (paymentType === PaymentType.OFFER) {
      decodeInvoice(invoiceValue)
      .then((decodeRes: any) => {
        logger.info(decodeRes);
        if (!decodeRes.data.valid || !decodeRes.data.offer_amount_msat) {
          logger.error('Offer Invalid');
          setResponseStatus(CallStatus.ERROR);
          setResponseMessage('Invalid or Open Offer');
          delayedClearStatusAlert();
        } else {
          const amountSats = +(decodeRes.data.offer_amount_msat.substring(0, (decodeRes.data.offer_amount_msat.length - 4))) / 1000 || 0;
          fetchInvoice(invoiceValue, amountSats)
          .then((fetchInvoiceRes: any) => {
            logger.info(fetchInvoiceRes);
            sendInvoice(PaymentType.INVOICE, fetchInvoiceRes.data.invoice, amountSats);
          })
          .catch(err => {
            logger.error(err.response.data);
            setResponseStatus(CallStatus.ERROR);
            setResponseMessage(err.response.data);
            delayedClearStatusAlert();
          });
        }
      })
      .catch(err => {
        logger.error(err.response.data);
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(err.response.data);
        delayedClearStatusAlert();
      });
    } else {
      sendInvoice(PaymentType.INVOICE, invoiceValue, (+amountValue || 0));
    }
  };

  return (
    <form onSubmit={CLNSendHandler} className='h-100'>
      <Card className='h-100 d-flex align-items-stretch'>
        <Card.Body className='d-flex align-items-stretch flex-column pt-4'>
            <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
              <div className='p-0 fw-bold text-primary d-flex align-items-center'>
                <LightningWalletSVG svgClassName='svg-small me-2' className='fill-primary' />
                <span className='fw-bold'>Lightning Wallet</span>
              </div>
              <span className='span-close-svg' onClick={props.onClose}><CloseSVG /></span>
            </Card.Header>
            <h4 className='text-blue fw-bold mt-2'>Send Payment</h4>
            <Card.Body className='pb-0 px-1 d-flex flex-column align-items-start justify-content-between'>
              <Row className='d-flex align-items-start justify-content-center'>
                <Col xs={12} className='mb-3 d-flex align-items-start justify-content-between'>
                  <Form.Check tabIndex={1} onChange={paymentTypeChangeHandler} checked={paymentType === PaymentType.INVOICE} inline className='text-dark' label='Invoice' name='payType' type='radio' id='Invoice' />
                  <Form.Check tabIndex={2} onChange={paymentTypeChangeHandler} checked={paymentType === PaymentType.OFFER} inline className='text-dark' label='Offer' name='payType' type='radio' id='Offer' />
                  <Form.Check tabIndex={3} onChange={paymentTypeChangeHandler} checked={paymentType === PaymentType.KEYSEND} inline className='text-dark' label='Keysend' name='payType' type='radio' id='Keysend' />
                </Col>
                <Col xs={12}>
                  <Form.Label className='text-dark'>{paymentType === PaymentType.KEYSEND ? 'Pubkey' : paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'}</Form.Label>
                  <InputGroup className={(invoiceHasError ? 'invalid' : '')}>
                    <InputGroup.Text className='form-control-addon form-control-addon-left'>
                      <AddressSVG />
                    </InputGroup.Text>
                    <Form.Control
                      tabIndex={4}
                      id='invoice'
                      type='text'
                      placeholder={paymentType === PaymentType.KEYSEND ? 'Pubkey' : paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'}
                      aria-label='invoice'
                      aria-describedby='addon-invoice'
                      className='form-control-right'
                      value={invoiceValue}
                      onChange={invoiceChangeHandler}
                      onBlur={invoiceBlurHandler}
                    />
                  </InputGroup>
                  {(invoiceHasError) ?
                      <InvalidInputMessage message={('Invalid ' + (paymentType === PaymentType.KEYSEND ? 'Pubkey' : paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'))} /> 
                    :
                      <div className='message'></div>
                  }
                </Col>
                {paymentType === PaymentType.KEYSEND ? 
                  <Col xs={12}>
                    <Form.Label className='text-dark'>Amount</Form.Label>
                    <InputGroup className={(amountHasError ? 'invalid' : '')}>
                      <InputGroup.Text className='form-control-addon form-control-addon-left'>
                        <AmountSVG />
                      </InputGroup.Text>
                      <Form.Control
                        tabIndex={5}
                        id='amount'
                        type='number'
                        placeholder='Amount (Sats)'
                        aria-label='amount'
                        aria-describedby='addon-amount'
                        className='form-control-right'
                        value={amountValue}
                        onChange={amountChangeHandler}
                        onBlur={amountBlurHandler}
                      />
                    </InputGroup>
                    {(amountHasError) ?
                        <InvalidInputMessage message={('Invalid Amount')} />
                      :
                        <div className='message'></div>
                    }
                  </Col>
                :
                  <></>
                }
              </Row>
              <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
            </Card.Body>
            <Card.Footer className='d-flex justify-content-center'>
              <Button tabIndex={6} type='submit' variant='primary' className='btn-rounded' disabled={responseStatus === CallStatus.PENDING}>
                Send Payment
                {responseStatus === CallStatus.PENDING ? <Spinner className='mt-1 ms-2 text-white-dark' size='sm' /> : <ActionSVG className='ms-3' />}
              </Button>
            </Card.Footer>
        </Card.Body>
      </Card>
    </form>
  );
};

export default CLNSend;
