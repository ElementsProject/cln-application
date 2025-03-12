import React from 'react';

import './ToastMessage.scss';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTriangleExclamation, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion';
import { Toast, Col } from 'react-bootstrap';

import { BOUNCY_SPRING_VARIANTS_3, STAGERRED_SPRING_VARIANTS_2 } from '../../../utilities/constants';
import { CloseSVG } from '../../../svgs/Close';
import { QuestionMarkSVG } from '../../../svgs/QuestionMark';
import { RootContext } from '../../../store/RootContext';

const ToastMessage = (props) => {
  const rootCtx = useContext(RootContext);
  const [y, setY] = useState('0');
  const TOAST_SHOW = props.showOnComponent ? !!props.show : !!rootCtx.showToast.show;
  const TOAST_TYPE = props.type || rootCtx.showToast.type || '';
  const SHOW_DELAY = props.showDelay  || rootCtx.showToast.delay || 3000;
  const TOAST_BG = props.bg || rootCtx.showToast.bg || 'primary';
  const TOAST_CONTAINER_CLASS_NAME = 'toast-container w-100 d-flex justify-content-center ' + (props.containerClassName || rootCtx.showToast.containerClassName || 'top-0');
  const TOAST_CLASS_NAME = 'd-flex align-items-start justify-content-between ' + (props.className || rootCtx.showToast.className || '');
  const TOAST_MESSAGE = props.message || rootCtx.showToast.message || '';

  useEffect(() => {
    if (!props.showOnComponent) {
      setY((TOAST_SHOW ? '3rem' : '0'));
    }
  }, [props.showOnComponent, TOAST_SHOW]);
  
  const closeHandler = () => {
    if (!props.showOnComponent) {
      rootCtx.setShowToast({...rootCtx.showToast, show: false});
    }
  }

  const confirmCloseHandler = (response) => {
    if (!props.showOnComponent) {
      rootCtx.setShowToast({...rootCtx.showToast, show: false, onConfirmResponse: response});
    } else {
      props.onConfirmResponse(response);
    }
  }

  return (
    <>
    {
      TOAST_TYPE === 'CONFIRM' ?
        TOAST_SHOW ?
          <motion.div variants={STAGERRED_SPRING_VARIANTS_2} initial='hidden' animate='visible' exit='hidden' custom={props.custom || 0} className={TOAST_CONTAINER_CLASS_NAME}>
            <Toast show={true} onClose={closeHandler} delay={SHOW_DELAY || 3000} data-bg={TOAST_BG} className={TOAST_CLASS_NAME}>
              <Toast.Body className='p-0 w-100 d-flex align-items-start justify-content-start'>
                <Col className='d-flex align-items-stretch justify-content-between'>
                  <Col xs={2} className='message-type-box d-flex align-items-center justify-content-center'>
                    <QuestionMarkSVG />
                  </Col>
                  <Col xs={10} className='p-2'>
                    <Col className='d-flex align-items-center justify-content-between'>
                      <Col xs={6}>
                        {TOAST_MESSAGE || 'Default Message!'}
                      </Col>
                      <button type="button" className="btn btn-rounded btn-sm btn-secondary" onClick={() => confirmCloseHandler(true)}>Yes</button>
                      <button type="button" className="btn btn-rounded btn-sm btn-secondary" onClick={() => confirmCloseHandler(false)}>No</button>
                    </Col>
                  </Col>
                </Col>
              </Toast.Body>
            </Toast>
          </motion.div>
        :
          <></>
      :
        <motion.div animate={{y}} transition={BOUNCY_SPRING_VARIANTS_3} className={TOAST_CONTAINER_CLASS_NAME}>
          <Toast show={TOAST_SHOW} onClose={closeHandler} delay={SHOW_DELAY || 3000} autohide data-bg={TOAST_BG} className={TOAST_CLASS_NAME}>
            <Toast.Body className='p-0 w-100 d-flex align-items-stretch justify-content-start'>
              <Col className='d-flex align-items-stretch justify-content-between'>
                <Col xs={2} className='message-type-box d-flex align-items-center justify-content-center'>
                  <FontAwesomeIcon className='svg-white fa-xl' icon={TOAST_BG === 'success' ? faCheck : TOAST_BG === 'danger' ? faTriangleExclamation : faExclamationCircle} />
                </Col>
                <Col xs={10} className='p-2'>
                  <Col className='d-flex align-items-center justify-content-between'>
                    {TOAST_MESSAGE || 'Default Message!'}
                    <span className='btn-toast-close' onClick={closeHandler}><CloseSVG /></span>
                  </Col>
                </Col>
              </Col>
            </Toast.Body>
          </Toast>
        </motion.div>
    }
    </>
  );
}

export default ToastMessage;
