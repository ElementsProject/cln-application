import React from 'react';

import './Login.scss';
import { useContext, useState } from 'react';
import SHA256 from "crypto-js/sha256";

import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import logger from '../../../services/logger.service';
import useInput from '../../../hooks/use-input';
import useHttp from '../../../hooks/use-http';
import { CallStatus } from '../../../utilities/constants';
import { AppContext } from '../../../store/AppContext';
import { ActionSVG } from '../../../svgs/Action';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { PasswordSVG } from '../../../svgs/Password';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import { ShowSVG } from '../../../svgs/Show';
import { HideSVG } from '../../../svgs/Hide';

const LoginComponent = () => {
  const appCtx = useContext(AppContext);
  const { userLogin, initiateDataLoading } = useHttp();
  const [hidePassword, setHidePassword] = useState(true);
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidPassword = (value) => value.trim() !== '';

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(isValidPassword);

  let formIsValid = false;

  if (passwordIsValid) {
    formIsValid = true;
  };
  
  const touchFormControls = () => {
    passwordBlurHandler(null);
  };

  const resetFormValues = () => {
    resetPassword();
  };

  const loginHandler = (event) => {
    touchFormControls();
    if (!formIsValid) { return; }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Logging In...');
    userLogin(SHA256(passwordValue).toString())
    .then((response: any) => {
      logger.info(response);
      if (response) {
        setHidePassword(true);
        setResponseStatus(CallStatus.NONE);
        setResponseMessage('');
        resetFormValues();
        initiateDataLoading();
        appCtx.setShowModals({...appCtx.showModals, loginModal: false});
      } else {
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(response.response.data || response.message || 'Unknown Error');
      }
    })
    .catch(err => {
      logger.error(err.response?.data || err.message || JSON.stringify(err));
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(err.response && err.response.data && err.response.data.error ? err.response.data.error : err.response?.data || err.message || JSON.stringify(err));
    });
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <form className='h-100'>
      <Modal show={appCtx.showModals.loginModal} centered className='modal-lg' data-testid='login-modal'>
        <Modal.Header className='d-flex align-items-start justify-content-start pb-0'></Modal.Header>
        <Modal.Body className='py-0'>
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className=' text-dark'>Password*</Form.Label>
              <InputGroup className={(passwordHasError ? 'invalid ' : '')}>
                <InputGroup.Text className='form-control-addon form-control-addon-left'>
                  <PasswordSVG />
                </InputGroup.Text>
                <Form.Control
                  tabIndex={1}
                  autoFocus={true}
                  id='password'
                  type={hidePassword ? 'password' : 'text'}
                  placeholder='Password'
                  aria-label='password'
                  aria-describedby='addon-password'
                  className={(hidePassword && passwordValue !== '') ? 'form-control-middle password-input-ctrl' : 'form-control-middle'}
                  value={passwordValue}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                />
                <InputGroup.Text className={'form-control-addon form-control-addon-right'}>
                  <span onClick={() => togglePasswordVisibility()}>{hidePassword ? <ShowSVG /> : <HideSVG />}</span>
                </InputGroup.Text>
              </InputGroup>
              {(passwordHasError) ?
                  <InvalidInputMessage message={'Invalid Password'} />
                :
                  <div className='message'></div>
              }
            </Col>
          </Row>
          <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
        </Modal.Body>
        <Modal.Footer>
          <button tabIndex={2} type='button' className='btn-rounded bg-primary' onClick={loginHandler} disabled={responseStatus === CallStatus.PENDING}>
            Login
            {responseStatus === CallStatus.PENDING ? <Spinner className='mt-1 ms-2 text-white-dark' size='sm' /> : <ActionSVG className='ms-3' />}
          </button>
        </Modal.Footer>
      </Modal>
    </form>
  );
}

export default LoginComponent;
