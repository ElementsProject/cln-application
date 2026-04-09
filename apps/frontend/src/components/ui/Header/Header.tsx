import './Header.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

import useBreakpoint from '../../../hooks/use-breakpoint';
import { ApplicationModes, Breakpoints } from '../../../utilities/constants';
import { DayModeSVG } from '../../../svgs/DayMode';
import { NightModeSVG } from '../../../svgs/NightMode';
import { LogoutSVG } from '../../../svgs/Logout';
import Menu from '../Menu/Menu';
import Settings from '../Settings/Settings';
import { RootService } from '../../../services/http.service';
import { setShowModals, setConfig } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectAppConfig, selectIsAuthenticated, selectIsDarkMode, selectNodeInfo, selectServerConfig, selectShowModals } from '../../../store/rootSelectors';

const NetworkBanner = ({ network }: { network?: string }) => {
  if (!network || network === 'bitcoin') return null;
  const label = network.charAt(0).toUpperCase() + network.slice(1);
  const variant = network === 'regtest' ? 'danger' : 'warning';
  return (
    <div className={`network-banner bg-${variant} text-center py-2 px-3 mb-2 mx-1 rounded`}>
      <span className='fw-bold fs-6 text-dark'>{label} Network</span>
      <span className='fs-6 ms-2 text-dark'>&mdash; Not real bitcoin</span>
    </div>
  );
};

const Header = (props) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const showModals = useSelector(selectShowModals);
  const isDarkMode = useSelector(selectIsDarkMode);
  const serverConfig = useSelector(selectServerConfig);
  const nodeInfo = useSelector(selectNodeInfo);
  const appConfig = useSelector(selectAppConfig);
  const currentScreenSize = useBreakpoint();

  const modeChangeHandler = async () => {
    const updatedConfig = {
      ...appConfig,
      uiConfig: {
        ...appConfig.uiConfig,
        appMode: (isDarkMode ? ApplicationModes.LIGHT : ApplicationModes.DARK),
      },
    };
    await RootService.updateConfig(updatedConfig);
    dispatch(setConfig(updatedConfig));
  };

  const logoutHandler = () => {
    dispatch(setShowModals({ ...showModals, logoutModal: true }));
  }

  if (currentScreenSize === Breakpoints.XS || currentScreenSize === Breakpoints.SM) {
    return (
      <>
      <NetworkBanner network={nodeInfo.network} />
      <Row className="header mb-2 mx-1" data-testid="header">
        <Col xs={12} data-testid="header-info">
          <Row>
            <Col xs={3} className='mb-3'>
              <AnimatePresence>
                <motion.img
                  key='cln-logo'
                  alt='SuperScalar Wallet'
                  src={isDarkMode ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'}
                  className='header-info-logo me-3 rounded float-start'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05, duration: 0.01 }}
                />
              </AnimatePresence>
            </Col>
            <Col xs={9}>
              <h4 className="ms-3 m-0 text-dark">
                <strong>SuperScalar Wallet</strong>
              </h4>
              <Row className='header-info-text my-1'>
                <Col xs={12} className='d-flex align-items-center text-light'>
                  {isAuthenticated && nodeInfo.isLoading ?
                    <>
                      <OverlayTrigger
                        placement="auto"
                        delay={{ show: 250, hide: 250 }}
                        overlay={<Tooltip>Loading</Tooltip>}
                      >
                        <span className="d-inline-block mx-3 dot bg-warning"></span>
                      </OverlayTrigger>
                      <span className="fs-7">Loading...</span>
                    </>
                    :
                    nodeInfo.error ?
                      <>
                        <OverlayTrigger
                          placement='auto'
                          delay={{ show: 250, hide: 250 }}
                          overlay={<Tooltip>Error</Tooltip>}
                        >
                          <span className='d-inline-block mx-3 dot bg-danger'></span>
                        </OverlayTrigger>
                        <span className='fs-7'>{('Error: ' + nodeInfo.error)}</span>
                      </>
                      :
                      <>
                        <OverlayTrigger
                          placement='auto'
                          delay={{ show: 250, hide: 250 }}
                          overlay={<Tooltip>Connected</Tooltip>}
                        >
                          <span className='d-inline-block mx-3 dot bg-success'></span>
                        </OverlayTrigger>
                        <span className='fs-7'>{nodeInfo.alias?.replace('--', '-').replace(/-\d+-.*$/, '')}</span>
                      </>
                  }
                </Col>
              </Row>
              <Row className='ms-1'>
                <Col className="h-100 d-flex align-items-end justify-content-between">
                  <div className="d-flex align-items-center">
                    <Menu compact={true} />
                    <Settings compact={true} onShowConnectWallet={props.onShowConnectWallet} />
                    {serverConfig.singleSignOn === true || serverConfig.singleSignOn === "true" ?
                      <span className='mx-2'></span>
                      :
                      <div onClick={logoutHandler}>
                        <LogoutSVG className="svg-logout ms-2 cursor-pointer" />
                      </div>
                    }
                    <div onClick={modeChangeHandler}>
                      {(isDarkMode) ? <NightModeSVG className='svg-night mx-2' /> : <DayModeSVG className='svg-day mx-2' />}
                    </div>
                  </div>
                </Col>
              </Row>

            </Col>
          </Row>
        </Col>
      </Row>
      </>
    );
  }

  return (
    <>
    <NetworkBanner network={nodeInfo.network} />
    <Row className='header mb-4 mx-1' data-testid='header'>
      <Col xs={12} lg={8} data-testid='header-info'>
        <Image src={isDarkMode ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'} className='header-info-logo me-3 rounded float-start' alt='SuperScalar Wallet' />
        <Row className='header-info-text mt-3'>
          {(currentScreenSize !== Breakpoints.MD) ?
            <h4 className='m-0 text-dark'><strong>SuperScalar Wallet</strong></h4>
            :
            <Col xs={12} lg={4} className='d-flex align-items-center justify-content-between' data-testid='header-context'>
              <h4 className='m-0 text-dark'><strong>SuperScalar Wallet</strong></h4>
              <div className='d-flex align-items-center'>
                <Menu />
                <Settings onShowConnectWallet={props.onShowConnectWallet} />
                {serverConfig.singleSignOn === true || serverConfig.singleSignOn === "true" ?
                  <span className='mx-3'></span>
                  :
                  <div onClick={logoutHandler}>
                    <LogoutSVG className="svg-logout ms-3 cursor-pointer" />
                  </div>
                }
                <div onClick={modeChangeHandler}>
                  {(isDarkMode) ? <NightModeSVG className='svg-night me-3' /> : <DayModeSVG className='svg-day me-3' />}
                </div>
              </div>
            </Col>
          }
          <Col xs={12} className='d-flex align-items-center text-light'>
            {isAuthenticated && nodeInfo.isLoading ?
              <>
                <OverlayTrigger
                  placement='auto'
                  delay={{ show: 250, hide: 250 }}
                  overlay={<Tooltip>Loading</Tooltip>}
                >
                  <span className='d-inline-block me-3 dot bg-warning'></span>
                </OverlayTrigger>
                <span className='fs-7'>Loading...</span>
              </>
              :
              nodeInfo.error ?
                <>
                  <OverlayTrigger
                    placement='auto'
                    delay={{ show: 250, hide: 250 }}
                    overlay={<Tooltip>Error</Tooltip>}
                  >
                    <span className='d-inline-block me-3 dot bg-danger'></span>
                  </OverlayTrigger>
                  <span className='fs-7'>{('Error: ' + nodeInfo.error)}</span>
                </>
                :
                <>
                  <OverlayTrigger
                    placement='auto'
                    delay={{ show: 250, hide: 250 }}
                    overlay={<Tooltip>Connected</Tooltip>}
                  >
                    <span className='d-inline-block me-3 dot bg-success'></span>
                  </OverlayTrigger>
                  <span className='fs-7'>{nodeInfo.alias?.replace('--', '-').replace(/-\d+-.*$/, '') + ' (' + nodeInfo.version + ')'}</span>
                </>
            }
          </Col>
        </Row>
      </Col>
      {currentScreenSize !== Breakpoints.MD ? (
        <Col
          xs={12}
          lg={4}
          className="d-flex align-items-center justify-content-end"
          data-testid="header-context"
        >
          <div className="d-flex align-items-center">
            <Menu />
            <Settings onShowConnectWallet={props.onShowConnectWallet} />
            {serverConfig.singleSignOn === true || serverConfig.singleSignOn === "true" ?
              <span className='mx-3'></span>
              :
              <div onClick={logoutHandler}>
                <LogoutSVG className="svg-logout mx-3 cursor-pointer" />
              </div>
            }
            <div onClick={modeChangeHandler}>
              {(isDarkMode) ? <NightModeSVG className='svg-night me-3' /> : <DayModeSVG className='svg-day me-3' />}
            </div>
          </div>
        </Col>
      ) : (
        <></>
      )}
    </Row>
    </>
  );
};

export default Header;
