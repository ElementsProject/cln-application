import React from 'react';

import './CLNOffersList.scss';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { AppContext } from '../../../store/AppContext';
import { IncomingArrowSVG } from '../../../svgs/IncomingArrow';
import Offer from '../CLNOffer/CLNOffer';
import { ApplicationModes, TRANSITION_DURATION } from '../../../utilities/constants';
import { NoCLNTransactionLightSVG } from '../../../svgs/NoCLNTransactionLight';
import { NoCLNTransactionDarkSVG } from '../../../svgs/NoCLNTransactionDark';

const OfferHeader = ({offer}) => {
  return (
    <Row className='offer-list-item d-flex justify-content-between align-items-center'>
      <Col xs={2}>
        <IncomingArrowSVG className='me-1' txStatus={offer.used ? 'used' : 'unused'} />
      </Col>
      <Col xs={10}>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={12} className='ps-2 d-flex align-items-center'>
            <span className='text-dark fw-bold overflow-x-ellipsis'>{offer.label || offer.offer_id}</span>
          </Col>
        </Row>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={8} className='ps-2 pe-0 fs-7 text-light d-flex flex-row align-items-center'>
            <span className='text-dark fw-bold overflow-x-ellipsis'>{offer.active ? 'Active' : 'Inactive'}</span>
          </Col>
          <Col xs={4} className='ps-0 fs-7 text-light d-flex align-items-center justify-content-end'>
            <span className='text-dark fw-bold overflow-x-ellipsis'>{offer.single_use ? 'Single Use' : 'Multi Use'}</span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const CLNOffersAccordion = ({ i, expanded, setExpanded, initExpansions, offer, appConfig, fiatConfig }) => {
  return (
    <>
      <motion.div
        className={'cln-offer-header ' + (expanded[i] ? 'expanded' : '')}
        initial={false}
        animate={{ backgroundColor: ((appConfig.uiConfig.appMode === ApplicationModes.DARK) ? (expanded[i] ? '#0C0C0F' : '#2A2A2C') : (expanded[i] ? '#EBEFF9' : '#FFFFFF')) }}
        transition={{ duration: TRANSITION_DURATION }}
        onClick={() => { initExpansions[i]=!expanded[i]; return setExpanded(initExpansions); }}>
        <OfferHeader offer={offer} />
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded[i] && (
          <motion.div
            className='cln-offer-details'
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
            <Offer offer={offer} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const CLNOffersList = () => {
  const appCtx = useContext(AppContext);
  const initExpansions = (appCtx.listOffers.offers?.reduce((acc: boolean[], curr) => [...acc, false], []) || []);
  const [expanded, setExpanded] = useState<boolean[]>(initExpansions);

  return (
    appCtx.authStatus.isAuthenticated && appCtx.listOffers.isLoading ?
      <span className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' variant='primary' data-testid='cln-offers-list-spinner'/>
      </span> 
    : 
    appCtx.listOffers.error ? 
      <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='cln-offers-list-error'>{appCtx.listOffers.error}</Alert> : 
      appCtx.listOffers?.offers && appCtx.listOffers?.offers.length && appCtx.listOffers?.offers.length > 0 ?
        <div className='cln-offers-list' data-testid='cln-offers-list'>
          { 
            appCtx.listOffers?.offers?.map((offer, i) => (
              <CLNOffersAccordion key={i} i={i} expanded={expanded} setExpanded={setExpanded} initExpansions={initExpansions} offer={offer} appConfig={appCtx.appConfig} fiatConfig={appCtx.fiatConfig} />
            ))
          }
        </div>
      :
        <Row className='text-light fs-6 h-75 mt-5 align-items-center justify-content-center'>
          <Row className='d-flex align-items-center justify-content-center mt-2'>
            { appCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK ? 
              <NoCLNTransactionDarkSVG className='no-clntx-dark pb-1' /> :
              <NoCLNTransactionLightSVG className='no-clntx-light pb-1' />
            }
            <Row className='text-center'>No offer found. Click receive to generate new offer!</Row>
          </Row>
        </Row>
  );
};

export default CLNOffersList;
