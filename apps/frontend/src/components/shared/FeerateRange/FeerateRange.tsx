import React from 'react';

import './FeerateRange.scss';
import { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';

import { FeeRate, FEE_RATES, Units } from '../../../utilities/constants';
import { AppContext } from '../../../store/AppContext';
import FiatBox from '../FiatBox/FiatBox';

const FeerateRange = (props) => {
  const appCtx = useContext(AppContext);

  const getSelFeeRateValue = () => {
    return (props.selFeeRate === FeeRate.SLOW) ? 
      (appCtx.feeRate.perkb?.min_acceptable || 0) :
      (props.selFeeRate === FeeRate.URGENT) ? 
        (appCtx.feeRate.perkb?.unilateral_close || 0) :
        (appCtx.feeRate.perkb?.opening || 0);
  };

  return (
    <>
      <Form.Label className='text-dark d-flex align-items-center justify-content-start' data-testid='fee-rate-container'>
        Fee Rate
      </Form.Label>
      <div className='slider-container'>
        <OverlayTrigger
          placement='top'
          delay={{ show: 300, hide: 300 }}
          overlay={
            <Tooltip className={'feerate-tooltip feerate-tooltip-' + props.selFeeRate}>
              {Math.round(getSelFeeRateValue() / 1000)} Sats/vB
               ≈ 
              <FiatBox className='ms-1' value={Math.round(getSelFeeRateValue() * .18)} fromUnit={Units.SATS} fiatUnit={appCtx.appConfig.fiatUnit} symbol={appCtx.fiatConfig.symbol} rate={appCtx.fiatConfig.rate} />
            </Tooltip>
            }
          >
          <Form.Range tabIndex={props.tabIndex} className='slider-pic' id='feeRange' defaultValue={1} min='0' max='2' onClick={props.selFeeRateChangeHandler} onChange={props.selFeeRateChangeHandler} />
        </OverlayTrigger>
      </div>
      <Row className='d-flex align-items-start justify-content-between'>
        {FEE_RATES.map((rate, i) => 
          <Col xs={4} className={'fs-7 text-light d-flex ' + (i === 0 ? 'justify-content-start' : i === 1 ? 'justify-content-center' : 'justify-content-end')} key={rate}>{rate}</Col>
        )}
      </Row>
    </>
  );
};

export default FeerateRange;
