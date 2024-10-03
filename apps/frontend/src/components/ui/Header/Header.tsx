import React from 'react';

import './Header.scss';
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

import useHttp from '../../../hooks/use-http';
import useBreakpoint from '../../../hooks/use-breakpoint';
import { CLNContext } from '../../../store/CLNContext';
import { ApplicationModes, Breakpoints } from '../../../utilities/constants';
import { DayModeSVG } from '../../../svgs/DayMode';
import { NightModeSVG } from '../../../svgs/NightMode';
import { LogoutSVG } from '../../../svgs/Logout';
import Settings from '../Settings/Settings';
import { RootContext } from '../../../store/RootContext';

const Header = (props) => {
  const rootCtx = useContext(RootContext);
  const clnCtx = useContext(CLNContext);
  const currentScreenSize = useBreakpoint();
  const { updateConfig } = useHttp();

  const modeChangeHandler = (event: any) => {
    updateConfig({
      ...rootCtx.appConfig,
      uiConfig: {
        ...rootCtx.appConfig.uiConfig,
        appMode: (rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK ? ApplicationModes.LIGHT : ApplicationModes.DARK),
      },
    });
  };

  const logoutHandler = (event: any) => {
    rootCtx.setShowModals({ ...rootCtx.showModals, logoutModal: true });
  }

  if (currentScreenSize === Breakpoints.XS || currentScreenSize === Breakpoints.SM) {
    return (
      <Row className='header mb-5 mx-1' data-testid='header'>
        <Col xs={12} data-testid='header-info'>
          <AnimatePresence>
            <motion.img
              key='cln-logo'
              alt='Core Lightning Logo'
              src={appCtx.appConfig.appMode === ApplicationModes.DARK ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'}
              className='header-info-logo me-3 rounded float-start'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.01 }}
          />
          </AnimatePresence>
          <Col className='h-100 d-flex align-items-center justify-content-between'>
            <h4 className='m-0 text-dark'><strong>CLN</strong></h4>
            <div className='d-flex align-items-center'>
              <Settings compact={true} onShowConnectWallet={props.onShowConnectWallet} />
              { rootCtx.appConfig.serverConfig.singleSignOn === true ?
                <span className='mx-2'></span>
                :
                <div onClick={logoutHandler}>
                  <LogoutSVG className='svg-logout mx-2 cursor-pointer' />
                </div>
              }
              <div onClick={modeChangeHandler}>
                {(rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK) ? <NightModeSVG className='svg-night me-2' /> : <DayModeSVG className='svg-day me-2' />}
              </div>
            </div>
          </Col>
          <Row className='header-info-text my-2'>
            <Col xs={12} className='d-flex align-items-center text-light'>
            { rootCtx.authStatus.isAuthenticated && clnCtx.nodeInfo.isLoading ? 
                <>
                  <OverlayTrigger
                    placement='auto'
                    delay={{ show: 250, hide: 250 }}
                    overlay={<Tooltip>Loading</Tooltip>}
                    >
                    <span className='d-inline-block mx-2 dot bg-warning'></span>
                  </OverlayTrigger>
                  <span className='fs-7'>Loading...</span>
                </>
              : 
                clnCtx.nodeInfo.error ? 
                  <>
                    <OverlayTrigger
                      placement='auto'
                      delay={{ show: 250, hide: 250 }}
                      overlay={<Tooltip>Error</Tooltip>}
                      >
                      <span className='d-inline-block mx-2 dot bg-danger'></span>
                    </OverlayTrigger>
                    <span className='fs-7'>{('Error: ' + clnCtx.nodeInfo.error)}</span>
                  </>
                : 
                  <>
                    <OverlayTrigger
                      placement='auto'
                      delay={{ show: 250, hide: 250 }}
                      overlay={<Tooltip>Connected</Tooltip>}
                      >
                      <span className='d-inline-block mx-2 dot bg-success'></span>
                    </OverlayTrigger>
                    <span className='fs-7'>{clnCtx.nodeInfo.alias + ' (' + clnCtx.nodeInfo.version + ')'}</span>
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
        <Image src={appCtx.appConfig.appMode === ApplicationModes.DARK ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'} className='header-info-logo me-3 rounded float-start' alt='Core Lightning Logo' />
        <Row className='header-info-text mt-3'>
          {(currentScreenSize !== Breakpoints.MD) ?
            <h4 className='m-0 text-dark'><strong>Core Lightning Node</strong></h4>
          : 
            <Col xs={12} lg={4} className='d-flex align-items-center justify-content-between' data-testid='header-context'>
              <h4 className='m-0 text-dark'><strong>Core Lightning Node</strong></h4>
              <div className='d-flex align-items-center'>
                <Settings onShowConnectWallet={props.onShowConnectWallet} />
                { rootCtx.appConfig.serverConfig.singleSignOn === true ?
                  <span className='mx-2'></span>
                  :
                  <div onClick={logoutHandler}>
                    <LogoutSVG className='svg-logout mx-3 cursor-pointer' />
                  </div>
                }
                <div onClick={modeChangeHandler}>
                  {(rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK) ? <NightModeSVG className='svg-night me-2' /> : <DayModeSVG className='svg-day me-2' />}
                </div>
              </div>
            </Col>
          }
          <Col xs={12} className='d-flex align-items-center text-light'>
            { rootCtx.authStatus.isAuthenticated && clnCtx.nodeInfo.isLoading ? 
                <>
                  <OverlayTrigger
                    placement='auto'
                    delay={{ show: 250, hide: 250 }}
                    overlay={<Tooltip>Loading</Tooltip>}
                    >
                    <span className='d-inline-block me-2 dot bg-warning'></span>
                  </OverlayTrigger>
                  <span className='fs-7'>Loading...</span>
                </>
              : 
              clnCtx.nodeInfo.error ? 
                <>
                  <OverlayTrigger
                    placement='auto'
                    delay={{ show: 250, hide: 250 }}
                    overlay={<Tooltip>Error</Tooltip>}
                    >
                    <span className='d-inline-block me-2 dot bg-danger'></span>
                  </OverlayTrigger>
                  <span className='fs-7'>{('Error: ' + clnCtx.nodeInfo.error)}</span>
                </>
              : 
                <>
                  <OverlayTrigger
                    placement='auto'
                    delay={{ show: 250, hide: 250 }}
                    overlay={<Tooltip>Connected</Tooltip>}
                    >
                    <span className='d-inline-block me-2 dot bg-success'></span>
                  </OverlayTrigger>
                  <span className='fs-7'>{clnCtx.nodeInfo.alias + ' (' + clnCtx.nodeInfo.version + ')'}</span> 
                </>
            }
          </Col>
        </Row>
      </Col>
      {(currentScreenSize !== Breakpoints.MD) ?
        <Col xs={12} lg={4} className='d-flex align-items-center justify-content-end' data-testid='header-context'>
          <div className='d-flex align-items-center'>
            <Settings onShowConnectWallet={props.onShowConnectWallet} />
            { rootCtx.appConfig.serverConfig.singleSignOn === true ?
              <span className='mx-2'></span>
              :
              <div onClick={logoutHandler}>
                <LogoutSVG className='svg-logout mx-3 cursor-pointer' />
              </div>
            }
            <div onClick={modeChangeHandler}>
              {(rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK) ? <NightModeSVG className='svg-night me-2' /> : <DayModeSVG className='svg-day me-2'/>}
            </div>
          </div>
        </Col>
      :
        <></>
      }
    </Row>
  );
}

export default Header;
