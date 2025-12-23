import './CLNOffersList.scss';
import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { IncomingArrowSVG } from '../../../svgs/IncomingArrow';
import Offer from '../CLNOffer/CLNOffer';
import { SCROLL_PAGE_SIZE, SCROLL_THRESHOLD, TRANSITION_DURATION } from '../../../utilities/constants';
import { NoCLNTransactionLightSVG } from '../../../svgs/NoCLNTransactionLight';
import { NoCLNTransactionDarkSVG } from '../../../svgs/NoCLNTransactionDark';
import { useDispatch, useSelector } from 'react-redux';
import { selectListOffers } from '../../../store/clnSelectors';
import { selectIsAuthenticated, selectIsDarkMode } from '../../../store/rootSelectors';
import { ListOffers } from '../../../types/cln.type';
import { setListOffers, setListOffersLoading } from '../../../store/clnSlice';
import { convertArrayToOffersObj } from '../../../services/data-transform.service';
import { CLNService } from '../../../services/http.service';

const OfferHeader = ({ offer }) => {
  return (
    <Row className="offer-list-item d-flex justify-content-between align-items-center">
      <Col xs={2}>
        <IncomingArrowSVG className="me-1" txStatus={offer.used ? 'used' : 'unused'} />
      </Col>
      <Col xs={10}>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={12} className="ps-2 d-flex align-items-center">
            <span className="text-dark fw-bold overflow-x-ellipsis">
              {offer.label || offer.offer_id}
            </span>
          </Col>
        </Row>
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={8} className="ps-2 pe-0 fs-7 text-light d-flex flex-row align-items-center">
            <span className="text-dark fw-bold overflow-x-ellipsis">
              {offer.active ? 'Active' : 'Inactive'}
            </span>
          </Col>
          <Col
            xs={4}
            className="ps-0 fs-7 text-light d-flex align-items-center justify-content-end"
          >
            <span className="text-dark fw-bold overflow-x-ellipsis">
              {offer.single_use ? 'Single Use' : 'Multi Use'}
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const CLNOffersAccordion = ({
  i,
  expanded,
  setExpanded,
  initExpansions,
  offer,
}) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  return (
    <>
      <motion.div
        data-testid='cln-offer-header'
        className={'cln-offer-header ' + (expanded[i] ? 'expanded' : '')}
        initial={false}
        animate={{ backgroundColor: (isDarkMode ? (expanded[i] ? '#0C0C0F' : '#2A2A2C') : (expanded[i] ? '#EBEFF9' : '#FFFFFF')) }}
        transition={{ duration: TRANSITION_DURATION }}
        onClick={() => {
          initExpansions[i] = !expanded[i];
          return setExpanded(initExpansions);
        }}
      >
        <OfferHeader offer={offer} />
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded[i] && (
          <motion.div
            data-testid='cln-offer-details'
            className='cln-offer-details'
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: TRANSITION_DURATION, ease: [0.4, 0.52, 0.83, 0.98] }}
          >
            <Offer offer={offer} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const CLNOffersList = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { offers, isLoading, page, hasMore, error } = useSelector(selectListOffers);
  
  const initExpansions = offers?.reduce((acc: boolean[]) => [...acc, false], []) || [];
  const [expanded, setExpanded] = useState<boolean[]>(initExpansions);

  // Load more offers from API
  const loadMoreOffers = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    dispatch(setListOffersLoading(true));
    
    try {
      const offset = page * SCROLL_PAGE_SIZE;
      const listOffersRes: any = await CLNService.listOffers(offset);
      
      if (listOffersRes.error) {
        dispatch(setListOffers({ 
          error: listOffersRes.error 
        } as ListOffers));
        return;
      }

      const latestOffers = convertArrayToOffersObj(listOffersRes.rows);
      
      dispatch(setListOffers({ 
        offers: latestOffers,
        page: page + 1,
        hasMore: latestOffers.length >= SCROLL_PAGE_SIZE,
        isLoading: false,
        error: undefined
      } as ListOffers));
      
    } catch (error: any) {
      dispatch(setListOffers({ 
        error: error.message || 'Failed to load offers'
      } as ListOffers));
    } finally {
      dispatch(setListOffersLoading(false));
    }
  }, [isLoading, hasMore, page, dispatch]);

  // Update expanded state when offers change
  useEffect(() => {
    const newExpansions = offers?.reduce((acc: boolean[]) => [...acc, false], []) || [];
    if (newExpansions.length !== expanded.length) {
      setExpanded(newExpansions);
    }
  }, [offers.length]);

  // Scroll handler
  const handleScroll = useCallback((container: HTMLElement) => {
    if (!container || isLoading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const bottomOffset = scrollHeight - scrollTop - clientHeight;
    
    if (bottomOffset < SCROLL_THRESHOLD) {
      loadMoreOffers();
    }
  }, [isLoading, hasMore, loadMoreOffers]);

  // Render initial loading state
  if (isAuthenticated && isLoading && offers.length === 0) {
    return (
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' data-testid='cln-offers-list-spinner' />
      </span>
    );
  }

  // Render error state
  if (error && offers.length === 0) {
    return (
      <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='cln-offers-list-error'>
        {error}
      </Alert>
    );
  }

  // Render empty state
  if (!offers || offers.length === 0) {
    return (
      <Row className='text-light fs-6 h-75 mt-5 align-items-center justify-content-center'>
        <Row className='d-flex align-items-center justify-content-center mt-2'>
          {isDarkMode ? 
            <NoCLNTransactionDarkSVG className='no-clntx-dark pb-1' /> :
            <NoCLNTransactionLightSVG className='no-clntx-light pb-1' />
          }
          <Row className='text-center'>
            No offer found. Click receive to generate new offer!
          </Row>
        </Row>
      </Row>
    );
  }

  // Render offers list
  return (
    <PerfectScrollbar
      onScrollY={handleScroll}
      className='cln-offers-list'
      data-testid='cln-offers-list'
      options={{
        suppressScrollX: true,
        wheelPropagation: false
      }}
    >
      {offers.map((offer, i) => (
        <CLNOffersAccordion 
          key={`offer-${i}-${offer.offer_id}`}
          i={i} 
          expanded={expanded} 
          setExpanded={setExpanded} 
          initExpansions={initExpansions} 
          offer={offer} 
        />
      ))}
      
      {isLoading && (
        <Col xs={12} className='d-flex align-items-center justify-content-center my-3'>
          <Spinner animation='grow' variant='primary' size='sm' />
          <span className='ms-2 text-muted'>Loading more offers...</span>
        </Col>
      )}
      
      {!hasMore && offers.length > 0 && (
        <h6 className='d-flex align-self-center py-4 text-muted text-center'>
          No more offers to load!
        </h6>
      )}
      
      {error && offers.length > 0 && (
        <Alert className='mx-3 my-2 py-2 px-3 fs-7' variant='warning'>
          {error}
          <button 
            className='btn btn-link btn-sm p-0 ms-2'
            onClick={loadMoreOffers}
          >
            Retry
          </button>
        </Alert>
      )}
    </PerfectScrollbar>
  );
};

export default CLNOffersList;
