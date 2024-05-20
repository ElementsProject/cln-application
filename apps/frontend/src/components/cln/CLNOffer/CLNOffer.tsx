import React from 'react';

import './CLNOffer.scss';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { AppContext } from '../../../store/AppContext';
import { CopySVG } from '../../../svgs/Copy';
import { TRANSITION_DURATION } from '../../../utilities/constants';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import logger from '../../../services/logger.service';

const OfferDetail = ({offer, copyHandler}) => {
  return (
    <>
    {offer.bolt12 ?
      <Row className='cln-offer-detail' data-testid='cln-offer-detail'>
        <Col xs={12} className='fs-7 text-light'>Bolt 12</Col>
        <Col xs={11} className='pe-1 fs-7 overflow-x-ellipsis'>{offer.bolt12}</Col>
        <Col xs={1} onClick={copyHandler} className='cln-offer-copy' id='Bolt12'><CopySVG id='Bolt12' showTooltip={true} /></Col>
      </Row>
    :
      <></>
    }
    </>
  )
};

const CLNOffer = (props) => {
  const appCtx = useContext(AppContext);
  
  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'Bolt12':
        textToCopy = props.offer.bolt12;
        break;
      default:
        textToCopy = props.offer.bolt12;
        break;
    }
    copyTextToClipboard(textToCopy).then((response) => {
      appCtx.setShowToast({show: true, message: (event.target.id + ' Copied Successfully!'), bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  return (
    <motion.div
        variants={{ collapsed: { scale: 0.8, opacity: 0 }, open: { scale: 1, opacity: 1 } }}
        transition={{ duration: TRANSITION_DURATION }}
        className='cln-offer-placeholder pb-2'
      >
      <OfferDetail offer={props.offer} copyHandler={copyHandler} />
    </motion.div>
  );
};

export default CLNOffer;
