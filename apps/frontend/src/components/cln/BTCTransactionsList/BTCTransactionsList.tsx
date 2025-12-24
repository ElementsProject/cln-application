import './BTCTransactionsList.scss';
import { useCallback, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { selectFiatConfig, selectFiatUnit, selectIsAuthenticated, selectIsDarkMode, selectUIConfigUnit } from '../../../store/rootSelectors';
import { selectListBitcoinTransactions } from '../../../store/clnSelectors';
import { CLNService } from '../../../services/http.service';
import { convertArrayToBTCTransactionsObj } from '../../../services/data-transform.service';
import { setListBitcoinTransactions, setListBitcoinTransactionsLoading } from '../../../store/clnSlice';
import { ListBitcoinTransactions } from '../../../types/cln.type';

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
          setExpanded(expanded.map((_, idx) => idx === i ? !expanded[i] : false));
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
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { btcTransactions, isLoading, page, hasMore, error } = useSelector(selectListBitcoinTransactions);
  const [expanded, setExpanded] = useState<boolean[]>(new Array(btcTransactions.length).fill(false));

  const loadMoreTransactions = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    dispatch(setListBitcoinTransactionsLoading(true));
    
    try {
      const offset = page * SCROLL_PAGE_SIZE;
      const listBtcTransactionsRes: any = await CLNService.listBTCTransactions(offset);
      
      if (listBtcTransactionsRes.error) {
        dispatch(setListBitcoinTransactions({ 
          error: listBtcTransactionsRes.error 
        } as ListBitcoinTransactions));
        return;
      }

      const latestBtcTransactions = convertArrayToBTCTransactionsObj(listBtcTransactionsRes.rows);

      setExpanded(prev => [...prev, ...new Array(latestBtcTransactions.length).fill(false)]);

      dispatch(setListBitcoinTransactions({ 
        btcTransactions: latestBtcTransactions,
        page: page + 1,
        hasMore: latestBtcTransactions.length >= SCROLL_PAGE_SIZE,
        isLoading: false,
        error: undefined
      } as ListBitcoinTransactions));
      
    } catch (error: any) {
      dispatch(setListBitcoinTransactions({ 
        error: error.message || 'Failed to load transactions'
      } as ListBitcoinTransactions));
    } finally {
      dispatch(setListBitcoinTransactionsLoading(false));
    }
  }, [isLoading, hasMore, page, dispatch]);

  const handleScroll = useCallback((container: HTMLElement) => {
    if (!container || isLoading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const bottomOffset = scrollHeight - scrollTop - clientHeight;
    
    if (bottomOffset < SCROLL_THRESHOLD) {
      loadMoreTransactions();
    }
  }, [isLoading, hasMore, loadMoreTransactions]);

  if (isAuthenticated && isLoading && btcTransactions.length === 0) {
    return (
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' />
      </span>
    );
  }

  if (error && btcTransactions.length === 0) {
    return <Alert className='py-0 px-1 fs-7' variant='danger'>{error}</Alert>;
  }

  if (!btcTransactions || btcTransactions.length === 0) {
    return (
      <Row className='text-light fs-6 h-75 mt-2 align-items-center justify-content-center'>
        <Row className='d-flex align-items-center justify-content-center'>
          {isDarkMode ? 
            <NoBTCTransactionDarkSVG className='no-btctx-dark pb-3' /> :
            <NoBTCTransactionLightSVG className='no-btctx-light pb-3' />
          }
          <Row className='text-center'>
            No transaction found. Click deposit to receive amount!
          </Row>
        </Row>
      </Row>
    );
  }

  return (
    <PerfectScrollbar
      onScrollY={handleScroll}
      className='btc-transactions-list' 
      data-testid='btc-transactions-list'
      options={{
        suppressScrollX: true,
        wheelPropagation: false
      }}
    >
      {btcTransactions.map((transaction, i) => (
        <BTCTransactionsAccordion 
          key={`tx-${i}-${transaction.txid}`}
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
      
      {!hasMore && btcTransactions.length > 0 && (
        <h6 className='d-flex align-self-center py-4 text-muted text-center'>
          No more transactions to load!
        </h6>
      )}
      
      {error && btcTransactions.length > 0 && (
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

export default BTCTransactionsList;
