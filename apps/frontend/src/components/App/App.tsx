import React from 'react';

import './App.scss';
import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import useHttp from '../../hooks/use-http';
import useBreakpoint from '../../hooks/use-breakpoint';
import { AppContext } from '../../store/AppContext';
import { ApplicationModes } from '../../utilities/constants';
import ToastMessage from '../shared/ToastMessage/ToastMessage';
import NodeInfo from '../modals/NodeInfo/NodeInfo';
import ConnectWallet from '../modals/ConnectWallet/ConnectWallet';
import LoginComponent from '../modals/Login/Login';
import LogoutComponent from '../modals/Logout/Logout';
import SetPasswordComponent from '../modals/SetPassword/SetPassword';
import logger from '../../services/logger.service';
import { AuthResponse } from '../../types/app-config.type';
import { EmptyCard } from '../ui/Loading/Loading';

function App() {
  const navigate = useNavigate();
  const appCtx = useContext(AppContext);
  const currentScreenSize = useBreakpoint();
  const { setCSRFToken, getAppConfigurations, getAuthStatus, initiateDataLoading } = useHttp();

  const bodyHTML = document.getElementsByTagName('body')[0];
  const htmlAttributes = bodyHTML.attributes;
  const theme = document.createAttribute('data-bs-theme');
  console.warn(appCtx.appConfig);
  theme.value = appCtx.appConfig.uiConfig.appMode?.toLowerCase() || 'dark';
  bodyHTML.style.backgroundColor =
    appCtx.appConfig.uiConfig.appMode === ApplicationModes.LIGHT ? '#EBEFF9' : '#0C0C0F';
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
              if (config[0]?.serverConfig?.lightningNodeType === "GREENLIGHT") {
                // LOAD GREENLIGHT DATA
                navigate('/gl', { replace: true });
              } else {
                initiateDataLoading();
                navigate('/cln', { replace: true });
              }
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

  return (
    <>
    { appCtx.authStatus.isAuthenticated ? (
      <Container className={appCtx.authStatus.isAuthenticated ? 'py-4' : 'py-4 blurred-container'} id='root-container' data-testid='container'>
        <Outlet />
      </Container>
    ) : <EmptyCard className='mt-4 py-4 blurred-container' />}
    <ToastMessage />
    <NodeInfo />
    <ConnectWallet />
    <LoginComponent />
    <LogoutComponent />
    <SetPasswordComponent />
    </>
  );
}

export default App;
