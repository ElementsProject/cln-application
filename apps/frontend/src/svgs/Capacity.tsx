import { motion } from 'framer-motion';
import { ANIMATION_FINAL_STATE, ANIMATION_INITIAL_STATE, ANIMATION_TRANSITION, STAGERRED_SPRING_VARIANTS_1 } from '../utilities/constants';

export const CapacitySVG = props => {
  return (
    <motion.svg
      className={props.className}
      width='56'
      height='66'
      viewBox='0 0 56 56'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      initial='hidden'
      animate='visible'
    >
      <motion.circle
        cx="28"
        cy="28"
        r="14"
        className='stroke-body-bg stroke-width-28'
        initial={ANIMATION_INITIAL_STATE}
        animate={ANIMATION_FINAL_STATE}
        transition={ANIMATION_TRANSITION}
      />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={0.5} x1='20' x2='20' y1='23' y2='33' className='stroke-primary stroke-linecap-round stroke-width-4' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={0.9} x1='28' x2='28' y1='16' y2='33' className='stroke-primary stroke-linecap-round stroke-width-4' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={0.7} x1='36' x2='36' y1='26' y2='33' className='stroke-primary stroke-linecap-round stroke-width-4' />
    </motion.svg>
  );
};
