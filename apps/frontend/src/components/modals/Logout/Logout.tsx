import React from 'react';

import './Logout.scss';
import { useContext } from 'react';

import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';

import useHttp from '../../../hooks/use-http';
import { QuestionMarkSVG } from '../../../svgs/QuestionMark';
import { AppContext } from '../../../store/AppContext';

const LogoutComponent = () => {
  const appCtx = useContext(AppContext);
  const { userLogout } = useHttp();

  const logoutHandler = (event) => {
    if (event === true) {
      userLogout();
    }
    closeHandler();
  };

  const closeHandler = () => {
    appCtx.setShowModals({...appCtx.showModals, logoutModal: false});
  }

  return (
    <form className='h-100'>
      <Modal show={appCtx.showModals.logoutModal} onHide={closeHandler} centered className='modal-lg'>
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
