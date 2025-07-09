import './QRCodeLarge.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal, Row } from 'react-bootstrap';

import { CloseSVG } from '../../../svgs/Close';
import { setShowModals } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectConnectionUrl, selectIsDarkMode, selectShowModals } from '../../../store/rootSelectors';

const QRCodeLarge = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const showModals = useSelector(selectShowModals);
  const connectionUrl = useSelector(selectConnectionUrl);

  const closeHandler = () => {
    dispatch(setShowModals({ ...showModals, connectWalletModal: true, qrCodeLarge: false }));
  }

  return (
    <>
      <Modal show={showModals.qrCodeLarge} onHide={closeHandler} centered className='modal-lg' data-testid='qr-code-large'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0 border-0'>
          <span data-testid='modal-close' className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='p-0'>
          <Row className='qr-container-large m-auto d-flex' data-testid='qr-container-large' data-key={connectionUrl}>
            <AnimatePresence>
              <motion.img
                key='cln-logo'
                alt='Core Lightning Logo'
                src={isDarkMode ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'}
                onClick={closeHandler}
                className='qr-cln-logo'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.01 }}
              />
            </AnimatePresence>
            <QRCodeCanvas onClick={closeHandler} value={connectionUrl} size={440} includeMargin={true} bgColor={isDarkMode ? '#0C0C0F' : '#FFFFFF'} fgColor={isDarkMode ? '#FFFFFF' : '#000000'} />
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default QRCodeLarge;
