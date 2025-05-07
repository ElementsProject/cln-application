import './ToggleSwitch.scss';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { SPRING_VARIANTS } from '../../../utilities/constants';
import { RootService } from '../../../services/http.service';
import { setConfig } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectAppConfig } from '../../../store/rootSelectors';

const ToggleSwitch = props => {
  const dispatch = useDispatch();
  const [isSwitchOn, setIsSwitchOn] = useState(props.selValue === props.values[1]);
  const appConfig = useSelector(selectAppConfig);
 
  const changeValueHandler = async(event) => {
    setIsSwitchOn((prevValue) => !prevValue);
    const currValue = isSwitchOn ? 0 : 1;
    const updatedConfig = { 
      ...appConfig, 
      uiConfig: {
        ...appConfig.uiConfig,
        unit: props.values[currValue]
      }
    };
    await RootService.updateConfig(updatedConfig);
    dispatch(setConfig(updatedConfig));
  };

  return (
    <div
      className={'fs-7 toggle ' + (props.className ? props.className : '')}
      data-isswitchon={isSwitchOn}
      onClick={changeValueHandler}
      data-testid="toggle-switch"
    >
      <div className="toggle-bg-text px-2 d-flex flex-fill align-items-center justify-content-between">
        <span className="text-center me-2">{props.values[0]}</span>
        <span className="text-center ms-2">{props.values[1]}</span>
      </div>
      <motion.div
        layout
        transition={SPRING_VARIANTS}
        className={
          'toggle-switch justify-content-center d-flex align-items-center ' +
          (isSwitchOn ? 'toggle-right' : 'toggle-left')
        }
      >
        <span>{props.selValue}</span>
      </motion.div>
    </div>
  );
};

export default ToggleSwitch;
