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

const Header = (props) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const showModals = useSelector(selectShowModals);
  const isDarkMode = useSelector(selectIsDarkMode);
  const serverConfig = useSelector(selectServerConfig);
  const nodeInfo = useSelector(selectNodeInfo);
  const appConfig = useSelector(selectAppConfig);
  const currentScreenSize = useBreakpoint();

  const modeChangeHandler = async (event: any) => {
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

  const logoutHandler = (event: any) => {
    dispatch(setShowModals({ ...showModals, logoutModal: true }));
  }

  if (currentScreenSize === Breakpoints.XS || currentScreenSize === Breakpoints.SM) {
    return (
      <Row className="header mb-5 mx-1" data-testid="header">
        <Col xs={12} data-testid="header-info">
          <AnimatePresence>
            <motion.img
              key='cln-logo'
              alt='Core Lightning Logo'
              src={isDarkMode ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'}
              className='header-info-logo me-3 rounded float-start'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.01 }}
            />
          </AnimatePresence>
          <Col className="h-100 d-flex align-items-center justify-content-between">
            <h4 className="m-0 text-dark">
              <strong>CLN</strong>
            </h4>
            <div className="d-flex align-items-center">
              <Menu compact={true} />
              <Settings compact={true} onShowConnectWallet={props.onShowConnectWallet} />
              {serverConfig.singleSignOn === true ?
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
          <Row className='header-info-text my-2'>
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
                    <span className='fs-7'>{nodeInfo.alias?.replace(/--\d+-.*$/, '') + ' (' + nodeInfo.version + ')'}</span>
                  </>
              }
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  return (
    <Row className='header mb-4 mx-1' data-testid='header'>
      <Col xs={12} lg={8} data-testid='header-info'>
        <Image src={isDarkMode ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'} className='header-info-logo me-3 rounded float-start' alt='Core Lightning Logo' />
        <Row className='header-info-text mt-3'>
          {(currentScreenSize !== Breakpoints.MD) ?
            <h4 className='m-0 text-dark'><strong>Core Lightning Node</strong></h4>
            :
            <Col xs={12} lg={4} className='d-flex align-items-center justify-content-between' data-testid='header-context'>
              <h4 className='m-0 text-dark'><strong>Core Lightning Node</strong></h4>
              <div className='d-flex align-items-center'>
                <Menu />
                <Settings onShowConnectWallet={props.onShowConnectWallet} />
                {serverConfig.singleSignOn === true ?
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
                  <span className='fs-7'>{nodeInfo.alias?.replace(/--\d+-.*$/, '') + ' (' + nodeInfo.version + ')'}</span>
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
            {serverConfig.singleSignOn === true ?
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
  );
};

export default Header;

