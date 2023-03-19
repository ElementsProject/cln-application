import './CLNTransaction.scss';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { AppContext } from '../../../store/AppContext';
import { formatCurrency } from '../../../utilities/data-formatters';
import { TRANSITION_DURATION, Units } from '../../../utilities/constants';
import { CopySVG } from '../../../svgs/Copy';
import DateBox from '../../shared/DateBox/DateBox';

const TODAY = Math.floor(Date.now() / 1000);

const Payment = ({payment, copyHandler}) => {
  return (
    <>
    {payment.msatoshi ?        
      <Row className='cln-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Transaction Fee (mSats)</Col>
        <Col xs={11} className='fs-7 overflow-x-ellipsis'>
          {payment.msatoshi_sent ? 
            formatCurrency((payment.msatoshi_sent - payment.msatoshi), Units.MSATS, Units.MSATS, false, 0, 'string')
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
    switch (event.target.id) {
      case 'Destination':
        navigator.clipboard.writeText(props.transaction.destination || '');
        break;
      case 'Invoice':
        navigator.clipboard.writeText(props.transaction.bolt11 || props.transaction.bolt12 || '');
        break;
      case 'Preimage':
        navigator.clipboard.writeText(props.transaction.payment_preimage || '');
        break;
      default:
        navigator.clipboard.writeText(props.transaction.payment_hash || '');
        break;
    }
    appCtx.setShowToast({show: true, message: (event.target.id + ' Copied Successfully!'), bg: 'success'});
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
