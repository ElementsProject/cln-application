import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { TRANSITION_DURATION } from '../../../utilities/constants';

const RouteTransition = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: TRANSITION_DURATION }}
        className='overflow-hidden'
        data-testid="route-transition"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

export default RouteTransition;
