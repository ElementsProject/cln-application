import React from 'react';

import './Logout.scss';
import { useContext } from 'react';
import { Modal, Col } from 'react-bootstrap';

import useHttp from '../../../hooks/use-http';
import { QuestionMarkSVG } from '../../../svgs/QuestionMark';
import { RootContext } from '../../../store/RootContext';

const LogoutComponent = () => {
  const rootCtx = useContext(RootContext);
  const { userLogout } = useHttp();

  const logoutHandler = (event) => {
    if (event === true) {
      userLogout();
    }
    closeHandler();
  };

  const closeHandler = () => {
    rootCtx.setShowModals({...rootCtx.showModals, logoutModal: false});
  }

  return (
    <form className='h-100'>
      <Modal show={rootCtx.showModals.logoutModal} onHide={closeHandler} centered className='modal-lg' data-testid='logout-modal'>
        <Modal.Body className='p-0 w-100 d-flex align-items-start justify-content-start'>
          <Col className='d-flex align-items-stretch justify-content-between modal-box'>
            <Col xs={2} className='message-type-box d-flex align-items-center justify-content-center'>
              <QuestionMarkSVG />
            </Col>
            <Col xs={10} className='p-3'>
              <Col className='d-flex align-items-center justify-content-between'>
                <Col xs={7} className='ps-1'>Logout?</Col>
                <button type="button" className="btn btn-rounded btn-sm btn-secondary" onClick={() => logoutHandler(true)}>Yes</button>
                <button type="button" className="btn btn-rounded btn-sm btn-secondary" onClick={() => logoutHandler(false)}>No</button>
              </Col>
            </Col>
          </Col>
        </Modal.Body>
      </Modal>
    </form>
  );
}

export default LogoutComponent;
