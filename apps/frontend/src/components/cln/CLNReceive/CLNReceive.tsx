import './CLNReceive.scss';
import { useState } from 'react';
import { Card, Row, Col, Spinner, Button, Form, InputGroup } from 'react-bootstrap';

import logger from '../../../services/logger.service';
import useInput from '../../../hooks/use-input';
import { CallStatus, CLEAR_STATUS_ALERT_DELAY, PaymentType, SATS_MSAT } from '../../../utilities/constants';
import { ActionSVG } from '../../../svgs/Action';
import { AmountSVG } from '../../../svgs/Amount';
import { DescriptionSVG } from '../../../svgs/Description';
import { LightningWalletSVG } from '../../../svgs/LightningWallet';
import QRCodeComponent from '../../shared/QRCode/QRCode';
import FiatBox from '../../shared/FiatBox/FiatBox';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { CloseSVG } from '../../../svgs/Close';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import { CLNService } from '../../../services/http.service';
import { useSelector } from 'react-redux';
import { selectFiatConfig, selectFiatUnit } from '../../../store/rootSelectors';

const CLNReceive = (props) => {
  const fiatUnit = useSelector(selectFiatUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  const [paymentType, setPaymentType] = useState(PaymentType.INVOICE);
  const [showInvoice, setShowInvoice] = useState(false);
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidAmount = value => value.trim() === '' || !isNaN(value);
  const isValidDescription = value => value.trim() !== '';

  const {
    value: descriptionValue,
    isValid: descriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescription,
  } = useInput(isValidDescription);
  const {
    value: amountValue,
    isValid: amountIsValid,
    hasError: amountHasError,
    valueChangeHandler: amountChangeHandler,
    inputBlurHandler: amountBlurHandler,
    reset: resetAmount,
  } = useInput(isValidAmount);

  let formIsValid = false;

  if (descriptionIsValid && amountIsValid) {
    formIsValid = true;
  }

  const paymentTypeChangeHandler = event => {
    setPaymentType(event.target.id);
    resetDescription();
    resetAmount();
  };

  const touchFormControls = () => {
    descriptionBlurHandler(null);
    amountBlurHandler(null);
  };

  const resetFormValues = () => {
    resetDescription();
    resetAmount();
  };

  const delayedClearStatusAlert = () => {
    setTimeout(() => {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }, CLEAR_STATUS_ALERT_DELAY);
  };

  const CLNReceiveHandler = event => {
    event.preventDefault();
    touchFormControls();
    if (!formIsValid) {
      return;
    }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage(
      'Generating ' + (paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice') + '...',
    );
    let amtValueMSats = amountValue === '' ? 'any' : +amountValue * SATS_MSAT;
    CLNService.clnReceiveInvoice(
      paymentType,
      amtValueMSats,
      descriptionValue,
      'invoicelbl' + Math.random().toString(36).slice(2) + Date.now(),
    )
      .then((response: any) => {
        logger.info(response);
        if (response.bolt11 || response.bolt12) {
          setResponseStatus(CallStatus.SUCCESS);
          setResponseMessage(response.bolt11 || response.bolt12);
          setShowInvoice(true);
          resetFormValues();
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

  if (showInvoice) {
    return (
      <Row className="h-100 mx-1" data-testid='cln-invoice'>
        <Card className="d-flex align-items-stretch px-0" data-testid='cln-invoice-card'>
          <Card.Body className="d-flex align-items-stretch flex-column pt-4">
            <Card.Header className="p-0 d-flex align-items-start justify-content-between">
              <div className="p-0 fw-bold text-primary d-flex align-items-center">
                <LightningWalletSVG svgClassName="svg-small me-2" className="fill-primary" />
                <span className="fw-bold">Lightning Wallet</span>
              </div>
              <span className="span-close-svg" onClick={props.onClose}>
                <CloseSVG />
              </span>
            </Card.Header>
            <h4 className="text-blue fw-bold mt-2">
              {paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'}
            </h4>
            <Card.Body className="p-0 d-flex align-items-start justify-content-center">
              <Row className="w-100 d-flex align-items-start justify-content-center">
                <QRCodeComponent
                  message={responseMessage}
                  toastMessage={
                    (paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice') +
                    ' Copied Successfully!'
                  }
                  className="py-0 px-1 d-flex flex-column align-items-center justify-content-start"
                />
              </Row>
            </Card.Body>
          </Card.Body>
        </Card>
      </Row>
    );
  }

  return (
    <form onSubmit={CLNReceiveHandler} className='h-100' data-testid='cln-receive'>
      <Card className='h-100 d-flex align-items-stretch px-0' data-testid='cln-receive-card'>
        <Card.Body className='d-flex align-items-stretch flex-column pt-4'>
            <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
              <div className='p-0 fw-bold text-primary d-flex align-items-center'>
                <LightningWalletSVG svgClassName='svg-small me-2' className='fill-primary' />
                <span className='fw-bold'>Lightning Wallet</span>
              </div>
              <span className='span-close-svg' onClick={props.onClose}><CloseSVG /></span>
            </Card.Header>
            <h4 className='text-blue fw-bold mt-2'>Generate {paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'}</h4>
            <Card.Body className='pb-0 px-1 d-flex flex-column align-items-start justify-content-between'>
              <Row className='d-flex align-items-start justify-content-center'>
                <Col xs={12} className='mb-3 d-flex align-items-start justify-content-start'>
                  <Form.Check tabIndex={1} onChange={paymentTypeChangeHandler} checked={paymentType === PaymentType.INVOICE} inline className='text-dark' label='Invoice' name='payType' type='radio' id='Invoice' />
                  <Form.Check tabIndex={2} onChange={paymentTypeChangeHandler} checked={paymentType === PaymentType.OFFER} inline className='ms-3 text-dark' label='Offer' name='payType' type='radio' id='Offer' />
                </Col>
                <Col xs={12}>
                  <Form.Label className='text-dark'>Description*</Form.Label>
                  <InputGroup className={(descriptionHasError ? 'invalid' : '')}>
                    <InputGroup.Text className='form-control-addon form-control-addon-left'>
                      <DescriptionSVG />
                    </InputGroup.Text>
                    <Form.Control
                      tabIndex={3}
                      id='description'
                      type='text'
                      placeholder='Description'
                      aria-label='description'
                      aria-describedby='addon-description'
                      className='form-control-right'
                      value={descriptionValue}
                      onChange={descriptionChangeHandler}
                      onBlur={descriptionBlurHandler}
                    />
                  </InputGroup>
                  {(descriptionHasError) ?
                      <InvalidInputMessage message={'Invalid Description'} />
                    :
                      <div className='message'></div>
                  }
                </Col>
                <Col xs={12}>
                  <Form.Label className='text-dark'>Amount</Form.Label>
                  <InputGroup className={(amountHasError ? 'invalid' : '')}>
                    <InputGroup.Text className='form-control-addon form-control-addon-left'>
                      <AmountSVG />
                    </InputGroup.Text>
                    <Form.Control
                      tabIndex={4}
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
                  {!amountHasError ?
                    amountValue && amountValue !== 'All' ?
                      <p className='fs-7 text-light d-flex align-items-center justify-content-end'>
                        ~ <FiatBox value={(+amountValue || 0)} fiatUnit={fiatUnit} symbol={fiatConfig.symbol} rate={fiatConfig.rate} />
                      </p>
                    :
                      <p className='message'></p>
                  :
                    <InvalidInputMessage message={
                        (+amountValue < 0) ? 
                          'Amount should be greater than 0'
                        :
                          'Invalid Amount'
                    } />
                  }
                </Col>
              </Row>
              <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
            </Card.Body>
            <Card.Footer className='d-flex justify-content-center'>
              <Button tabIndex={5} type='submit' variant='primary' className='btn-rounded' data-testid='button-generate' disabled={responseStatus === CallStatus.PENDING}>
                Generate {paymentType === PaymentType.OFFER ? 'Offer' : 'Invoice'}
                {responseStatus === CallStatus.PENDING ? <Spinner className='mt-1 ms-2 text-white-dark' size='sm' /> : <ActionSVG className='ms-3' />}
              </Button>
            </Card.Footer>
        </Card.Body>
      </Card>
    </form>
  );
};

export default CLNReceive;
