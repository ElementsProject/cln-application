import React from 'react';
import { motion } from 'framer-motion';
import { TRANSITION_DURATION } from '../utilities/constants';

export const ChevronSVG = ({ open, className, width, height, onClick }: { open: boolean, className?: string, width?: string, height?: string, onClick?: () => void }) => {
  return (
    <motion.svg
      width={width || '12'}
      height={height || '7'}
      viewBox='0 0 12 7'
      className={className}
      fill='transparent'
      animate={{ rotate: open ? -180 : 0 }}
      transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
      onClick={onClick}
      pointerEvents='all'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0.816895 0.640839L5.85211 5.94219L10.8873 0.640839'
        className='stroke-light'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </motion.svg>
  );
}
