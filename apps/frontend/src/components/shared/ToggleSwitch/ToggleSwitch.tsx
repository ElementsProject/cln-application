import './ToggleSwitch.scss';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { BOUNCY_SPRING_VARIANTS_1 } from '../../../utilities/constants';

const ToggleSwitch = ({
  values,
  selIndex,
  onChange,
  className = '',
  disabled = false,
}: {
  values: (string | React.ReactNode)[];
  selIndex: number;
  onChange: (index: number) => void;
  className?: string;
  disabled?: boolean;
}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(selIndex === 1);

  useEffect(() => {
    setIsSwitchOn(selIndex === 1);
  }, [selIndex]);

  const changeValueHandler = () => {
    if (disabled) return;
    const nextIndex = isSwitchOn ? 0 : 1;
    setIsSwitchOn(!isSwitchOn);
    onChange(nextIndex);
  };

  return (
    <div
      className={'fs-7 toggle ' + (className ? className : '') + (disabled ? ' toggle-disabled' : '')}
      data-isswitchon={isSwitchOn}
      onClick={changeValueHandler}
      data-testid="toggle-switch"
      aria-disabled={disabled}
    >
      <div className="toggle-bg-text px-2 d-flex flex-fill align-items-center justify-content-between">
        <span>{values[0]}</span>
        <span className="me-1">{values[1]}</span>
      </div>
      <motion.div
        layout
        transition={BOUNCY_SPRING_VARIANTS_1}
        className={
          'toggle-switch d-flex align-items-center justify-content-center ' +
          (isSwitchOn ? 'toggle-right' : 'toggle-left')
        }
      >
        <span>{isSwitchOn ? values[1] : values[0]}</span>
      </motion.div>
    </div>
  );
};

export default ToggleSwitch;
