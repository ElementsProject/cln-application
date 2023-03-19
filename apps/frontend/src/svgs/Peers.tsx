import { motion } from 'framer-motion';
import { OPACITY_VARIANTS, ANIMATION_INITIAL_STATE, ANIMATION_TRANSITION, ANIMATION_DELAYED_TRANSITION, ANIMATION_FINAL_STATE } from '../utilities/constants';

export const PeersSVG = props => {

  return (
    <motion.svg 
      className={props.className}
      width='56'
      height='56'
      viewBox='0 0 56 56'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      variants={OPACITY_VARIANTS}
    >
      <motion.circle
        cx="28"
        cy="28"
        r="14"
        className='stroke-primary-bg stroke-width-28'
        initial={ANIMATION_INITIAL_STATE}
        animate={ANIMATION_FINAL_STATE}
        transition={ANIMATION_TRANSITION}
      />
    <motion.path
      initial={ANIMATION_INITIAL_STATE}
      animate={ANIMATION_FINAL_STATE}
      transition={ANIMATION_DELAYED_TRANSITION}
      fillRule='evenodd' clipRule='evenodd' d='M33.4482 29.3184C35.0466 30.4034 36.1666 31.8734 36.1666 33.8334V37.3334H39.6666C40.3082 37.3334 40.8332 36.8084 40.8332 36.1667V33.8334C40.8332 31.29 36.6682 29.785 33.4482 29.3184Z' className='fill-2'/>
    <motion.path 
      initial={ANIMATION_INITIAL_STATE}
      animate={ANIMATION_FINAL_STATE}
      transition={ANIMATION_DELAYED_TRANSITION}
      d='M24.5007 28.0001C27.078 28.0001 29.1673 25.9107 29.1673 23.3334C29.1673 20.7561 27.078 18.6667 24.5007 18.6667C21.9233 18.6667 19.834 20.7561 19.834 23.3334C19.834 25.9107 21.9233 28.0001 24.5007 28.0001Z' className='fill-2'/>
    <motion.path
      initial={ANIMATION_INITIAL_STATE}
      animate={ANIMATION_FINAL_STATE}
      transition={ANIMATION_DELAYED_TRANSITION}
      fillRule='evenodd' clipRule='evenodd' d='M31.5009 28.0001C34.0792 28.0001 36.1676 25.9117 36.1676 23.3334C36.1676 20.7551 34.0792 18.6667 31.5009 18.6667C30.9526 18.6667 30.4392 18.7834 29.9492 18.9467C30.9176 20.1484 31.5009 21.6767 31.5009 23.3334C31.5009 24.9901 30.9176 26.5184 29.9492 27.7201C30.4392 27.8834 30.9526 28.0001 31.5009 28.0001Z' className='fill-2'/>
    <motion.path
      initial={ANIMATION_INITIAL_STATE}
      animate={ANIMATION_FINAL_STATE}
      transition={ANIMATION_DELAYED_TRANSITION}
      fillRule='evenodd' clipRule='evenodd' d='M24.5003 29.1667C21.3853 29.1667 15.167 30.7301 15.167 33.8334V36.1667C15.167 36.8084 15.692 37.3334 16.3337 37.3334H32.667C33.3087 37.3334 33.8337 36.8084 33.8337 36.1667V33.8334C33.8337 30.7301 27.6153 29.1667 24.5003 29.1667Z' className='fill-2'/>
    </motion.svg>
  );
};
