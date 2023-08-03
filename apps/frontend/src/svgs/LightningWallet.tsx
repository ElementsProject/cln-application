import React from 'react';

import { motion } from 'framer-motion';
import { ANIMATION_FINAL_STATE, ANIMATION_INITIAL_STATE, ANIMATION_TRANSITION, OPACITY_VARIANTS } from '../utilities/constants';

export const LightningWalletSVG = props => {
  return (
    <motion.svg
      className={props.svgClassName}
      width='24'
      height='53'
      viewBox='0 0 24 53'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      variants={OPACITY_VARIANTS}
    >
      <motion.path
        d='M20.8982 0.208008L0.782227 27.374L24.0002 21.264H10.0882L20.8982 0.208008Z'
        className={props.className}
        initial={ANIMATION_INITIAL_STATE}
        animate={ANIMATION_FINAL_STATE}
        transition={ANIMATION_TRANSITION}
      />
      <motion.path
        d='M3.60199 52.4719L23.718 25.3059L0.5 31.4159H14.412L3.60199 52.4719Z'
        className={props.className}
        initial={ANIMATION_INITIAL_STATE}
        animate={ANIMATION_FINAL_STATE}
        transition={ANIMATION_TRANSITION}
      />
    </motion.svg>
  );
};
