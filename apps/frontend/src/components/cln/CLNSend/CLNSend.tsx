import React from 'react';

import './CLNSend.scss';
import { useContext, useState } from 'react';
import { Card, Row, Col, Spinner, Button, Form, InputGroup } from 'react-bootstrap';

import logger from '../../../services/logger.service';
import useInput from '../../../hooks/use-input';
import useHttp from '../../../hooks/use-http';
import { formatCurrency, isCompatibleVersion } from '../../../utilities/data-formatters';
import { CallStatus, CLEAR_STATUS_ALERT_DELAY, PaymentType, SATS_MSAT, Units, InputType } from '../../../utilities/constants';
import { CLNContext } from '../../../store/CLNContext';
import { ActionSVG } from '../../../svgs/Action';
import { AmountSVG } from '../../../svgs/Amount';
import { AddressSVG } from '../../../svgs/Address';
import { LightningWalletSVG } from '../../../svgs/LightningWallet';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { CloseSVG } from '../../../svgs/Close';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import { RootContext } from '../../../store/RootContext';

const CLNSend = (props) => {
  const rootCtx = useContext(RootContext);
  const clnCtx = useContext(CLNContext);
  const { clnSendPayment, decodeInvoice, fetchInvoice } = useHttp();
  const [paymentType, setPaymentType] = useState(PaymentType.INVOICE);
  const [emptyInvoice, setEmptyInvoice] = useState(false);
  const [decodeResponse, setDecodeResponse] = useState({ description:'', amount: '' });
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidAmount = (value) => value.trim() !== '' && value > 0 && value <= (clnCtx.walletBalances.clnLocalBalance || 0);
  const isValidInvoice = (value) => value.trim() !== '' && (paymentType === PaymentType.KEYSEND || (paymentType === PaymentType.INVOICE && value.startsWith('lnb')) || (paymentType === PaymentType.OFFER && value.startsWith('lno')));

  const {
    value: invoiceValue,
    isValid: invoiceIsValid,
    hasError: invoiceHasError,
    valueChangeHandler: invoiceChangeHandler,
    inputBlurHandler: invoiceBlurHandler,
    reset: resetInvoice,
  } = useInput(isValidInvoice, InputType.LOWERCASE);
  const {
    value: amountValue,
    isValid: amountIsValid,
    hasError: amountHasError,
    valueChangeHandler: amountChangeHandler,
    inputBlurHandler: amountBlurHandler,
    reset: resetAmount,
  } = useInput(isValidAmount);

  let formIsValid = false;

  if (
    (paymentType !== PaymentType.KEYSEND && invoiceIsValid && !emptyInvoice) || 
    (paymentType !== PaymentType.KEYSEND && invoiceIsValid && emptyInvoice && amountIsValid) || 
    (paymentType === PaymentType.KEYSEND && invoiceIsValid && amountIsValid)) {
    formIsValid = true;
  };

  const touchFormControls = () => {
    invoiceBlurHandler(null);
    amountBlurHandler(null);
  };

  const resetFormValues = () => {
    setEmptyInvoice(false);
    setDecodeResponse({ description:'', amount: '' });
    setPaymentType(PaymentType.INVOICE);
    resetInvoice();
    resetAmount();
  };

  const paymentTypeChangeHandler = (event) => {
    setEmptyInvoice(false);
    setDecodeResponse({ description:'', amount: '' });
    setPaymentType(event.target.id);
    resetInvoice();
    resetAmount();
  }

  const invoiceDecodeHandler = (event) => {
    if (paymentType !== PaymentType.KEYSEND) {
      if (!isValidInvoice(event.target.value)) {
        event.preventDefault();
        touchFormControls();
        return;
      }
      decodeInvoice(event.target.value)
      .then((decodeRes: any) => {
        logger.info(decodeRes);
        if (decodeRes.data) {
          if (paymentType === PaymentType.OFFER) {
            if (!decodeRes.data.valid) {
              logger.error('Offer Invalid');
              setResponseStatus(CallStatus.ERROR);
              setResponseMessage('Invalid or Open Offer');
              delayedClearStatusAlert();
            } else if (!decodeRes.data.offer_amount_msat) {
              setEmptyInvoice(true);
              setDecodeResponse({ 
                description: (decodeRes.data.offer_description),
                amount: ('Open Offer')
              });
            } else {
              let amountmSats = 0;
              if (isCompatibleVersion((clnCtx.nodeInfo.version || ''), '23.02')) {
                amountmSats = decodeRes.data.offer_amount_msat || 0;
              } else {
                amountmSats = +(decodeRes.data.offer_amount_msat.substring(0, (decodeRes.data.offer_amount_msat.length - 4))) || 0;
              }
              amountChangeHandler({target: {value: (amountmSats / SATS_MSAT).toString()}});
              setDecodeResponse({ 
                description: (decodeRes.data.offer_description),
                amount: (formatCurrency(amountmSats, Units.MSATS, rootCtx.appConfig.uiConfig.unit, false, 0, 'string') + ' Sats')
              });
            }
          } else {
            if (decodeRes && decodeRes.data) {
              if (!decodeRes.data.amount_msat) {
                setEmptyInvoice(true);
                setDecodeResponse({ 
                  description: (decodeRes.data.description),
                  amount: ('Open Invoice')
                });
              } else {
                amountChangeHandler({target: {value: ((decodeRes.data.amount_msat) / SATS_MSAT).toString()}});
                setDecodeResponse({ 
                  description: (decodeRes.data.description),
                  amount: (formatCurrency((decodeRes.data.amount_msat || 0), Units.MSATS, rootCtx.appConfig.uiConfig.unit, false, 0, 'string') + ' Sats')
                });
              }
            }
          }
        } else {
          logger.error(decodeRes);
          setResponseStatus(CallStatus.ERROR);
          setResponseMessage(decodeRes.response.data || decodeRes.message || 'Unknown Error');
          delayedClearStatusAlert();
        }
      })
      .catch(err => {
        logger.error(err.response.data);
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(err.response.data);
        delayedClearStatusAlert();
      });
    }
  }

  const delayedClearStatusAlert = () => {
    setTimeout(() => {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }, CLEAR_STATUS_ALERT_DELAY);
  }

  const sendInvoice = (type: PaymentType, invoice: string, amount: number) => {
    let amtMSats = ((type === PaymentType.INVOICE && !emptyInvoice) || type === PaymentType.OFFER) ? null : (amount * SATS_MSAT);
    clnSendPayment(type, invoice, amtMSats)
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
      fetchInvoice(invoiceValue, +amountValue)
      .then((fetchInvoiceRes: any) => {
        logger.info(fetchInvoiceRes);
        sendInvoice(PaymentType.OFFER, fetchInvoiceRes.data.invoice, (+amountValue || 0));
      })
      .catch(err => {
        logger.error(err.response.data);
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(err.response.data);
        delayedClearStatusAlert();
      });
    } else {
      sendInvoice(paymentType, invoiceValue, (+amountValue || 0));
    }
  };

  return (
    <form onSubmit={CLNSendHandler} className='h-100' data-testid='cln-send'>
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
                  <Form.Label className='text-dark'>{paymentType === PaymentType.KEYSEND ? 'Pubkey' : paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'}*</Form.Label>
                  <InputGroup className={(invoiceHasError ? 'invalid' : '')}>
                    <InputGroup.Text className='form-control-addon form-control-addon-left'>
                      <AddressSVG />
                    </InputGroup.Text>
                    <Form.Control
                      tabIndex={4}
                      id='invoice'
                      data-testid='address-input'
                      type='text'
                      placeholder={paymentType === PaymentType.KEYSEND ? 'Pubkey' : paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'}
                      aria-label='invoice'
                      aria-describedby='addon-invoice'
                      className='form-control-right'
                      value={invoiceValue}
                      onChange={(event) => { invoiceChangeHandler(event); invoiceDecodeHandler(event)}}
                      onBlur={invoiceBlurHandler}
                    />
                    <Form.Text className='text-light col-12'>
                      <Row>
                        <Col xs={8} className='d-flex align-items-start justify-content-start overflow-x-ellipsis'>{decodeResponse.description}</Col>
                        <Col xs={4} className='d-flex align-items-end justify-content-end'>{decodeResponse.amount}</Col>
                      </Row>
                    </Form.Text>
                  </InputGroup>
                  {(invoiceHasError) ?
                      <InvalidInputMessage message={('Invalid ' + (paymentType === PaymentType.KEYSEND ? 'Pubkey' : paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'))} /> 
                    :
                      <div className='message'></div>
                  }
                </Col>
                {(paymentType === PaymentType.KEYSEND || emptyInvoice) ? 
                  <Col xs={12}>
                    <Form.Label className='text-dark'>Amount*</Form.Label>
                    <InputGroup className={(amountHasError ? 'invalid' : '')}>
                      <InputGroup.Text className='form-control-addon form-control-addon-left'>
                        <AmountSVG />
                      </InputGroup.Text>
                      <Form.Control
                        tabIndex={5}
                        id='amount'
                        data-testid='amount-input'
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
