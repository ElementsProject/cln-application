import './FactoryListCard.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from 'react-bootstrap';
import { TRANSITION_DURATION } from '../../../utilities/constants';
import { Factory } from '../../../types/factories.type';
import FactoryList from '../FactoryList/FactoryList';
import FactoryDetail from '../FactoryDetail/FactoryDetail';
import FactoryCreate from '../FactoryCreate/FactoryCreate';

const FactoryListCard = () => {
  const [selView, setSelView] = useState<'list' | 'detail' | 'create'>('list');
  const [selFactory, setSelFactory] = useState<Factory | null>(null);

  return (
    <Card className='h-100 overflow-hidden inner-box-shadow' data-testid='factory-list-card'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={selView}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION }}
          className='h-100 overflow-hidden'
        >
          {selView === 'create' ? (
            <FactoryCreate onClose={() => setSelView('list')} />
          ) : selView === 'detail' && selFactory ? (
            <FactoryDetail
              factory={selFactory}
              onClose={() => setSelView('list')}
            />
          ) : (
            <FactoryList
              onCreateFactory={() => setSelView('create')}
              onFactoryClick={(factory) => {
                setSelFactory(factory);
                setSelView('detail');
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default FactoryListCard;
