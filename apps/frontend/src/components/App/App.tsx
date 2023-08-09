import React from 'react';

import './App.scss';
import { useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import useHttp from '../../hooks/use-http';
import useBreakpoint from '../../hooks/use-breakpoint';
import { AppContext } from '../../store/AppContext';
import { ApplicationModes } from '../../utilities/constants';
import ToastMessage from '../shared/ToastMessage/ToastMessage';
import Header from '../ui/Header/Header';
import Overview from '../cln/Overview/Overview';
import NodeInfo from '../modals/NodeInfo/NodeInfo';
import ConnectWallet from '../modals/ConnectWallet/ConnectWallet';
import LoginComponent from '../modals/Login/Login';
import LogoutComponent from '../modals/Logout/Logout';
import SetPasswordComponent from '../modals/SetPassword/SetPassword';
import BTCCard from '../cln/BTCCard/BTCCard';
import CLNCard from '../cln/CLNCard/CLNCard';
import ChannelsCard from '../cln/ChannelsCard/ChannelsCard';
import logger from '../../services/logger.service';
import { AuthResponse } from '../../types/app-config.type';

const App = () => {
  const appCtx = useContext(AppContext);
  const currentScreenSize = useBreakpoint();
  const { setCSRFToken, getAppConfigurations, getAuthStatus, initiateDataLoading } = useHttp();

  const bodyHTML = document.getElementsByTagName('body')[0];
  const htmlAttributes = bodyHTML.attributes;
  const theme = document.createAttribute('data-bs-theme');
  theme.value = appCtx.appConfig.appMode?.toLowerCase() || 'dark';
  bodyHTML.style.backgroundColor =
    appCtx.appConfig.appMode === ApplicationModes.LIGHT ? '#EBEFF9' : '#0C0C0F';
  const screensize = document.createAttribute('data-screensize');
  screensize.value = currentScreenSize;
  htmlAttributes.setNamedItem(theme);
  htmlAttributes.setNamedItem(screensize);

  useEffect(() => {
    Promise.all([
      setCSRFToken(),
      getAppConfigurations()
    ])
    .then(([isCsrfSet, config]: [any, any]) => {
      if (isCsrfSet) {
        getAuthStatus().then((authStatus: AuthResponse) => {
          if (!authStatus.isAuthenticated) {
            if (authStatus.isValidPassword) {
              appCtx.setShowModals({ ...appCtx.showModals, loginModal: true });
            } else {
              appCtx.setShowModals({ ...appCtx.showModals, setPasswordModal: true });
            }
          } else {
            if (authStatus.isValidPassword) {
              initiateDataLoading();
            } else {
              logger.error(authStatus);
              appCtx.setNodeInfo({ isLoading: false, error: JSON.stringify(authStatus) });
            }
          }
        });
      } else {
        logger.error(isCsrfSet);
        appCtx.setNodeInfo({ isLoading: false, error: typeof isCsrfSet === 'object' ? JSON.stringify(isCsrfSet) : isCsrfSet });
      }
    }).catch(err => {
      logger.error(err);
      if (err.response && err.response.data) {
        appCtx.setNodeInfo({ isLoading: false, error: err.response.data });
      } else if (!err.response && err.message) {
        appCtx.setNodeInfo({ isLoading: false, error: err.message })
      } else {
        appCtx.setNodeInfo({ isLoading: false, error: JSON.stringify(err)});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (appCtx.authStatus.isAuthenticated && appCtx.nodeInfo.isLoading) {
    return (
      <Container className='py-4' id='root-container' data-testid='container'>
        <Header />
        <Row className='mt-10'>
          <Col xs={12} className='d-flex align-items-center justify-content-center'>
            <Spinner animation='grow' variant='primary' />
          </Col>
          <Col xs={12} className='d-flex align-items-center justify-content-center'>
            <div>Loading...</div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (appCtx.nodeInfo.error) {
    return (
      <Container className='py-4' id='root-container' data-testid='container'>
        <Header />
        <Row className='message invalid mt-10'>
          <Col xs={12} className='d-flex align-items-center justify-content-center'>
            {appCtx.nodeInfo.error}
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <Container className={appCtx.authStatus.isAuthenticated ? 'py-4' : 'py-4 blurred-container'} id='root-container' data-testid='container'>
        <Header />
        <Row>
          <Col className='mx-1'>
            <Overview />
          </Col>
        </Row>
        <Row className='px-3'>
          <Col xs={12} lg={4} className='cards-container'>
            <BTCCard />
          </Col>
          <Col xs={12} lg={4} className='cards-container'>
            <CLNCard />
          </Col>
          <Col xs={12} lg={4} className='cards-container'>
            <ChannelsCard />
          </Col>
        </Row>
      </Container>
      <ToastMessage />
      <NodeInfo />
      <ConnectWallet />
      <LoginComponent />
      <LogoutComponent />
      <SetPasswordComponent />
    </>
  );
};

export default App;
