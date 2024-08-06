import React from 'react';

import './App.scss';
import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import useHttp from '../../hooks/use-http';
import useBreakpoint from '../../hooks/use-breakpoint';
import { RootContext } from '../../store/RootContext';
import { CLNContext } from '../../store/CLNContext';
import { ApplicationModes } from '../../utilities/constants';
import ToastMessage from '../shared/ToastMessage/ToastMessage';
import NodeInfo from '../modals/NodeInfo/NodeInfo';
import ConnectWallet from '../modals/ConnectWallet/ConnectWallet';
import LoginComponent from '../modals/Login/Login';
import LogoutComponent from '../modals/Logout/Logout';
import SetPasswordComponent from '../modals/SetPassword/SetPassword';
import logger from '../../services/logger.service';
import { AuthResponse } from '../../types/app-config.type';
import Bookkeeper from '../bookkeeper/BkprRoot/BkprRoot';
import CLNHome from '../cln/CLNHome/CLNHome';
import BalanceSheetRoot from '../bookkeeper/BalanceSheet/BalanceSheetRoot';
import SatsFlowRoot from '../bookkeeper/SatsFlow/SatsFlowRoot';

export const rootRouteConfig = [
  {
    path: "/", Component: Root,
    children: [
      { path: "/", Component: () => <Navigate to="/home" replace /> },
      { path: "home", Component: CLNHome },
      { path: "bookkeeper", Component: Bookkeeper },
      { path: "bookkeeper/balancesheet", Component: BalanceSheetRoot },
      { path: "bookkeeper/satsflow", Component: SatsFlowRoot }
    ]
  },
];

const rootRouter = createBrowserRouter(rootRouteConfig);

function Root() {
  const appCtx = useContext(AppContext);
  const currentScreenSize = useBreakpoint();
  const { setCSRFToken, getAppConfigurations, getAuthStatus, initiateDataLoading } = useHttp();

  const bodyHTML = document.getElementsByTagName('body')[0];
  const htmlAttributes = bodyHTML.attributes;
  const theme = document.createAttribute('data-bs-theme');
  theme.value = rootCtx.appConfig.uiConfig.appMode?.toLowerCase() || 'dark';
  bodyHTML.style.backgroundColor =
    rootCtx.appConfig.uiConfig.appMode === ApplicationModes.LIGHT ? '#EBEFF9' : '#0C0C0F';
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
                rootCtx.setShowModals({ ...rootCtx.showModals, loginModal: true });
              } else {
                rootCtx.setShowModals({ ...rootCtx.showModals, setPasswordModal: true });
              }
            } else {
              if (authStatus.isValidPassword) {
                initiateDataLoading();
              } else {
                logger.error(authStatus);
                clnCtx.setNodeInfo({ isLoading: false, error: JSON.stringify(authStatus) });
              }
            }
          });
        } else {
          logger.error(isCsrfSet);
          clnCtx.setNodeInfo({ isLoading: false, error: typeof isCsrfSet === 'object' ? JSON.stringify(isCsrfSet) : isCsrfSet });
        }
      }).catch(err => {
        logger.error(err);
        if (err.response && err.response.data) {
          clnCtx.setNodeInfo({ isLoading: false, error: err.response.data });
        } else if (!err.response && err.message) {
          clnCtx.setNodeInfo({ isLoading: false, error: err.message })
        } else {
          clnCtx.setNodeInfo({ isLoading: false, error: JSON.stringify(err) });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={rootCtx.authStatus.isAuthenticated ? 'py-4' : 'py-4 blurred-container'} id='root-container' data-testid='container'>
        {rootCtx.authStatus.isAuthenticated ?
          <Outlet />
          :
          <EmptyHome />
        }
      </Container>
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
