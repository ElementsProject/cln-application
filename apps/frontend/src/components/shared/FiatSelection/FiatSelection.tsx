import './FiatSelection.scss';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Col from 'react-bootstrap/Col';

import useHttp from '../../../hooks/use-http';
import { AppContext } from '../../../store/AppContext';
import { FIAT_CURRENCIES } from '../../../utilities/constants';
import { CurrencySVG } from '../../../svgs/Currency';

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
        <Col xs={4}>
          { appCtx.fiatConfig.symbol ? 
            <FontAwesomeIcon className='text-dark fa-md' icon={appCtx.fiatConfig.symbol} />
            :
            <CurrencySVG className='svg-currency' fiat={appCtx.appConfig.fiatUnit}></CurrencySVG>
          }
        </Col>
        <Col xs={6}>
          <span className='dropdown-toggle-text text-dark'>{appCtx.appConfig.fiatUnit || 'USD'}</span>
        </Col>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <PerfectScrollbar className='ps-show-always'>
          <div className='fiat-dropdown-scroller fs-7'>
          {FIAT_CURRENCIES.map((fiat, i) => 
            <Dropdown.Item className='d-flex justify-content-between align-items-center' as='div' eventKey={fiat.currency} key={i}>
              <Col xs={4}>
                { fiat.symbol ? 
                  <FontAwesomeIcon className='fa-md' icon={fiat.symbol} />
                  :
                  <CurrencySVG className='svg-currency' fiat={fiat.currency}></CurrencySVG>
                }
              </Col>
              <Col xs={6}>
                <span>{fiat.currency}</span>
              </Col>
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
