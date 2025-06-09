import './CLNOffersList.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { IncomingArrowSVG } from '../../../svgs/IncomingArrow';
import Offer from '../CLNOffer/CLNOffer';
import { SCROLL_BATCH_SIZE, SCROLL_THRESHOLD, TRANSITION_DURATION } from '../../../utilities/constants';
import { NoCLNTransactionLightSVG } from '../../../svgs/NoCLNTransactionLight';
import { NoCLNTransactionDarkSVG } from '../../../svgs/NoCLNTransactionDark';
import { useSelector } from 'react-redux';
import { selectListOffers } from '../../../store/clnSelectors';
import { selectIsAuthenticated, selectIsDarkMode } from '../../../store/rootSelectors';

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
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const listOffers = useSelector(selectListOffers);
  const initExpansions = (listOffers.offers?.reduce((acc: boolean[]) => [...acc, false], []) || []);
  const [expanded, setExpanded] = useState<boolean[]>(initExpansions);

  const [displayedOffers, setDisplayedOffers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allOffersLoaded, setAllOffersLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const setContainerRef = useCallback((ref: HTMLElement | null) => {
    if (ref) {
      (containerRef as React.MutableRefObject<HTMLElement | null>).current = ref;
    }
  }, []);

  useEffect(() => {
    if (listOffers && listOffers.offers && listOffers.offers.length > 0) {
      const initialBatch = listOffers.offers.slice(0, SCROLL_BATCH_SIZE);
      setDisplayedOffers(initialBatch);
      setCurrentIndex(SCROLL_BATCH_SIZE);
      if (SCROLL_BATCH_SIZE >= listOffers?.offers?.length) {
        setAllOffersLoaded(true);
      }
    }
  }, [listOffers]);

  const loadMoreTransactions = useCallback(() => {
    if (isLoading || allOffersLoaded) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextIndex = currentIndex + SCROLL_BATCH_SIZE;
      const newOffers = listOffers?.offers?.slice(
        currentIndex,
        nextIndex
      ) || [];
      setDisplayedOffers(prev => [...prev, ...newOffers]);
      setCurrentIndex(nextIndex);

      if (listOffers && listOffers.offers && nextIndex >= listOffers?.offers?.length) {
        setAllOffersLoaded(true);
      }

      setIsLoading(false);
    }, 300);
  }, [currentIndex, isLoading, allOffersLoaded, listOffers]);

  const handleScroll = useCallback((container) => {
    if (!container || isLoading || allOffersLoaded) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const bottomOffset = scrollHeight - scrollTop - clientHeight;
    
    if (bottomOffset < SCROLL_THRESHOLD) {
      loadMoreTransactions();
    }
  }, [isLoading, allOffersLoaded, loadMoreTransactions]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container?.addEventListener('scroll', handleScroll);
      return () => container?.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    isAuthenticated && listOffers.isLoading ?
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' data-testid='cln-offers-list-spinner'/>
      </span> 
    : 
    listOffers.error ? 
      <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='cln-offers-list-error'>{listOffers.error}</Alert> : 
      listOffers?.offers && listOffers?.offers.length && listOffers?.offers.length > 0 ?
        <PerfectScrollbar
        containerRef={setContainerRef}
        onScrollY={handleScroll}
        className='cln-offers-list'
        data-testid='cln-offers-list'
        options={{
          suppressScrollX: true,
          wheelPropagation: false
        }}
        >
          {displayedOffers.map((offer, i) => (
            <CLNOffersAccordion key={i} i={i} expanded={expanded} setExpanded={setExpanded} initExpansions={initExpansions} offer={offer} />
          ))}
          {isLoading && (
            <Col xs={12} className='d-flex align-items-center justify-content-center mb-5'>
              <Spinner animation='grow' variant='primary' />
            </Col>
          )}
          {allOffersLoaded && listOffers?.offers.length > 100 && 
            <h6 className='d-flex align-self-center py-4 text-muted'>No more offers to load!</h6>
          }
        </PerfectScrollbar>
      :
        <Row className='text-light fs-6 h-75 mt-5 align-items-center justify-content-center'>
          <Row className='d-flex align-items-center justify-content-center mt-2'>
            { isDarkMode ? 
              <NoCLNTransactionDarkSVG className='no-clntx-dark pb-1' /> :
              <NoCLNTransactionLightSVG className='no-clntx-light pb-1' />
            }
            <Row className='text-center'>No offer found. Click receive to generate new offer!</Row>
          </Row>
        </Row>
  );
};

export default CLNOffersList;
