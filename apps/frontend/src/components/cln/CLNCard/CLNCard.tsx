import React from 'react';
import './CLNCard.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from 'react-bootstrap/Card';

import CLNWallet from '../CLNWallet/CLNWallet';
import CLNReceive from '../CLNReceive/CLNReceive';
import CLNSend from '../CLNSend/CLNSend';
import { TRANSITION_DURATION } from '../../../utilities/constants';

const CLNCard = () => {
  const [selCLNCard, setSelCLNCard] = useState('wallet');

  return (
    <Card className='h-100 overflow-hidden inner-box-shadow'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={selCLNCard}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION }}
          className='h-100 overflow-hidden'
        >
          {selCLNCard === 'wallet' ? (
            <CLNWallet onActionClick={(action) => setSelCLNCard(action)} />
          ) : selCLNCard === 'receive' ? (
            <CLNReceive onClose={() => setSelCLNCard('wallet')} />
          ) : (
            <CLNSend onClose={() => setSelCLNCard('wallet')} />
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default CLNCard;
