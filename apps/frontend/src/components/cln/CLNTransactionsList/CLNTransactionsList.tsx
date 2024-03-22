import React from 'react';

import './CLNTransactionsList.scss';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { AppContext } from '../../../store/AppContext';
import { formatCurrency } from '../../../utilities/data-formatters';
import { IncomingArrowSVG } from '../../../svgs/IncomingArrow';
import { OutgoingArrowSVG } from '../../../svgs/OutgoingArrow';
import DateBox from '../../shared/DateBox/DateBox';
import FiatBox from '../../shared/FiatBox/FiatBox';
import Transaction from '../CLNTransaction/CLNTransaction';
import { ApplicationModes, TRANSITION_DURATION, Units } from '../../../utilities/constants';
import { NoCLNTransactionLightSVG } from '../../../svgs/NoCLNTransactionLight';
import { NoCLNTransactionDarkSVG } from '../../../svgs/NoCLNTransactionDark';

const TODAY = Math.floor(Date.now() / 1000);

const PaymentHeader = ({payment, appConfig, fiatConfig}) => {
  return (
    <Row className='transaction-list-item d-flex justify-content-between align-items-center' data-testid='payment-header'>
      <Col xs={2}>
        <OutgoingArrowSVG className='me-1' txStatus={payment.status} />
      </Col>
      <Col xs={10}>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={7} className='ps-2 d-flex align-items-center'>
            <span className='text-dark fw-bold overflow-x-ellipsis'>{payment.description || payment.payment_hash}</span>
          </Col>
          <Col xs={5} className='ps-0 d-flex align-items-center justify-content-end fw-bold text-darker-blue'>
            { payment.status === 'complete' ?
              '-' + (formatCurrency((payment.msatoshi_sent || payment.amount_sent_msat || 0), Units.MSATS, appConfig.unit, false, 0, 'string'))
            :
              0
            }
          </Col>
        </Row>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={8} className='ps-2 pe-0 fs-7 text-light d-flex flex-row'>
            <span className='me-1'>Created at</span>
            <DateBox dataValue={payment.created_at} dataType={'Created At'} showTooltip={false} />
          </Col>
          <Col xs={4} className='ps-0 fs-7 text-light d-flex align-items-center justify-content-end'>
            <FiatBox value={(payment.msatoshi_sent || payment.amount_sent_msat || 0)} fiatUnit={appConfig.fiatUnit} fromUnit={Units.MSATS} symbol={fiatConfig.symbol} rate={fiatConfig.rate} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const InvoiceHeader = ({invoice, appConfig, fiatConfig}) => {
  return (
    <Row className='transaction-list-item d-flex justify-content-between align-items-center' data-testid='invoice-header'>
      <Col xs={2}>
        <IncomingArrowSVG className='me-1' txStatus={invoice.status} />
      </Col>
      <Col xs={10}>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={7} className='ps-2 d-flex align-items-center'>
            <span className='text-dark fw-bold overflow-x-ellipsis'>{invoice.description || invoice.payment_hash}</span>
          </Col>
          <Col xs={5} className='ps-0 d-flex align-items-center justify-content-end fw-bold text-darker-blue'>
            {invoice.paid_at ?
              <span>{'+' + (formatCurrency((invoice.msatoshi_received || invoice.amount_received_msat || 0), Units.MSATS, appConfig.unit, false, 8, 'string'))}</span>
            :
              (formatCurrency((invoice.msatoshi || invoice.amount_msat || 0), Units.MSATS, appConfig.unit, false, 8, 'string'))
            }
          </Col>
        </Row>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={8} className='ps-2 pe-0 fs-7 text-light d-flex flex-row align-items-center'>
            {invoice.paid_at ? <span className='me-1'>Paid at</span> : 
              invoice.expires_at > TODAY ?
                <span className='me-1 text-valid'>Valid till</span>
              :
                <span className='me-1 text-invalid'>Expired at</span>
            }
            <DateBox dataValue={invoice.paid_at ? invoice.paid_at : invoice.expires_at} dataType={''} showTooltip={false} />
          </Col>
          <Col xs={4} className='ps-0 fs-7 text-light d-flex align-items-center justify-content-end'>
            <FiatBox value={(invoice.paid_at ? (invoice.msatoshi_received || invoice.amount_received_msat) : (invoice.msatoshi || invoice.amount_msat))} fromUnit={Units.MSATS} fiatUnit={appConfig.fiatUnit} symbol={fiatConfig.symbol} rate={fiatConfig.rate} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const CLNTransactionsAccordion = ({ i, expanded, setExpanded, initExpansions, transaction, appConfig, fiatConfig }) => {
  return (
    <>
      <motion.div
        className={'cln-transaction-header ' + (expanded[i] ? 'expanded' : '')}
        initial={false}
        animate={{ backgroundColor: ((appConfig.appMode === ApplicationModes.DARK) ? (expanded[i] ? '#0C0C0F' : '#2A2A2C') : (expanded[i] ? '#EBEFF9' : '#FFFFFF')) }}
        transition={{ duration: TRANSITION_DURATION }}
        onClick={() => { initExpansions[i]=!expanded[i]; return setExpanded(initExpansions); }}>
        {transaction.type === 'PAYMENT' ? <PaymentHeader payment={transaction} appConfig={appConfig} fiatConfig={fiatConfig} /> : <InvoiceHeader invoice={transaction} appConfig={appConfig} fiatConfig={fiatConfig} /> }
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded[i] && (
          <motion.div
            className='cln-transaction-details'
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: TRANSITION_DURATION, ease: [0.4, 0.52, 0.83, 0.98] }}
          >
            <Transaction transaction={transaction} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const CLNTransactionsList = () => {
  const appCtx = useContext(AppContext);
  const initExpansions = (appCtx.listLightningTransactions.clnTransactions?.reduce((acc: boolean[], curr) => [...acc, false], []) || []);
  const [expanded, setExpanded] = useState<boolean[]>(initExpansions);
  return (
    appCtx.authStatus.isAuthenticated && appCtx.listLightningTransactions.isLoading ?
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' data-testid='cln-transactions-list-spinner'/>
      </span> 
    : 
    appCtx.listLightningTransactions.error ? 
      <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='cln-transactions-list-error'>{appCtx.listLightningTransactions.error}</Alert> : 
      appCtx.listLightningTransactions?.clnTransactions && appCtx.listLightningTransactions?.clnTransactions.length && appCtx.listLightningTransactions?.clnTransactions.length > 0 ?
        <div className='cln-transactions-list' data-testid='cln-transactions-list'>
          { 
            appCtx.listLightningTransactions?.clnTransactions?.map((transaction, i) => (
              <CLNTransactionsAccordion key={i} i={i} expanded={expanded} setExpanded={setExpanded} initExpansions={initExpansions} transaction={transaction} appConfig={appCtx.appConfig} fiatConfig={appCtx.fiatConfig} />
            ))
          }
        </div>
      :
        <Row className='text-light fs-6 h-75 mt-5 align-items-center justify-content-center'>
          <Row className='d-flex align-items-center justify-content-center mt-2'>
            { appCtx.appConfig.appMode === ApplicationModes.DARK ? 
              <NoCLNTransactionDarkSVG className='no-clntx-dark pb-1' /> :
              <NoCLNTransactionLightSVG className='no-clntx-light pb-1' />
            }
            <Row className='text-center'>
            { (appCtx.listChannels.activeChannels.length > 0) ? 
              'No transaction found. Click send/receive to start!' : 
              'No transaction found. Open channel to start!'
            }
            </Row>
          </Row>
        </Row>
  );
};

export default CLNTransactionsList;
