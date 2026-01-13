import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formatFiatValue } from '../../../utilities/data-formatters';
import { FIAT_CURRENCIES, Units } from '../../../utilities/constants';
import { CurrencySVG } from '../../../svgs/Currency';
import { useSelector } from 'react-redux';
import { selectFiatUnit } from '../../../store/rootSelectors';

const FiatBox = props => {
  const fiatUnit = useSelector(selectFiatUnit);
  const fiatSymbol = FIAT_CURRENCIES.find((fiat => fiat.currency === fiatUnit))?.symbol;

  return (
    <span
      className={'d-flex align-items-center justify-content-start fiat-box-span ' + props.className}
      data-testid="fiat-box"
    >
      {props.symbol || (fiatSymbol?.prefix.startsWith('fa') && fiatSymbol.iconName) ? (
        <FontAwesomeIcon icon={props.symbol || fiatSymbol} className={'fa-' + (props.iconSize || 'sm')} />
      ) : (
        <CurrencySVG className="svg-currency" fiat={props.fiatUnit || 'USD'}></CurrencySVG>
      )}
      <span className="ms-2px pt-2px">
        {formatFiatValue(+props.value || 0, +props.rate, props.fromUnit || Units.SATS)}
      </span>
    </span>
  );
};

export default FiatBox;
