import './App.scss';
import { Container } from 'react-bootstrap';

import useBreakpoint from '../../hooks/use-breakpoint';
import ToastMessage from '../shared/ToastMessage/ToastMessage';
import NodeInfo from '../modals/NodeInfo/NodeInfo';
import ConnectWallet from '../modals/ConnectWallet/ConnectWallet';
import LoginComponent from '../modals/Login/Login';
import LogoutComponent from '../modals/Logout/Logout';
import SetPasswordComponent from '../modals/SetPassword/SetPassword';
import RouteTransition from '../ui/RouteTransition/RouteTransition';
import { useSelector } from 'react-redux';
import { selectAppMode, selectIsAuthenticated, selectIsDarkMode } from '../../store/rootSelectors';
import SQLTerminal from '../modals/SQLTerminal/SQLTerminal';
import QRCodeLarge from '../modals/QRCodeLarge/QRCodeLarge';

export const App = () => {
  const currentScreenSize = useBreakpoint();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const appMode = useSelector(selectAppMode);
  const isDarkMode = useSelector(selectIsDarkMode);
  const containerClassName = isAuthenticated ? 'py-4' : 'py-4 blurred-container';
  const bodyHTML = document.getElementsByTagName('body')[0];
  const htmlAttributes = bodyHTML.attributes;
  const theme = document.createAttribute('data-bs-theme');
  theme.value = appMode.toLowerCase() || 'dark';
  bodyHTML.style.backgroundColor = isDarkMode ? '#0C0C0F' : '#EBEFF9';
  const screensize = document.createAttribute('data-screensize');
  screensize.value = currentScreenSize;
  htmlAttributes.setNamedItem(theme);
  htmlAttributes.setNamedItem(screensize);
  
  return (
    <>
      <Container className={containerClassName} id='root-container' data-testid='container'>
        <RouteTransition />
      </Container>
      <ToastMessage />
      <NodeInfo />
      <ConnectWallet />
      <QRCodeLarge />
      <LoginComponent />
      <LogoutComponent />
      <SetPasswordComponent />
      <SQLTerminal />
    </>
  );
};

export default App;
