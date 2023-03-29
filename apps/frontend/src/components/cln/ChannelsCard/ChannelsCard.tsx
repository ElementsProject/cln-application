import './ChannelsCard.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from 'react-bootstrap/Card';

import Channels from '../Channels/Channels';
import ChannelOpen from '../ChannelOpen/ChannelOpen';
import ChannelDetails from '../ChannelDetails/ChannelDetails';
import { CLEAR_STATUS_ALERT_DELAY, TRANSITION_DURATION } from '../../../utilities/constants';
import { Channel } from '../../../types/lightning-wallet.type';

const ChannelsCard = () => {
  const [selChannelCard, setSelChannelCard] = useState('channels');
  const [selChannel, setSelChannel] = useState<Channel | null>(null);
  const [newlyOpenedChannelId, setNewlyOpenedChannelId] = useState<string>('');

  const onCloseHandler = (channelId) => {
    setNewlyOpenedChannelId(channelId);
    setSelChannelCard('channels')
    setTimeout(() => {
      setNewlyOpenedChannelId('');
    }, CLEAR_STATUS_ALERT_DELAY);
  }

  return (
    <Card className='h-100 overflow-hidden inner-box-shadow'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={selChannelCard}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION }}
          className='h-100 overflow-hidden'
        >
          {selChannelCard === 'open' ? 
            <ChannelOpen onClose={onCloseHandler} />
            : selChannelCard === 'details' ? 
              <ChannelDetails onClose={() => setSelChannelCard('channels')} selChannel={selChannel} />
            :
              <Channels newlyOpenedChannelId={newlyOpenedChannelId} onOpenChannel={() => setSelChannelCard('open')} onChannelClick={(channel) => {setSelChannel(channel); setSelChannelCard('details')}} />
          }
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default ChannelsCard;
