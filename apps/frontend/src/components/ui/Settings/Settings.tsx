import React from 'react';

import './Settings.scss';
import { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';

import logger from '../../../services/logger.service';
import useBreakpoint from '../../../hooks/use-breakpoint';
import { RootContext } from '../../../store/RootContext';
import { CURRENCY_UNITS } from '../../../utilities/constants';
import { SettingsSVG } from '../../../svgs/Settings';
import FiatSelection from '../../shared/FiatSelection/FiatSelection';
import ToggleSwitch from '../../shared/ToggleSwitch/ToggleSwitch';
import { CLNContext } from '../../../store/CLNContext';

const Settings = (props) => {
  const rootCtx = useContext(RootContext);
  const clnCtx = useContext(CLNContext);
  const currentScreenSize = useBreakpoint();
  logger.info('Screen Size Changed: ' + currentScreenSize);

  return (
    <Dropdown autoClose={'outside'} className={!!(clnCtx.nodeInfo.error || (rootCtx.authStatus.isAuthenticated && clnCtx.nodeInfo.isLoading)) ? 'settings-menu dropdown-disabled' : 'settings-menu'} data-testid='settings'>
      <Dropdown.Toggle variant={props.compact ? '' : 'primary'} disabled={!!(clnCtx.nodeInfo.error || (rootCtx.authStatus.isAuthenticated && clnCtx.nodeInfo.isLoading))} className={props.compact ? 'd-flex align-items-center btn-rounded btn-compact btn-settings-menu' : 'd-flex align-items-center btn-rounded btn-settings-menu'}>
        <span className={props.compact ? '' : 'me-3'}>{props.compact ? '' : 'Settings'}</span>
        <SettingsSVG className={((!!clnCtx.nodeInfo.error || (rootCtx.authStatus.isAuthenticated && clnCtx.nodeInfo.isLoading)) ? 'mt-1 svg-fill-disabled' : 'mt-1')} />
      </Dropdown.Toggle>
      <Dropdown.Menu className='fs-7 inner-box-shadow'>
        <Dropdown.Item>Version: {rootCtx.walletConnect.APP_VERSION}</Dropdown.Item>
        <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => rootCtx.setShowModals({...rootCtx.showModals, nodeInfoModal: true})}>Show node ID</Dropdown.Item>
        <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => rootCtx.setShowModals({...rootCtx.showModals, connectWalletModal: true})}>Connect wallet</Dropdown.Item>
        { rootCtx.appConfig.serverConfig.singleSignOn === true ?
            <></>
          :
            <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => rootCtx.setShowModals({ ...rootCtx.showModals, setPasswordModal: true })}>Reset Password</Dropdown.Item>
        }
        <Dropdown.Divider />
        <Dropdown.Item as='div' className='d-flex align-items-center justify-content-between'>Fiat Currency <FiatSelection className='ms-4 fiat-dropdown' /></Dropdown.Item>
        <Dropdown.Item as='div' className='d-flex align-items-center justify-content-between'>Currency <ToggleSwitch values={CURRENCY_UNITS} selValue={rootCtx.appConfig.uiConfig.unit} storeSelector='appConfig' storeKey='unit' /></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Settings;
