import './FiatSelection.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Dropdown, Col } from 'react-bootstrap';

import { FIAT_CURRENCIES } from '../../../utilities/constants';
import { CurrencySVG } from '../../../svgs/Currency';
import { RootService } from '../../../services/http.service';
import { setConfig, setFiatConfig } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectAppConfig, selectFiatConfig, selectFiatUnit } from '../../../store/rootSelectors';

const FiatSelection = (props) => {
  const dispatch = useDispatch();
  const fiatUnit = useSelector(selectFiatUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  const appConfig = useSelector(selectAppConfig);
  const fiatSymbol = FIAT_CURRENCIES.find((fiat => fiat.currency === fiatUnit))?.symbol;

  const fiatChangeHandler = async (eventKey: any, event: any) => {
    const updatedConfig = { ...appConfig, uiConfig: { ...appConfig.uiConfig, fiatUnit: eventKey } };
    await RootService.updateConfig(updatedConfig);
    const updatedFiatConfig = await RootService.getFiatConfig(eventKey);
    dispatch(setConfig(updatedConfig));
    dispatch(setFiatConfig(updatedFiatConfig));
  };

  return (
    <>
    <Dropdown className={props.className} onSelect={fiatChangeHandler} data-testid='fiat-selection'>
      <Dropdown.Toggle variant='outline border-gray-300 d-flex align-items-center'>
        <Col xs={4}>
          { fiatConfig.symbol || (fiatSymbol?.prefix.startsWith('fa') && fiatSymbol.iconName) ?
            <FontAwesomeIcon className='text-dark fa-md' icon={fiatConfig?.symbol || fiatSymbol} />
            :
            <CurrencySVG className='svg-currency' fiat={fiatUnit || 'USD'}></CurrencySVG>
          }
        </Col>
        <Col xs={6}>
          <span className='dropdown-toggle-text text-dark'>{fiatUnit || 'USD'}</span>
        </Col>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <PerfectScrollbar>
          <div className='fiat-dropdown-scroller fs-7'>
          {FIAT_CURRENCIES.map((fiat, i) => 
            <Dropdown.Item className='d-flex justify-content-between align-items-center' as='div' eventKey={fiat.currency} key={i}>
              <Col xs={4}>
                { fiat.symbol ? 
                  <FontAwesomeIcon className='fa-md' icon={fiat.symbol} />
                  :
                  <CurrencySVG className='svg-currency' fiat={fiat.currency || 'USD'}></CurrencySVG>
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
};

export default FiatSelection;
