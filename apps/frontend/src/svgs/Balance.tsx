import { motion } from 'framer-motion';
import { ANIMATION_FINAL_STATE, ANIMATION_INITIAL_STATE, ANIMATION_TRANSITION, OPACITY_VARIANTS } from '../utilities/constants';

export const BalanceSVG = props => {
  return (
    <motion.svg
      className={props.className}
      width='92'
      height='44'
      viewBox='0 0 92 44'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      variants={OPACITY_VARIANTS}
    >
      <motion.path
        d='M2.5 41.5C2.5 41.5 8.77975 -6.00537 24.5 16C40.2203 38.0054 46.5 36.9946 52.5 20C59.9168 -1.0075 87.258 17.0806 90 2'
        stroke='url(#paint0_linear_20_1677)'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
        initial={ANIMATION_INITIAL_STATE}
        animate={ANIMATION_FINAL_STATE}
        transition={ANIMATION_TRANSITION}
      />
      <defs>
        <linearGradient
          id='paint0_linear_20_1677'
          x1='-1.00002'
          y1='46.5'
          x2='71.0778'
          y2='-16.9144'
          gradientUnits='userSpaceOnUse'
        >
          <stop className='fill-strong-contrast' />
          <stop offset='1' className='fill-strong-contrast' stopOpacity='0' />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};
