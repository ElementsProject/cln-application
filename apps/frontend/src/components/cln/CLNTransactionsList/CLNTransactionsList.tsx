import './CLNTransactionsList.scss';
import { useCallback, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveChannelsExist, selectFiatConfig, selectFiatUnit, selectIsAuthenticated, selectIsDarkMode, selectUIConfigUnit } from '../../../store/rootSelectors';
import { selectListLightningTransactions } from '../../../store/clnSelectors';
import { setListLightningTransactions, setListLightningTransactionsLoading } from '../../../store/clnSlice';
import { CLNService } from '../../../services/http.service';
import { ListLightningTransactions } from '../../../types/cln.type';

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
          setExpanded(expanded.map((_, idx) => idx === i ? !expanded[i] : false));
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
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const activeChannelsExist = useSelector(selectActiveChannelsExist);
  const { clnTransactions, isLoading, page, hasMore, error } = useSelector(selectListLightningTransactions);
  const [expanded, setExpanded] = useState<boolean[]>(new Array(clnTransactions.length).fill(false));

  // Load more transactions from API
  const loadMoreTransactions = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    dispatch(setListLightningTransactionsLoading(true));
    
    try {
      const offset = page * SCROLL_PAGE_SIZE;
      const listClnTransactionsRes: any = await CLNService.listLightningTransactions(offset);
      if (listClnTransactionsRes.error) {
        dispatch(setListLightningTransactions({ 
          error: listClnTransactionsRes.error 
        } as ListLightningTransactions));
        return;
      }
      setExpanded(prev => [...prev, ...new Array(listClnTransactionsRes.clnTransactions?.length).fill(false)]);
      dispatch(setListLightningTransactions({
        ...listClnTransactionsRes,
        page: page + 1,
        hasMore: listClnTransactionsRes.clnTransactions?.length >= SCROLL_PAGE_SIZE, // Could be greater also due to unique_timestamps aggregation
      } as ListLightningTransactions));
    } catch (error: any) {
      dispatch(setListLightningTransactions({ 
        error: error.message || 'Failed to load transactions'
      } as ListLightningTransactions));
    } finally {
      dispatch(setListLightningTransactionsLoading(false));
    }
  }, [isLoading, hasMore, page, dispatch]);

  // Scroll handler
  const handleScroll = useCallback((container: HTMLElement) => {
    if (!container || isLoading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const bottomOffset = scrollHeight - scrollTop - clientHeight;
    
    if (bottomOffset < SCROLL_THRESHOLD) {
      loadMoreTransactions();
    }
  }, [isLoading, hasMore, loadMoreTransactions]);

  // Render initial loading state
  if (isAuthenticated && isLoading && clnTransactions.length === 0) {
    return (
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' data-testid='cln-transactions-list-spinner' />
      </span>
    );
  }

  // Render error state
  if (error && clnTransactions.length === 0) {
    return (
      <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='cln-transactions-list-error'>
        {error}
      </Alert>
    );
  }

  // Render empty state
  if (!clnTransactions || clnTransactions.length === 0) {
    return (
      <Row className='text-light fs-6 h-75 mt-5 align-items-center justify-content-center'>
        <Row className='d-flex align-items-center justify-content-center mt-2'>
          {isDarkMode ?
            <NoCLNTransactionDarkSVG className='no-clntx-dark pb-1' /> :
            <NoCLNTransactionLightSVG className='no-clntx-light pb-1' />
          }
          <Row className='text-center'>
            {activeChannelsExist ?
              'No transaction found. Click send/receive to start!' :
              'No channel found. Open channel to start!'
            }
          </Row>
        </Row>
      </Row>
    );
  }

  // Render transactions list
  return (
    <PerfectScrollbar
      onScrollY={handleScroll}
      className='cln-transactions-list' 
      data-testid='cln-transactions-list'
      options={{
        suppressScrollX: true,
        wheelPropagation: false
      }}
    >
      {clnTransactions.map((transaction, i) => (
        <CLNTransactionsAccordion 
          key={`tx-${i}-${transaction.payment_hash}`}
          i={i} 
          expanded={expanded} 
          setExpanded={setExpanded} 
          transaction={transaction} 
        />
      ))}
      
      {isLoading && (
        <Col xs={12} className='d-flex align-items-center justify-content-center my-3'>
          <Spinner animation='grow' variant='primary' size='sm' />
          <span className='ms-2 text-muted'>Loading more transactions...</span>
        </Col>
      )}
      
      {!hasMore && clnTransactions.length > 0 && (
        <h6 className='d-flex align-self-center py-4 text-muted text-center'>
          No more transactions to load!
        </h6>
      )}
      
      {error && clnTransactions.length > 0 && (
        <Alert className='mx-3 my-2 py-2 px-3 fs-7' variant='warning'>
          {error}
          <button 
            className='btn btn-link btn-sm p-0 ms-2'
            onClick={loadMoreTransactions}
          >
            Retry
          </button>
        </Alert>
      )}
    </PerfectScrollbar>
  );
};

export default CLNTransactionsList;
