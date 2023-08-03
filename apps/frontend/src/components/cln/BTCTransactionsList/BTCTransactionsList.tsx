import React from 'react';

import './BTCTransactionsList.scss';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { AppContext } from '../../../store/AppContext';
import { formatCurrency, titleCase } from '../../../utilities/data-formatters';
import { IncomingArrowSVG } from '../../../svgs/IncomingArrow';
import { OutgoingArrowSVG } from '../../../svgs/OutgoingArrow';
import DateBox from '../../shared/DateBox/DateBox';
import FiatBox from '../../shared/FiatBox/FiatBox';
import Transaction from '../BTCTransaction/BTCTransaction';
import { ApplicationModes, TRANSITION_DURATION, Units } from '../../../utilities/constants';
import { NoBTCTransactionDarkSVG } from '../../../svgs/NoBTCTransactionDark';
import { NoBTCTransactionLightSVG } from '../../../svgs/NoBTCTransactionLight';

const WithdrawHeader = ({withdraw, appConfig, fiatConfig}) => {
  return (
    <Row className='transaction-list-item d-flex justify-content-between align-items-center'>
      <Col xs={2}>
        <OutgoingArrowSVG className='me-1' txStatus={withdraw.tag} />
      </Col>
      <Col xs={10}>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={7} className='ps-2 d-flex align-items-center'>
            <span className='text-dark fw-bold overflow-x-ellipsis'>{titleCase(withdraw.tag)}</span>
          </Col>
          <Col xs={5} className='ps-0 d-flex align-items-center justify-content-end fw-bold text-darker-blue'>
            <span>{'-' + (formatCurrency((withdraw.debit_msat || 0), Units.MSATS, appConfig.unit, false, 0, 'string'))}</span>
          </Col>
        </Row>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={8} className='ps-2 pe-0 fs-7 text-light d-flex flex-row'>
            <DateBox dataValue={withdraw.timestamp} dataType={'Created At'} showTooltip={false} />
          </Col>
          <Col xs={4} className='ps-0 fs-7 text-light d-flex align-items-center justify-content-end'>
            <FiatBox value={(withdraw.debit_msat || 0)} fromUnit={Units.MSATS} fiatUnit={appConfig.fiatUnit} symbol={fiatConfig.symbol} rate={fiatConfig.rate} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const DepositHeader = ({deposit, appConfig, fiatConfig}) => {
  return (
    <Row className='transaction-list-item d-flex justify-content-between align-items-center'>
      <Col xs={2}>
        <IncomingArrowSVG className='me-1' txStatus={deposit.tag} />
      </Col>
      <Col xs={10}>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={7} className='ps-2 d-flex align-items-center'>
            <span className='text-dark fw-bold overflow-x-ellipsis'>{titleCase(deposit.tag)}</span>
          </Col>
          <Col xs={5} className='ps-0 d-flex align-items-center justify-content-end fw-bold text-darker-blue'>
            <span>{'+' + (formatCurrency((deposit.credit_msat || 0), Units.MSATS, appConfig.unit, false, 8, 'string'))}</span>
          </Col>
        </Row>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={8} className='ps-2 pe-0 fs-7 text-light d-flex flex-row align-items-center'>
            <DateBox dataValue={deposit.timestamp} dataType={'Created At'} showTooltip={false} />
          </Col>
          <Col xs={4} className='ps-0 fs-7 text-light d-flex align-items-center justify-content-end'>
            <FiatBox value={(deposit.credit_msat || 0)} fromUnit={Units.MSATS} fiatUnit={appConfig.fiatUnit} symbol={fiatConfig.symbol} rate={fiatConfig.rate} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const BTCTransactionsAccordion = ({ i, expanded, setExpanded, initExpansions, transaction, appConfig, fiatConfig }) => {
  return (
    <>
      <motion.div
        className={'btc-transaction-header ' + (expanded[i] ? 'expanded' : '')}
        initial={false}
        animate={{ backgroundColor: ((appConfig.appMode === ApplicationModes.DARK) ? (expanded[i] ? '#0C0C0F' : '#2A2A2C') : (expanded[i] ? '#EBEFF9' : '#FFFFFF')) }}
        transition={{ duration: TRANSITION_DURATION }}
        onClick={() => { initExpansions[i]=!expanded[i]; return setExpanded(initExpansions); }}>
        {transaction?.tag === 'withdrawal' ? <WithdrawHeader withdraw={transaction} appConfig={appConfig} fiatConfig={fiatConfig} /> : <DepositHeader deposit={transaction} appConfig={appConfig} fiatConfig={fiatConfig} /> }
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded[i] && (
          <motion.div
            className='btc-transaction-details'
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

export const BTCTransactionsList = () => {
  const appCtx = useContext(AppContext);
  const initExpansions = (appCtx.listBitcoinTransactions.btcTransactions?.reduce((acc: boolean[], curr) => [...acc, false], []) || []);
  const [expanded, setExpanded] = useState<boolean[]>(initExpansions);

  return (
    appCtx.isAuthenticated && appCtx.listBitcoinTransactions.isLoading ?
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' />
      </span> 
    : 
    appCtx.listBitcoinTransactions.error ? 
      <Alert className='py-0 px-1 fs-7' variant='danger'>{appCtx.listBitcoinTransactions.error}</Alert> : 
      appCtx.listBitcoinTransactions?.btcTransactions && appCtx.listBitcoinTransactions?.btcTransactions.length && appCtx.listBitcoinTransactions?.btcTransactions.length > 0 ?
        <div className='btc-transactions-list'>
          { 
            appCtx.listBitcoinTransactions?.btcTransactions?.map((transaction, i) => (
              <BTCTransactionsAccordion key={i} i={i} expanded={expanded} setExpanded={setExpanded} initExpansions={initExpansions} transaction={transaction} appConfig={appCtx.appConfig} fiatConfig={appCtx.fiatConfig} />
            ))
          }
        </div>
      :
        <Row className='text-light fs-6 h-75 mt-2 align-items-center justify-content-center'>
          <Row className='d-flex align-items-center justify-content-center'>
            { appCtx.appConfig.appMode === ApplicationModes.DARK ? 
              <NoBTCTransactionDarkSVG className='no-btctx-dark pb-3' /> :
              <NoBTCTransactionLightSVG className='no-btctx-light pb-3' />
            }
            <Row className='text-center'>No transaction found. Click deposit to receive amount!</Row>
          </Row>
        </Row>
  );
};

export default BTCTransactionsList;
