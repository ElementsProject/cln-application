import React from 'react';

import './BTCCard.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from 'react-bootstrap/Card';

import BTCWallet from '../BTCWallet/BTCWallet';
import BTCDeposit from '../BTCDeposit/BTCDeposit';
import BTCWithdraw from '../BTCWithdraw/BTCWithdraw';
import { TRANSITION_DURATION } from '../../../utilities/constants';

const BTCCard = () => {
  const [selBTCCard, setSelBTCCard] = useState('wallet');

  return (
    <Card className='h-100 overflow-hidden inner-box-shadow'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={selBTCCard}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION }}
          className='h-100 overflow-hidden'
        >
          {selBTCCard === 'wallet' ? (
            <BTCWallet onActionClick={(action) => setSelBTCCard(action)} />
          ) : selBTCCard === 'deposit' ? (
            <BTCDeposit onClose={() => setSelBTCCard('wallet')} />
          ) : (
            <BTCWithdraw onClose={() => setSelBTCCard('wallet')} />
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default BTCCard;
