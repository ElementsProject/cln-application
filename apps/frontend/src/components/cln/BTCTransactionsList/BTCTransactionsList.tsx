import './BTCTransactionsList.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner, Alert, Row, Col } from 'react-bootstrap';

import { formatCurrency, titleCase } from '../../../utilities/data-formatters';
import { IncomingArrowSVG } from '../../../svgs/IncomingArrow';
import { OutgoingArrowSVG } from '../../../svgs/OutgoingArrow';
import DateBox from '../../shared/DateBox/DateBox';
import FiatBox from '../../shared/FiatBox/FiatBox';
import Transaction from '../BTCTransaction/BTCTransaction';
import { TRANSITION_DURATION, Units } from '../../../utilities/constants';
import { NoBTCTransactionDarkSVG } from '../../../svgs/NoBTCTransactionDark';
import { NoBTCTransactionLightSVG } from '../../../svgs/NoBTCTransactionLight';
import { useSelector } from 'react-redux';
import { selectFiatConfig, selectFiatUnit, selectIsAuthenticated, selectIsDarkMode, selectUIConfigUnit } from '../../../store/rootSelectors';
import { selectListBitcoinTransactions } from '../../../store/clnSelectors';

const WithdrawHeader = ({ withdraw }) => {
  const fiatUnit = useSelector(selectFiatUnit);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  return (
    <Row data-testid='withdraw-header' className="transaction-list-item d-flex justify-content-between align-items-center">
      <Col xs={2}>
        <OutgoingArrowSVG className="me-1" txStatus={withdraw.tag} />
      </Col>
      <Col xs={10}>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={7} className="ps-2 d-flex align-items-center">
            <span className="text-dark fw-bold overflow-x-ellipsis">{titleCase(withdraw.tag)}</span>
          </Col>
          <Col
            xs={5}
            className="ps-0 d-flex align-items-center justify-content-end fw-bold text-darker-blue"
          >
            <span data-testid='withdraw-amount'>
              {'-' +
                formatCurrency(
                  withdraw.debit_msat || 0,
                  Units.MSATS,
                  uiConfigUnit,
                  false,
                  0,
                  'string',
                )}
            </span>
          </Col>
        </Row>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={8} className="ps-2 pe-0 fs-7 text-light d-flex flex-row">
            <DateBox dataValue={withdraw.timestamp} dataType={'Created At'} showTooltip={false} />
          </Col>
          <Col
            xs={4}
            className="ps-0 fs-7 text-light d-flex align-items-center justify-content-end"
          >
            <FiatBox
              value={withdraw.debit_msat || 0}
              fromUnit={Units.MSATS}
              fiatUnit={fiatUnit}
              symbol={fiatConfig.symbol}
              rate={fiatConfig.rate}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const DepositHeader = ({ deposit }) => {
  const fiatUnit = useSelector(selectFiatUnit);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  return (
    <Row data-testid='deposit-header' className="transaction-list-item d-flex justify-content-between align-items-center">
      <Col xs={2}>
        <IncomingArrowSVG className="me-1" txStatus={deposit.tag} />
      </Col>
      <Col xs={10}>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={7} className="ps-2 d-flex align-items-center">
            <span className="text-dark fw-bold overflow-x-ellipsis">{titleCase(deposit.tag)}</span>
          </Col>
          <Col
            xs={5}
            className="ps-0 d-flex align-items-center justify-content-end fw-bold text-darker-blue"
          >
            <span>
              {'+' +
                formatCurrency(
                  deposit.credit_msat || 0,
                  Units.MSATS,
                  uiConfigUnit,
                  false,
                  8,
                  'string',
                )}
            </span>
          </Col>
        </Row>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={8} className="ps-2 pe-0 fs-7 text-light d-flex flex-row align-items-center">
            <DateBox dataValue={deposit.timestamp} dataType={'Created At'} showTooltip={false} />
          </Col>
          <Col
            xs={4}
            className="ps-0 fs-7 text-light d-flex align-items-center justify-content-end"
          >
            <FiatBox
              value={deposit.credit_msat || 0}
              fromUnit={Units.MSATS}
              fiatUnit={fiatUnit}
              symbol={fiatConfig.symbol}
              rate={fiatConfig.rate}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const BTCTransactionsAccordion = ({
  i,
  expanded,
  setExpanded,
  initExpansions,
  transaction,
}) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  return (
    <>
      <motion.div
        data-testid='btc-transaction-header'
        className={'btc-transaction-header ' + (expanded[i] ? 'expanded' : '')}
        initial={false}
        animate={{ backgroundColor: (isDarkMode ? (expanded[i] ? '#0C0C0F' : '#2A2A2C') : (expanded[i] ? '#EBEFF9' : '#FFFFFF')) }}
        transition={{ duration: TRANSITION_DURATION }}
        onClick={() => {
          initExpansions[i] = !expanded[i];
          return setExpanded(initExpansions);
        }}
      >
        {transaction?.tag?.toLowerCase() === 'withdrawal' ? (
          <WithdrawHeader withdraw={transaction} />
        ) : (
          <DepositHeader deposit={transaction} />
        )}
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded[i] && (
          <motion.div
            className="btc-transaction-details"
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
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
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const listBitcoinTransactions = useSelector(selectListBitcoinTransactions);
  const initExpansions = (listBitcoinTransactions.btcTransactions?.reduce((acc: boolean[]) => [...acc, false], []) || []);
  const [expanded, setExpanded] = useState<boolean[]>(initExpansions);

  return (
    isAuthenticated && listBitcoinTransactions.isLoading ?
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' />
      </span> 
    : 
    listBitcoinTransactions.error ? 
      <Alert className='py-0 px-1 fs-7' variant='danger'>{listBitcoinTransactions.error}</Alert> : 
      listBitcoinTransactions?.btcTransactions && listBitcoinTransactions?.btcTransactions.length && listBitcoinTransactions?.btcTransactions.length > 0 ?
        <div className='btc-transactions-list' data-testid='btc-transactions-list'>
          { 
            listBitcoinTransactions?.btcTransactions?.map((transaction, i) => (
              <BTCTransactionsAccordion key={i} i={i} expanded={expanded} setExpanded={setExpanded} initExpansions={initExpansions} transaction={transaction} />
            ))
          }
        </div>
      :
        <Row className='text-light fs-6 h-75 mt-2 align-items-center justify-content-center'>
          <Row className='d-flex align-items-center justify-content-center'>
            { isDarkMode ? 
              <NoBTCTransactionDarkSVG className='no-btctx-dark pb-3' /> :
              <NoBTCTransactionLightSVG className='no-btctx-light pb-3' />
            }
            <Row className='text-center'>No transaction found. Click deposit to receive amount!</Row>
          </Row>
        </Row>
  );
};

export default BTCTransactionsList;
