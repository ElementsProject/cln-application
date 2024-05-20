import React from 'react';

import './ToggleSwitch.scss';
import { useContext, useState } from 'react';
import { motion } from 'framer-motion';

import useHttp from '../../../hooks/use-http';
import { AppContext } from '../../../store/AppContext';
import { SPRING_VARIANTS } from '../../../utilities/constants';

const ToggleSwitch = (props) => {
  const [isSwitchOn, setIsSwitchOn] = useState(props.selValue === props.values[1]);
  const appCtx = useContext(AppContext);
  const { updateConfig } = useHttp();
 
  const changeValueHandler = (event) => {
    setIsSwitchOn((prevValue) => {
      updateConfig({ ...appCtx[props.storeSelector], [props.storeKey]: props.values[+!prevValue]});
      return !prevValue;
    })
  };

  return (
    <div className={'fs-7 toggle ' + (props.className ? props.className : '')} data-isswitchon={isSwitchOn} onClick={changeValueHandler} data-testid='toggle-switch'>
      <div className='toggle-bg-text px-2 d-flex flex-fill align-items-center justify-content-between'>
        <span className='text-center me-2'>{props.values[0]}</span>
        <span className='text-center ms-2'>{props.values[1]}</span>
      </div>
      <motion.div layout transition={SPRING_VARIANTS} className={'toggle-switch justify-content-center d-flex align-items-center ' + (isSwitchOn ? 'toggle-right' : 'toggle-left')}>
        <span>{props.selValue}</span>
      </motion.div>
    </div>
  );
}

export default ToggleSwitch;
