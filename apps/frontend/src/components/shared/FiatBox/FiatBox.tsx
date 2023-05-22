import './FiatBox.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formatFiatValue } from '../../../utilities/data-formatters';
import { Units } from '../../../utilities/constants';

const FiatBox = props => {
  return (
    <span className={'d-flex align-items-center justify-content-start fiat-box-span ' + props.className}>
      { props.symbol ? <FontAwesomeIcon icon={props.symbol} className={'fa-' + (props.iconSize || 'sm')} /> : <></> }
      <span className='ms-2px pt-2px'>{formatFiatValue((+props.value || 0), +props.rate, (props.fromUnit || Units.SATS))}</span>
    </span>
  );
};

export default FiatBox;
