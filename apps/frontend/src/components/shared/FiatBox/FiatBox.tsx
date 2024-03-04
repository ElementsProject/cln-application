import React from 'react';

import './FiatBox.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formatFiatValue } from '../../../utilities/data-formatters';
import { Units } from '../../../utilities/constants';
import { CurrencySVG } from '../../../svgs/Currency';

const FiatBox = props => {
  return (
    <span className={'d-flex align-items-center justify-content-start fiat-box-span ' + props.className} data-testid='fiat-box'>
      { props.symbol ?
        <FontAwesomeIcon icon={props.symbol} className={'fa-' + (props.iconSize || 'sm')} />
        :
        <CurrencySVG className='svg-currency' fiat={props.fiatUnit}></CurrencySVG>
      }
      <span className='ms-2px pt-2px'>{formatFiatValue((+props.value || 0), +props.rate, (props.fromUnit || Units.SATS))}</span>
    </span>
  );
};

export default FiatBox;
