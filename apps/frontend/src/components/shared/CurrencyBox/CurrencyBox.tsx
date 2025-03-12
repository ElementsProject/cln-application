import React from 'react';

import './CurrencyBox.scss';
import { useContext, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { formatCurrency } from '../../../utilities/data-formatters';
import { APP_ANIMATION_DURATION, COUNTUP_DURATION, Units } from '../../../utilities/constants';
import FiatBox from '../FiatBox/FiatBox';
import { RootContext } from '../../../store/RootContext';

const CurrencyBox = props => {
  const rootCtx = useContext(RootContext);
  const [animationFinished, setAnimationFinished] = useState(0);
  const count: any = useMotionValue(0);
  const rounded: any = useTransform(count, (value: number) => rootCtx.appConfig.uiConfig.unit === Units.BTC ? Number.parseFloat((value).toString()).toFixed(5) : Math.floor(value));

  useEffect(() => {
    setAnimationFinished(0);
    count.current = 0;
    count.prev = 0;
    const animation = animate(count, +formatCurrency(props.value, Units.SATS, rootCtx.appConfig.uiConfig.unit, false, 5, 'number'), { duration: COUNTUP_DURATION });
    setTimeout(() => {
      setAnimationFinished(1);
    }, APP_ANIMATION_DURATION * 1000);
    return animation.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OverlayTrigger
      placement='right'
      delay={{ show: 250, hide: 250 }}
      overlay={<Tooltip><FiatBox value={(+props.value || 0)} fiatUnit={rootCtx.appConfig.uiConfig.fiatUnit} symbol={rootCtx.fiatConfig.symbol} rate={rootCtx.fiatConfig.rate} iconSize='lg' /></Tooltip>}
      >
      <div className={props.rootClasses}>
        {
          animationFinished ? 
            <div className={props.currencyClasses} data-testid="currency-box-finished-text">
              {formatCurrency(props.value, Units.SATS, rootCtx.appConfig.uiConfig.unit, props.shorten, 5, 'string')}
            </div>
          : 
            <div className={'d-flex ' + props.currencyClasses}>
              <motion.div>
                {rounded}
              </motion.div>
              {(props.shorten && rootCtx.appConfig.uiConfig.unit === Units.SATS) ? 'K' : ''}
            </div>
        }
        <div className={props.unitClasses}>
          {rootCtx.appConfig.uiConfig.unit}
        </div>
      </div>
    </OverlayTrigger>
  );
};

export default CurrencyBox;
