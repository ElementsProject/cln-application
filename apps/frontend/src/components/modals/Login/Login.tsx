import './Login.scss';
import { useState } from 'react';
import SHA256 from "crypto-js/sha256";
import { Modal, Col, Row, Spinner, InputGroup, Form } from 'react-bootstrap';

import useInput from '../../../hooks/use-input';
import { CallStatus } from '../../../utilities/constants';
import { ActionSVG } from '../../../svgs/Action';
import InvalidInputMessage from '../../shared/InvalidInputMessage/InvalidInputMessage';
import { PasswordSVG } from '../../../svgs/Password';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';
import { ShowSVG } from '../../../svgs/Show';
import { HideSVG } from '../../../svgs/Hide';
import { RootService } from '../../../services/http.service';
import { setAuthStatus, setShowModals } from '../../../store/rootSlice';
import logger from '../../../services/logger.service';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowModals } from '../../../store/rootSelectors';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const showModals = useSelector(selectShowModals);
  const [hidePassword, setHidePassword] = useState(true);
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidPassword = value => value.trim() !== '';

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
  }

  const touchFormControls = () => {
    passwordBlurHandler();
  };

  const resetFormValues = () => {
    resetPassword();
  };

  const loginHandler = async () => {
    touchFormControls();
    if (!formIsValid) {
      return;
    }
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Logging In...');
    try {
      const authStatus = await RootService.userLogin(SHA256(passwordValue).toString());
      dispatch(setAuthStatus(authStatus));
      if (authStatus.isAuthenticated) {
        if (authStatus.isValidPassword) {
          dispatch(setShowModals({ ...showModals, loginModal: false }));
          setHidePassword(true);
          setResponseStatus(CallStatus.NONE);
          setResponseMessage('');
          resetFormValues();
          navigate(pathname.includes('/bookkeeper') ? pathname : '/cln', { replace: true });
        }
      }        
    } catch (err: any) {
      logger.error(err);
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(err);
    }
  }

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <form className='h-100'>
      <Modal show={showModals.loginModal} centered className='modal-lg' data-testid='login-modal'>
        <Modal.Header className='d-flex align-items-start justify-content-start pb-0'></Modal.Header>
        <Modal.Body className='py-0'>
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className=" text-dark">Password*</Form.Label>
              <InputGroup className={passwordHasError ? 'invalid ' : ''}>
                <InputGroup.Text className="form-control-addon form-control-addon-left">
                  <PasswordSVG />
                </InputGroup.Text>
                <Form.Control
                  tabIndex={1}
                  autoFocus={true}
                  id="password"
                  type={hidePassword ? 'password' : 'text'}
                  placeholder="Password"
                  aria-label="password"
                  aria-describedby="addon-password"
                  className={
                    hidePassword && passwordValue !== ''
                      ? 'form-control-middle password-input-ctrl'
                      : 'form-control-middle'
                  }
                  value={passwordValue}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                />
                <InputGroup.Text className={'form-control-addon form-control-addon-right'}>
                  <span onClick={() => togglePasswordVisibility()}>
                    {hidePassword ? <ShowSVG /> : <HideSVG />}
                  </span>
                </InputGroup.Text>
              </InputGroup>
              {passwordHasError ? (
                <InvalidInputMessage message={'Invalid Password'} />
              ) : (
                <div className="message"></div>
              )}
            </Col>
          </Row>
          <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
        </Modal.Body>
        <Modal.Footer>
          <button
            tabIndex={2}
            type="button"
            className="btn-rounded bg-primary"
            onClick={loginHandler}
            disabled={responseStatus === CallStatus.PENDING}
          >
            Login
            {responseStatus === CallStatus.PENDING ? (
              <Spinner className="mt-1 ms-2 text-white-dark" size="sm" />
            ) : (
              <ActionSVG className="ms-3" />
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </form>
  );
};

export default LoginComponent;
