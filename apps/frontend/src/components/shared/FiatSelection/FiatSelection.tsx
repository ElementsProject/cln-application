import './FiatSelection.scss';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from 'react-bootstrap/Dropdown';

import useHttp from '../../../hooks/use-http';
import { AppContext } from '../../../store/AppContext';
import { FIAT_CURRENCIES } from '../../../utilities/constants';

const FiatSelection = (props) => {
  const appCtx = useContext(AppContext);
  const { updateConfig } = useHttp();

  const fiatChangeHandler = (eventKey: any, event: any) => {
    updateConfig({...appCtx.appConfig, fiatUnit: eventKey});
  };

  return (
    <>
    <Dropdown className={props.className} onSelect={fiatChangeHandler}>
      <Dropdown.Toggle variant='outline border-gray-300 d-flex align-items-center'>
        <FontAwesomeIcon className='text-dark fa-md' icon={appCtx.fiatConfig.symbol} />
        <span className='dropdown-toggle-text text-dark ms-2px'>{appCtx.appConfig.fiatUnit || 'USD'}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <PerfectScrollbar className='ps-show-always'>
          <div className='fiat-dropdown-scroller fs-7'>
          {FIAT_CURRENCIES.map((fiat, i) => 
            <Dropdown.Item as='div' eventKey={fiat.currency} key={i}>
              <FontAwesomeIcon className='fa-md' icon={fiat.symbol} />
              <span className='ms-2px'>{fiat.currency}</span>
            </Dropdown.Item>
          )}
          </div>
        </PerfectScrollbar>
      </Dropdown.Menu>
    </Dropdown>
  </>
  );
}

export default FiatSelection;
