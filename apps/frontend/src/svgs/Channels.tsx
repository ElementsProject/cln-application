import { motion } from 'framer-motion';
import { STAGERRED_SPRING_VARIANTS_1 } from '../utilities/constants';

export const ChannelsSVG = props => {
  return (
    <motion.svg
      className={props.className}
      width='56'
      height='42'
      viewBox='0 0 38 42'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      initial='hidden'
      animate='visible'
      >
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={0} x1='0' x2='42' y1='5' y2='5' className='stroke-body-bg stroke-linecap-round stroke-width-5' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={1} x1='0' x2='19' y1='5' y2='5' className='stroke-primary stroke-linecap-round stroke-width-5' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={0} x1='0' x2='42' y1='16' y2='16' className='stroke-body-bg stroke-linecap-round stroke-width-5' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={1.4} x1='0' x2='26' y1='16' y2='16' className='stroke-primary stroke-linecap-round stroke-width-5' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={0} x1='0' x2='42' y1='27' y2='27' className='stroke-body-bg stroke-linecap-round stroke-width-5' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={1.8} x1='0' x2='34' y1='27' y2='27' className='stroke-primary stroke-linecap-round stroke-width-5' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={0} x1='0' x2='42' y1='38' y2='38' className='stroke-body-bg stroke-linecap-round stroke-width-5' />
      <motion.line variants={STAGERRED_SPRING_VARIANTS_1} custom={2.2} x1='0' x2='9' y1='38' y2='38' className='stroke-primary stroke-linecap-round stroke-width-5' />
    </motion.svg>
  );
};
