import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { ConvertBTCToSats, ConvertMSatsToSats, formatCurrency } from '../../../utilities/data-formatters';
import { APP_ANIMATION_DURATION, COUNTUP_DURATION, Units } from '../../../utilities/constants';
import FiatBox from '../FiatBox/FiatBox';
import { useSelector } from 'react-redux';
import { selectFiatConfig, selectFiatUnit, selectUIConfigUnit } from '../../../store/rootSelectors';

const CurrencyBox = props => {
  const fiatUnit = useSelector(selectFiatUnit);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const fiatConfig = useSelector(selectFiatConfig);
  const [animationFinished, setAnimationFinished] = useState(0);
  const count: any = useMotionValue(0);
  const rounded: any = useTransform(count, (value: number) => uiConfigUnit === Units.BTC ? Number.parseFloat((value).toString()).toFixed(5) : Math.floor(value));

  useEffect(() => {
    setAnimationFinished(0);
    count.current = 0;
    count.prev = 0;
    const animation = animate(count, +formatCurrency(props.value, Units.SATS, uiConfigUnit, false, 5, 'number'), { duration: COUNTUP_DURATION });
    setTimeout(() => {
      setAnimationFinished(1);
    }, APP_ANIMATION_DURATION * 1000);
    return animation.stop;
  }, []);

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 250 }}
      overlay={<Tooltip><FiatBox value={props.fromUnit && props.fromUnit === Units.MSATS ? ConvertMSatsToSats(props.value, 0, 'number') : props.fromUnit && props.fromUnit === Units.BTC ? ConvertBTCToSats(props.value) : props.value} fiatUnit={fiatUnit} symbol={fiatConfig.symbol} rate={fiatConfig.rate} iconSize='lg' /></Tooltip>}
      >
      <div className={props.rootClasses} data-testid='currency-box'>
        {
          animationFinished ? 
            <div className={props.currencyClasses} data-testid="currency-box-finished-text">
              {formatCurrency(props.value, props.fromUnit || Units.SATS, uiConfigUnit, props.shorten, 5, 'string')}
            </div>
          : 
            <div className={'d-flex ' + props.currencyClasses}>
              <motion.div>
                {rounded}
              </motion.div>
              {(props.shorten && uiConfigUnit === Units.SATS) ? 'K' : ''}
            </div>
        }
        {!props.hideUnit && (
        <div className={props.unitClasses}>
          {uiConfigUnit}
        </div>
        )}
      </div>
    </OverlayTrigger>
  );
};

export default CurrencyBox;
