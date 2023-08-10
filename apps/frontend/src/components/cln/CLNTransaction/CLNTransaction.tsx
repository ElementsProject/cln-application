import React from 'react';

import './CLNTransaction.scss';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { AppContext } from '../../../store/AppContext';
import { copyTextToClipboard, formatCurrency } from '../../../utilities/data-formatters';
import { TRANSITION_DURATION, Units } from '../../../utilities/constants';
import { CopySVG } from '../../../svgs/Copy';
import DateBox from '../../shared/DateBox/DateBox';
import logger from '../../../services/logger.service';

const TODAY = Math.floor(Date.now() / 1000);

const Payment = ({payment, copyHandler}) => {
  return (
    <>
    {payment.msatoshi || payment.amount_msat ?        
      <Row className='cln-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Transaction Fee (mSats)</Col>
        <Col xs={11} className='fs-7 overflow-x-ellipsis'>
          {payment.msatoshi_sent || payment.amount_sent_msat ? 
            formatCurrency(((payment.msatoshi_sent || payment.amount_sent_msat) - (payment.msatoshi || payment.amount_msat)), Units.MSATS, Units.MSATS, false, 0, 'string')
          :
            0
          }
        </Col>
      </Row>
      :
      <></>
    }
    {(payment.bolt11 || payment.bolt12) ?
      <Row className='cln-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Invoice</Col>
        <Col xs={11} className='pe-1 fs-7 overflow-x-ellipsis'>{payment.bolt11 || payment.bolt12}</Col>
        <Col xs={1} onClick={copyHandler} className='cln-transaction-copy'><CopySVG id='Invoice' showTooltip={true} /></Col>
      </Row>
    :
      <></>
    }
    {payment.payment_preimage ?
      <Row className='cln-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Preimage</Col>
        <Col xs={11} className='pe-1 fs-7 overflow-x-ellipsis'>{payment.payment_preimage}</Col>
        <Col xs={1} onClick={copyHandler} className='cln-transaction-copy'><CopySVG id='Preimage' showTooltip={true} /></Col>
      </Row>
    :
      <></>
    }
    </>
  )
};

const Invoice = ({invoice, copyHandler}) => {
  return (
    <>
    {invoice.paid_at && invoice.expires_at && invoice.expires_at > TODAY ?
      <Row className='cln-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Valid till</Col>
        <Col xs={11} className='fs-7 overflow-x-ellipsis'>
          <DateBox dataValue={invoice.expires_at} dataType={''} showTooltip={false} />
        </Col>
      </Row>
    :
      <></>
    }
    {(invoice.bolt11 || invoice.bolt12) ?
      <Row className='cln-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Invoice</Col>
        <Col xs={11} className='pe-1 fs-7 overflow-x-ellipsis'>{invoice.bolt11 || invoice.bolt12}</Col>
        <Col xs={1} onClick={copyHandler} className='cln-transaction-copy'><CopySVG id='Invoice' showTooltip={true} /></Col>
      </Row>
    :
      <></>
    }
    {invoice.payment_preimage ?
      <Row className='cln-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Preimage</Col>
        <Col xs={11} className='pe-1 fs-7 overflow-x-ellipsis'>{invoice.payment_preimage}</Col>
        <Col xs={1} onClick={copyHandler} className='cln-transaction-copy'><CopySVG id='Preimage' showTooltip={true} /></Col>
      </Row>
    :
      <></>
    }
    </>
  )
};

const CLNTransaction = (props) => {
  const appCtx = useContext(AppContext);
  
  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'Destination':
        textToCopy = props.transaction.destination;
        break;
      case 'Invoice':
        textToCopy = props.transaction.bolt11 || props.transaction.bolt12;
        break;
      case 'Preimage':
        textToCopy = props.transaction.payment_preimage;
        break;
      default:
        textToCopy = props.transaction.payment_hash;
        break;
    }
    copyTextToClipboard(textToCopy).then((response) => {
      appCtx.setShowToast({show: true, message: (event.target.id + ' Copied Successfully!'), bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  return (
    <motion.div
        variants={{ collapsed: { scale: 0.8, opacity: 0 }, open: { scale: 1, opacity: 1 } }}
        transition={{ duration: TRANSITION_DURATION }}
        className='cln-transaction-placeholder pb-2'
      >
        {props.transaction.type === 'PAYMENT' ? 
          <Payment payment={props.transaction} copyHandler={copyHandler} />
        :
          <Invoice invoice={props.transaction} copyHandler={copyHandler} />
        }
    </motion.div>
  );
};

export default CLNTransaction;
