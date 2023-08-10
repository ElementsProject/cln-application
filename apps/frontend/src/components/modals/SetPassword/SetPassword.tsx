import React from 'react';

import './SetPassword.scss';
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
import { CloseSVG } from '../../../svgs/Close';

const SetPasswordComponent = () => {
  const appCtx = useContext(AppContext);
  const { resetUserPassword, initiateDataLoading } = useHttp();
  const [hideCurrPassword, setHideCurrPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmNewPassword, setHideConfirmNewPassword] = useState(true);
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidCurrPassword = (value) => value.trim() !== '';
  const isValidNewPassword = (value) => value.trim() !== '';
  const isValidConfirmNewPassword = (value) => value.trim() !== '' && value === newPasswordValue;

  const {
    value: currPasswordValue,
    isValid: currPasswordIsValid,
    hasError: currPasswordHasError,
    valueChangeHandler: currPasswordChangeHandler,
    inputBlurHandler: currPasswordBlurHandler,
    reset: resetCurrPassword,
  } = useInput(isValidCurrPassword);

  const {
    value: newPasswordValue,
    isValid: newPasswordIsValid,
    hasError: newPasswordHasError,
    valueChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
    reset: resetNewPassword,
  } = useInput(isValidNewPassword);

  const {
    value: confirmNewPasswordValue,
    isValid: confirmNewPasswordIsValid,
    hasError: confirmNewPasswordHasError,
    valueChangeHandler: confirmNewPasswordChangeHandler,
    inputBlurHandler: confirmNewPasswordBlurHandler,
    reset: resetConfirmNewPassword,
  } = useInput(isValidConfirmNewPassword);

  let formIsValid = false;

  if (
    (appCtx.authStatus.isValidPassword && currPasswordIsValid && newPasswordIsValid && confirmNewPasswordIsValid)
    || (!appCtx.authStatus.isValidPassword && newPasswordIsValid && confirmNewPasswordIsValid)
  ) {
    formIsValid = true;
  };
  
  const touchFormControls = () => {
    currPasswordBlurHandler(null);
    newPasswordBlurHandler(null);
    confirmNewPasswordBlurHandler(null);
  };

  const resetFormValues = () => {
    resetCurrPassword();
    resetNewPassword();
    resetConfirmNewPassword();
  };

  const resetPasswordHandler = (event) => {
    touchFormControls();
    if (!formIsValid) { return; }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Resetting Password...');
    resetUserPassword(appCtx.authStatus.isValidPassword, appCtx.authStatus.isValidPassword ? SHA256(currPasswordValue).toString() : '', SHA256(newPasswordValue).toString())
    .then((response: any) => {
      logger.info(response);
      if (response) {
        setHideCurrPassword(true);
        setHideNewPassword(true);
        setHideConfirmNewPassword(true);
        setResponseStatus(CallStatus.NONE);
        setResponseMessage('');
        resetFormValues();
        initiateDataLoading();
        appCtx.setShowModals({...appCtx.showModals, setPasswordModal: false});
      } else {
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(response.response.data || response.message || 'Unknown Error');
      }
    })
    .catch(err => {
      logger.error(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(err.response && err.response.data && err.response.data.error ? err.response.data.error : err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
    });
  };

  const toggleCurrPasswordVisibility = () => {
    setHideCurrPassword(!hideCurrPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setHideNewPassword(!hideNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setHideConfirmNewPassword(!hideConfirmNewPassword);
  };

  const closeHandler = () => {
    appCtx.setShowModals({...appCtx.showModals, setPasswordModal: false});
  }

  return (
    <form className='h-100'>
      <Modal show={appCtx.showModals.setPasswordModal} onHide={appCtx.authStatus.isValidPassword ? closeHandler : ()=>{}} centered className='modal-lg'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0'>
          { appCtx.authStatus.isValidPassword
            ? <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
            : <></>
          }
        </Modal.Header>
        <Modal.Body className='py-0'>
          <Row className='d-flex align-items-start justify-content-center'>
            { appCtx.authStatus.isValidPassword ?
              <Col xs={12}>
                <Form.Label className=' text-dark'>Current Password*</Form.Label>
                <InputGroup className={(currPasswordHasError ? 'invalid ' : '')}>
                  <InputGroup.Text className='form-control-addon form-control-addon-left'>
                    <PasswordSVG />
                  </InputGroup.Text>
                  <Form.Control
                    tabIndex={1}
                    autoFocus={true}
                    id='currpassword'
                    type={hideCurrPassword ? 'password' : 'text'}
                    placeholder='Current Password'
                    aria-label='curr-password'
                    aria-describedby='addon-curr-password'
                    className={(hideCurrPassword && currPasswordValue !== '') ? 'form-control-middle password-input-ctrl' : 'form-control-middle'}
                    value={currPasswordValue}
                    onChange={currPasswordChangeHandler}
                    onBlur={currPasswordBlurHandler}
                  />
                  <InputGroup.Text className={'form-control-addon form-control-addon-right'}>
                    <span onClick={() => toggleCurrPasswordVisibility()}>{hideCurrPassword ? <ShowSVG /> : <HideSVG />}</span>
                  </InputGroup.Text>
                </InputGroup>
                {(currPasswordHasError) ?
                    <InvalidInputMessage message={'Invalid Current Password'} />
                  :
                    <div className='message'></div>
                }
              </Col>
              :
              <></>
            }
            <Col xs={12}>
              <Form.Label className=' text-dark'>New Password*</Form.Label>
              <InputGroup className={(newPasswordHasError ? 'invalid ' : '')}>
                <InputGroup.Text className='form-control-addon form-control-addon-left'>
                  <PasswordSVG />
                </InputGroup.Text>
                <Form.Control
                  tabIndex={1}
                  autoFocus={!appCtx.authStatus.isValidPassword}
                  id='newpassword'
                  type={hideNewPassword ? 'password' : 'text'}
                  placeholder='New Password'
                  aria-label='new-password'
                  aria-describedby='addon-new-password'
                  className={(hideNewPassword && newPasswordValue !== '') ? 'form-control-middle password-input-ctrl' : 'form-control-middle'}
                  value={newPasswordValue}
                  onChange={newPasswordChangeHandler}
                  onBlur={newPasswordBlurHandler}
                />
                <InputGroup.Text className={'form-control-addon form-control-addon-right'}>
                  <span onClick={() => toggleNewPasswordVisibility()}>{hideNewPassword ? <ShowSVG /> : <HideSVG />}</span>
                </InputGroup.Text>
              </InputGroup>
              {(newPasswordHasError) ?
                  <InvalidInputMessage message={'Invalid New Password'} />
                :
                  <div className='message'></div>
              }
            </Col>
            <Col xs={12}>
              <Form.Label className=' text-dark'>Confirm New Password*</Form.Label>
              <InputGroup className={(confirmNewPasswordHasError ? 'invalid ' : '')}>
                <InputGroup.Text className='form-control-addon form-control-addon-left'>
                  <PasswordSVG />
                </InputGroup.Text>
                <Form.Control
                  tabIndex={2}
                  id='confirmnewpassword'
                  type={hideConfirmNewPassword ? 'password' : 'text'}
                  placeholder='Confirm New Password'
                  aria-label='confirm-new-password'
                  aria-describedby='addon-confirm-new-password'
                  className={(hideConfirmNewPassword && confirmNewPasswordValue !== '') ? 'form-control-middle password-input-ctrl' : 'form-control-middle'}
                  value={confirmNewPasswordValue}
                  onChange={confirmNewPasswordChangeHandler}
                  onBlur={confirmNewPasswordBlurHandler}
                />
                <InputGroup.Text className={'form-control-addon form-control-addon-right'}>
                  <span onClick={() => toggleConfirmNewPasswordVisibility()}>{hideConfirmNewPassword ? <ShowSVG /> : <HideSVG />}</span>
                </InputGroup.Text>
              </InputGroup>
              {(confirmNewPasswordHasError) ?
                  <InvalidInputMessage message={confirmNewPasswordValue !== newPasswordValue ? 'New and Confirm New Password Do Not Match' : 'Invalid Confirm New Password'} />
                :
                  <div className='message'></div>
              }
            </Col>
          </Row>
          <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
        </Modal.Body>
        <Modal.Footer>
          <button tabIndex={3} type='button' className='btn-rounded bg-primary' onClick={resetPasswordHandler} disabled={responseStatus === CallStatus.PENDING}>
            { appCtx.authStatus.isValidPassword ? 'Reset Password' : 'Set Password' }
            {responseStatus === CallStatus.PENDING ? <Spinner className='mt-1 ms-2 text-white-dark' size='sm' /> : <ActionSVG className='ms-3' />}
          </button>
        </Modal.Footer>
      </Modal>
    </form>
  );
}

export default SetPasswordComponent;
