import './CLNTransactionsList.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { formatCurrency } from '../../../utilities/data-formatters';
import { IncomingArrowSVG } from '../../../svgs/IncomingArrow';
import { OutgoingArrowSVG } from '../../../svgs/OutgoingArrow';
import DateBox from '../../shared/DateBox/DateBox';
import FiatBox from '../../shared/FiatBox/FiatBox';
import Transaction from '../CLNTransaction/CLNTransaction';
import { TRANSITION_DURATION, Units, TODAY, SCROLL_PAGE_SIZE, SCROLL_THRESHOLD } from '../../../utilities/constants';
import { NoCLNTransactionLightSVG } from '../../../svgs/NoCLNTransactionLight';
import { NoCLNTransactionDarkSVG } from '../../../svgs/NoCLNTransactionDark';
import { useSelector } from 'react-redux';
import { selectActiveChannelsExist, selectFiatConfig, selectFiatUnit, selectIsAuthenticated, selectIsDarkMode, selectUIConfigUnit } from '../../../store/rootSelectors';
import { selectListLightningTransactions } from '../../../store/clnSelectors';

const PaymentHeader = ({ payment }) => {
  const fiatUnit = useSelector(selectFiatUnit);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  return (
    <Row
      className="transaction-list-item d-flex justify-content-between align-items-center"
      data-testid="payment-header"
    >
      <Col xs={2}>
        <OutgoingArrowSVG className="me-1" txStatus={payment.status} />
      </Col>
      <Col xs={10}>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={7} className="ps-2 d-flex align-items-center">
            <span className="text-dark fw-bold overflow-x-ellipsis">
              {payment.description || payment.payment_hash}
            </span>
          </Col>
          <Col
            xs={5}
            className="ps-0 d-flex align-items-center justify-content-end fw-bold text-darker-blue"
          >
            {payment.status?.toLowerCase() === 'complete'
              ? '-' +
              formatCurrency(
                payment.amount_sent_msat || 0,
                Units.MSATS,
                uiConfigUnit,
                false,
                0,
                'string',
              )
              : 0}
          </Col>
        </Row>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={8} className="ps-2 pe-0 fs-7 text-light d-flex flex-row">
            <span className="me-1">Created at</span>
            <DateBox dataValue={payment.created_at} dataType={'Created At'} showTooltip={false} />
          </Col>
          <Col
            xs={4}
            className="ps-0 fs-7 text-light d-flex align-items-center justify-content-end"
          >
            <FiatBox
              value={payment.amount_sent_msat || 0}
              fiatUnit={fiatUnit}
              fromUnit={Units.MSATS}
              symbol={fiatConfig.symbol}
              rate={fiatConfig.rate}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const InvoiceHeader = ({ invoice }) => {
  const fiatUnit = useSelector(selectFiatUnit);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  return (
    <Row
      className="transaction-list-item d-flex justify-content-between align-items-center"
      data-testid="invoice-header"
    >
      <Col xs={2}>
        <IncomingArrowSVG className="me-1" txStatus={invoice.status} />
      </Col>
      <Col xs={10}>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={7} className="ps-2 d-flex align-items-center">
            <span className="text-dark fw-bold overflow-x-ellipsis">
              {invoice.description || invoice.payment_hash}
            </span>
          </Col>
          <Col
            xs={5}
            className="ps-0 d-flex align-items-center justify-content-end fw-bold text-darker-blue"
          >
            {invoice.paid_at ? (
              <span>
                {'+' +
                  formatCurrency(
                    invoice.amount_received_msat || 0,
                    Units.MSATS,
                    uiConfigUnit,
                    false,
                    8,
                    'string',
                  )}
              </span>
            ) : (
              formatCurrency(
                invoice.amount_msat || 0,
                Units.MSATS,
                uiConfigUnit,
                false,
                8,
                'string',
              )
            )}
          </Col>
        </Row>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={8} className="ps-2 pe-0 fs-7 text-light d-flex flex-row align-items-center">
            {invoice.paid_at ? (
              <span className="me-1">Paid at</span>
            ) : invoice.expires_at > TODAY ? (
              <span className="me-1 text-valid">Valid till</span>
            ) : (
              <span className="me-1 text-invalid">Expired at</span>
            )}
            <DateBox
              dataValue={invoice.paid_at ? invoice.paid_at : invoice.expires_at}
              dataType={''}
              showTooltip={false}
            />
          </Col>
          <Col
            xs={4}
            className="ps-0 fs-7 text-light d-flex align-items-center justify-content-end"
          >
            <FiatBox
              value={invoice.paid_at ? invoice.amount_received_msat : invoice.amount_msat}
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

const CLNTransactionsAccordion = ({
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
        data-testid='cln-transaction-header'
        className={'cln-transaction-header ' + (expanded[i] ? 'expanded' : '')}
        initial={false}
        animate={{ backgroundColor: (isDarkMode ? (expanded[i] ? '#0C0C0F' : '#2A2A2C') : (expanded[i] ? '#EBEFF9' : '#FFFFFF')) }}
        transition={{ duration: TRANSITION_DURATION }}
        onClick={() => {
          initExpansions[i] = !expanded[i];
          return setExpanded(initExpansions);
        }}
      >
        {transaction.type?.toLowerCase() === 'payment' ? (
          <PaymentHeader payment={transaction} />
        ) : (
          <InvoiceHeader invoice={transaction} />
        )}
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded[i] && (
          <motion.div
            className="cln-transaction-details"
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

export const CLNTransactionsList = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const activeChannelsExist = useSelector(selectActiveChannelsExist);
  const listLightningTransactions = useSelector(selectListLightningTransactions);
  const initExpansions = (listLightningTransactions.clnTransactions?.reduce((acc: boolean[]) => [...acc, false], []) || []);
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
    if (listLightningTransactions?.clnTransactions?.length > 0) {
      setDisplayedTransactions(listLightningTransactions.clnTransactions);
      setCurrentIndex(SCROLL_PAGE_SIZE);
      if (SCROLL_PAGE_SIZE >= listLightningTransactions.clnTransactions.length) {
        setAllTransactionsLoaded(true);
      }
    }
  }, [listLightningTransactions]);

  const loadMoreTransactions = useCallback(() => {
    if (isLoading || allTransactionsLoaded) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextIndex = currentIndex + SCROLL_PAGE_SIZE;
      const newTransactions = listLightningTransactions.clnTransactions.slice(
        currentIndex,
        nextIndex
      );
      setDisplayedTransactions(prev => [...prev, ...newTransactions]);
      setCurrentIndex(nextIndex);

      if (nextIndex >= listLightningTransactions.clnTransactions.length) {
        setAllTransactionsLoaded(true);
      }

      setIsLoading(false);
    }, 300);
  }, [currentIndex, isLoading, allTransactionsLoaded, listLightningTransactions]);

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
    isAuthenticated && listLightningTransactions.isLoading ?
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' data-testid='cln-transactions-list-spinner' />
      </span>
      :
      listLightningTransactions.error ?
        <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='cln-transactions-list-error'>{listLightningTransactions.error}</Alert> :
      listLightningTransactions?.clnTransactions && listLightningTransactions?.clnTransactions.length && listLightningTransactions?.clnTransactions.length > 0 ?
        <PerfectScrollbar
          containerRef={setContainerRef}
          onScrollY={handleScroll}
          className='cln-transactions-list' 
          data-testid='cln-transactions-list'
          options={{
            suppressScrollX: true,
            wheelPropagation: false
          }}
        >
          {displayedTransactions.map((transaction, i) => (
            <CLNTransactionsAccordion key={i} i={i} expanded={expanded} setExpanded={setExpanded} initExpansions={initExpansions} transaction={transaction} />
          ))}
          {isLoading && (
            <Col xs={12} className='d-flex align-items-center justify-content-center mb-5'>
              <Spinner animation='grow' variant='primary' />
            </Col>
          )}
          {allTransactionsLoaded && listLightningTransactions?.clnTransactions.length > 100 && 
            <h6 className='d-flex align-self-center py-4 text-muted'>No more transactions to load!</h6>
          }
        </PerfectScrollbar>
        :
        <Row className='text-light fs-6 h-75 mt-5 align-items-center justify-content-center'>
          <Row className='d-flex align-items-center justify-content-center mt-2'>
            {isDarkMode ?
              <NoCLNTransactionDarkSVG className='no-clntx-dark pb-1' /> :
              <NoCLNTransactionLightSVG className='no-clntx-light pb-1' />
            }
            <Row className='text-center'>
              {activeChannelsExist ?
                'No transaction found. Click send/receive to start!' :
                'No transaction found. Open channel to start!'
              }
            </Row>
          </Row>
        </Row>
  );
};

export default CLNTransactionsList;
