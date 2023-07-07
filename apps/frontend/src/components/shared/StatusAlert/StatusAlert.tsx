import React from 'react';
import './StatusAlert.scss';
import { motion } from 'framer-motion';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';

import { CallStatus, OPACITY_VARIANTS } from '../../../utilities/constants';
import { copyTextToClipboard, titleCase } from '../../../utilities/data-formatters';
import { InformationSVG } from '../../../svgs/Information';
import { CopySVG } from '../../../svgs/Copy';
import { AppContext } from '../../../store/AppContext';
import { useContext } from 'react';
import logger from '../../../services/logger.service';

const StatusAlert = props => {
  const appCtx = useContext(AppContext);

  const copyHandler = (event) => {
    copyTextToClipboard(props.responseMessage).then((response) => {
      appCtx.setShowToast({show: true, message: ('Response Copied Successfully!'), bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  return (
    (props.responseStatus !== CallStatus.NONE) ?
      <motion.div 
        className={'w-100 d-flex align-items-start justify-content-center alert alert-' + (props.responseStatus === CallStatus.ERROR ? 'danger' : props.responseStatus === CallStatus.PENDING ? 'warning' : props.responseStatus === CallStatus.SUCCESS ? 'success' : '')}
        initial='hidden'
        animate='visible'
        exit='hidden'
        variants={OPACITY_VARIANTS}
        transition={{ ease: "easeOut", duration: 1 }}
      >
        <Col xs={1} className='d-flex align-items-start justify-content-start mt-1'>
          {props.responseStatus === CallStatus.PENDING ? <Spinner className='me-2' variant='primary' size='sm' /> : <InformationSVG svgClassName='information-svg' className={props.responseStatus === CallStatus.ERROR ? 'fill-danger' : 'fill-success'} />}
        </Col>
        <Col xs={10} className='px-1 text-status'>{titleCase(props.responseMessage)}</Col>
        { props.responseStatus !== CallStatus.PENDING ?
          <Col xs={1} onClick={copyHandler} className='d-flex align-items-start justify-content-end btn-sm-svg btn-svg-copy mt-1' id=''><CopySVG id='' showTooltip={true} /></Col>
          :
          <></>
        }
      </motion.div>
    :
      <></>
  );
};

export default StatusAlert;
