import './SetPassword.scss';
import { useState } from 'react';
import SHA256 from "crypto-js/sha256";
import { Modal, Row, Col, Spinner, InputGroup, Form } from 'react-bootstrap';
import logger from '../../../services/logger.service';
import useInput from '../../../hooks/use-input';
import { CallStatus } from '../../../utilities/constants';
import { ActionSVG } from '../../../svgs/Action';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { PasswordSVG } from '../../../svgs/Password';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import { ShowSVG } from '../../../svgs/Show';
import { HideSVG } from '../../../svgs/Hide';
import { CloseSVG } from '../../../svgs/Close';
import { RootService } from '../../../services/http.service';
import { setAuthStatus, setShowModals, setShowToast } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsValidPassword, selectShowModals } from '../../../store/rootSelectors';
import { useLocation, useNavigate } from 'react-router-dom';

const SetPasswordComponent = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const showModals = useSelector(selectShowModals);
  const isValidPassword = useSelector(selectIsValidPassword);
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
    (isValidPassword && currPasswordIsValid && newPasswordIsValid && confirmNewPasswordIsValid)
    || (!isValidPassword && newPasswordIsValid && confirmNewPasswordIsValid)
  ) {
    formIsValid = true;
  };
  
  const touchFormControls = () => {
    currPasswordBlurHandler();
    newPasswordBlurHandler();
    confirmNewPasswordBlurHandler();
  };

  const resetFormValues = () => {
    resetCurrPassword();
    resetNewPassword();
    resetConfirmNewPassword();
  };

  const resetPasswordHandler = async () => {
    touchFormControls();
    if (!formIsValid) { return; }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Resetting Password...');
    try {
      const authStatus = await RootService.resetUserPassword(isValidPassword, isValidPassword ? SHA256(currPasswordValue).toString() : '', SHA256(newPasswordValue).toString());
      logger.info(authStatus);
      dispatch(setAuthStatus(authStatus));
      if (authStatus.isAuthenticated) {
        setHideCurrPassword(true);
        setHideNewPassword(true);
        setHideConfirmNewPassword(true);
        setResponseStatus(CallStatus.NONE);
        setResponseMessage('');
        resetFormValues();
        dispatch(setShowToast({ show: true, message: ('Password Reset Successfully!'), bg: 'success' }));
        dispatch(setShowModals({...showModals, setPasswordModal: false}));
        navigate(pathname.includes('/bookkeeper') ? pathname : '/cln', { replace: true });
      }        
    } catch (error: any) {
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(error.response || error.message || 'Unknown Error');
    }
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
    dispatch(setShowModals({...showModals, setPasswordModal: false}));
  }

  return (
    <form className='h-100'>
      <Modal show={showModals.setPasswordModal} onHide={isValidPassword ? closeHandler : ()=>{}} centered className='modal-lg' data-testid='set-password-modal'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0'>
          { isValidPassword
            ? <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
            : <></>
          }
        </Modal.Header>
        <Modal.Body className='py-0'>
          <Row className='d-flex align-items-start justify-content-center'>
            { isValidPassword ?
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
                  autoFocus={!isValidPassword}
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
            { isValidPassword ? 'Reset Password' : 'Set Password' }
            {responseStatus === CallStatus.PENDING ? <Spinner className='mt-1 ms-2 text-white-dark' size='sm' /> : <ActionSVG className='ms-3' />}
          </button>
        </Modal.Footer>
      </Modal>
    </form>
  );
}

export default SetPasswordComponent;
