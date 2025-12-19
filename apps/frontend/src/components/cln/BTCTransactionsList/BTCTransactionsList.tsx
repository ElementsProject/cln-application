import './BTCTransactionsList.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner, Alert, Row, Col } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { formatCurrency, titleCase } from '../../../utilities/data-formatters';
import { IncomingArrowSVG } from '../../../svgs/IncomingArrow';
import { OutgoingArrowSVG } from '../../../svgs/OutgoingArrow';
import DateBox from '../../shared/DateBox/DateBox';
import FiatBox from '../../shared/FiatBox/FiatBox';
import Transaction from '../BTCTransaction/BTCTransaction';
import { SCROLL_PAGE_SIZE, SCROLL_THRESHOLD, TRANSITION_DURATION, Units } from '../../../utilities/constants';
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
            <span className="text-dark fw-bold text-dark overflow-x-ellipsis">{titleCase(withdraw.tag)}</span>
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
            <span className="text-dark fw-bold text-dark overflow-x-ellipsis">{titleCase(deposit.tag)}</span>
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

  const [displayedTransactions, setDisplayedTransactions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allTransactionsLoaded, setAllTransactionsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const setContainerRef = useCallback((ref: HTMLElement | null) => {
    if (ref) {
      (containerRef as React.MutableRefObject<HTMLElement | null>).current = ref;
    }
  }, []);

  useEffect(() => {
    if (listBitcoinTransactions?.btcTransactions?.length > 0) {
      const initialBatch = listBitcoinTransactions?.btcTransactions.slice(0, SCROLL_PAGE_SIZE);
      setDisplayedTransactions(initialBatch);
      setCurrentIndex(SCROLL_PAGE_SIZE);
      if (SCROLL_PAGE_SIZE >= listBitcoinTransactions?.btcTransactions.length) {
        setAllTransactionsLoaded(true);
      }
    }
  }, [listBitcoinTransactions]);

  const loadMoreTransactions = useCallback(() => {
    if (isLoading || allTransactionsLoaded) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextIndex = currentIndex + SCROLL_PAGE_SIZE;
      const newTransactions = listBitcoinTransactions?.btcTransactions.slice(
        currentIndex,
        nextIndex
      );
      setDisplayedTransactions(prev => [...prev, ...newTransactions]);
      setCurrentIndex(nextIndex);

      if (nextIndex >= listBitcoinTransactions?.btcTransactions.length) {
        setAllTransactionsLoaded(true);
      }

      setIsLoading(false);
    }, 300);
  }, [currentIndex, isLoading, allTransactionsLoaded, listBitcoinTransactions]);

  const handleScroll = useCallback((container) => {
    if (!container || isLoading || allTransactionsLoaded) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const bottomOffset = scrollHeight - scrollTop - clientHeight;
    
    if (bottomOffset < SCROLL_THRESHOLD) {
      loadMoreTransactions();
    }
  }, [isLoading, allTransactionsLoaded, loadMoreTransactions]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container?.addEventListener('scroll', handleScroll);
      return () => container?.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    isAuthenticated && listBitcoinTransactions.isLoading ?
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' />
      </span> 
    : 
    listBitcoinTransactions.error ? 
      <Alert className='py-0 px-1 fs-7' variant='danger'>{listBitcoinTransactions.error}</Alert> : 
      listBitcoinTransactions?.btcTransactions && listBitcoinTransactions?.btcTransactions.length && listBitcoinTransactions?.btcTransactions.length > 0 ?
        <PerfectScrollbar
          containerRef={setContainerRef}
          onScrollY={handleScroll}
          className='btc-transactions-list' 
          data-testid='btc-transactions-list'
          options={{
            suppressScrollX: true,
            wheelPropagation: false
          }}
        >
          {displayedTransactions.map((transaction, i) => (
            <BTCTransactionsAccordion key={i} i={i} expanded={expanded} setExpanded={setExpanded} initExpansions={initExpansions} transaction={transaction} />
          ))}
          {isLoading && (
            <Col xs={12} className='d-flex align-items-center justify-content-center mb-5'>
              <Spinner animation='grow' variant='primary' />
            </Col>
          )}
          {allTransactionsLoaded && listBitcoinTransactions?.btcTransactions.length > 100 && 
            <h6 className='d-flex align-self-center py-4 text-muted'>No more transactions to load!</h6>
          }
        </PerfectScrollbar>
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
