import './Settings.scss';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import logger from '../../../services/logger.service';
import useBreakpoint from '../../../hooks/use-breakpoint';
import { CURRENCY_UNITS, Units } from '../../../utilities/constants';
import { SettingsSVG } from '../../../svgs/Settings';
import FiatSelection from '../../shared/FiatSelection/FiatSelection';
import ToggleSwitch from '../../shared/ToggleSwitch/ToggleSwitch';
import { setShowModals } from '../../../store/rootSlice';
import { RootService } from '../../../services/http.service';
import { setConfig } from '../../../store/rootSlice';
import { selectAppConfig } from '../../../store/rootSelectors';
import { selectIsAuthenticated, selectNodeInfo, selectServerConfig, selectShowModals, selectUIConfigUnit, selectWalletConnect } from '../../../store/rootSelectors';
import { ApplicationConfiguration } from '../../../types/root.type';

const Settings = (props) => {
  const dispatch = useDispatch();
  const appConfig = useSelector(selectAppConfig);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const nodeInfo = useSelector(selectNodeInfo);
  const showModals = useSelector(selectShowModals);
  const connectWallet = useSelector(selectWalletConnect);
  const serverConfig = useSelector(selectServerConfig);
  const currentScreenSize = useBreakpoint();
  logger.info('Screen Size Changed: ' + currentScreenSize);

  const changeCurrencyUnitHandler = async(changedIndex: number) => {
    const updatedConfig: ApplicationConfiguration = { 
      ...appConfig, 
      uiConfig: {
        ...appConfig.uiConfig,
        unit: CURRENCY_UNITS[changedIndex]
      }
    };
    await RootService.updateConfig(updatedConfig);
    dispatch(setConfig(updatedConfig));
  };

  return (
    <Dropdown autoClose={'outside'} className={!!(nodeInfo.error || (isAuthenticated && nodeInfo.isLoading)) ? 'settings-menu dropdown-disabled' : 'settings-menu'} data-testid='settings'>
      <Dropdown.Toggle variant={props.compact ? '' : 'primary'} disabled={!!(nodeInfo.error || (isAuthenticated && nodeInfo.isLoading))} className={props.compact ? 'd-flex align-items-center btn-rounded btn-compact btn-settings-menu' : 'd-flex align-items-center btn-rounded btn-settings-menu'}>
        <span className={props.compact ? '' : 'me-3'}>{props.compact ? '' : 'Settings'}</span>
        <SettingsSVG className={((!!nodeInfo.error || (isAuthenticated && nodeInfo.isLoading)) ? 'mt-1 svg-fill-disabled' : 'mt-1')} />
      </Dropdown.Toggle>
      <Dropdown.Menu className='fs-7 inner-box-shadow'>
        <Dropdown.Item>Version: {connectWallet.APP_VERSION}</Dropdown.Item>
        <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => dispatch(setShowModals({...showModals, nodeInfoModal: true}))}>Show node ID</Dropdown.Item>
        <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => dispatch(setShowModals({ ...showModals, connectWalletModal: true }))}>Connect wallet</Dropdown.Item>
        <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => dispatch(setShowModals({ ...showModals, sqlTerminalModal: true }))}>SQL Terminal</Dropdown.Item>
        { serverConfig.singleSignOn === true || serverConfig.singleSignOn === "true" ?
            <></>
          :
            <Dropdown.Item data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => dispatch(setShowModals({ ...showModals, setPasswordModal: true }))}>Reset Password</Dropdown.Item>
        }
        <Dropdown.Divider />
        <Dropdown.Item as='div' className='d-flex align-items-center justify-content-between'>Fiat Currency <FiatSelection className='ms-4 fiat-dropdown' /></Dropdown.Item>
        <Dropdown.Item as='div' className='d-flex align-items-center justify-content-between'>Currency <ToggleSwitch onChange={changeCurrencyUnitHandler} values={CURRENCY_UNITS} selIndex={uiConfigUnit === Units.BTC ? 1 : 0} /></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Settings;
