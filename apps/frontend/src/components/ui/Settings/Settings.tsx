import React from 'react';

import './Settings.scss';
import { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';

import logger from '../../../services/logger.service';
import useBreakpoint from '../../../hooks/use-breakpoint';
import { AppContext } from '../../../store/AppContext';
import { CURRENCY_UNITS } from '../../../utilities/constants';
import { SettingsSVG } from '../../../svgs/Settings';
import FiatSelection from '../../shared/FiatSelection/FiatSelection';
import ToggleSwitch from '../../shared/ToggleSwitch/ToggleSwitch';

const Settings = (props) => {
  const appCtx = useContext(AppContext);
  const currentScreenSize = useBreakpoint();
  logger.info('Screen Size Changed: ' + currentScreenSize);

  return (
    <Dropdown autoClose={'outside'} className={!!(appCtx.nodeInfo.error || (appCtx.authStatus.isAuthenticated && appCtx.nodeInfo.isLoading)) ? 'settings-menu dropdown-disabled' : 'settings-menu'} data-testid='settings'>
      <Dropdown.Toggle variant={props.compact ? '' : 'primary'} disabled={!!(appCtx.nodeInfo.error || (appCtx.authStatus.isAuthenticated && appCtx.nodeInfo.isLoading))} className={props.compact ? 'd-flex align-items-center btn-rounded btn-compact btn-settings-menu' : 'd-flex align-items-center btn-rounded btn-settings-menu'}>
        <span className={props.compact ? '' : 'me-3'}>{props.compact ? '' : 'Settings'}</span>
        <SettingsSVG className={((!!appCtx.nodeInfo.error || (appCtx.authStatus.isAuthenticated && appCtx.nodeInfo.isLoading)) ? 'mt-1 svg-fill-disabled' : 'mt-1')} />
      </Dropdown.Toggle>
      <Dropdown.Menu className='fs-7 inner-box-shadow'>
        <Dropdown.Item>Version: {appCtx.walletConnect.APP_VERSION}</Dropdown.Item>
        <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => appCtx.setShowModals({...appCtx.showModals, nodeInfoModal: true})}>Show node ID</Dropdown.Item>
        <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => appCtx.setShowModals({...appCtx.showModals, connectWalletModal: true})}>Connect wallet</Dropdown.Item>
        { appCtx.appConfig.serverConfig.singleSignOn === true ?
            <></>
          :
            <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => appCtx.setShowModals({ ...appCtx.showModals, setPasswordModal: true })}>Reset Password</Dropdown.Item>
        }
        <Dropdown.Divider />
        <Dropdown.Item as='div' className='d-flex align-items-center justify-content-between'>Fiat Currency <FiatSelection className='ms-4 fiat-dropdown' /></Dropdown.Item>
        <Dropdown.Item as='div' className='d-flex align-items-center justify-content-between'>Currency <ToggleSwitch values={CURRENCY_UNITS} selValue={appCtx.appConfig.uiConfig.unit} storeSelector='appConfig' storeKey='unit' /></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Settings;
