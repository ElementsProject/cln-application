import './NodeInfo.scss';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal, Row, InputGroup, Form } from 'react-bootstrap';

import { CopySVG } from '../../../svgs/Copy';
import { CloseSVG } from '../../../svgs/Close';
import logger from '../../../services/logger.service';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import { setShowModals, setShowToast } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDarkMode, selectNodeInfo, selectShowModals } from '../../../store/rootSelectors';

const NodeInfo = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const nodeInfo = useSelector(selectNodeInfo);
  const showModals = useSelector(selectShowModals);
  const [nodeURI, setNodeURI] = useState('');

  useEffect(() => {
    let uri = (nodeInfo.id || '');
    if (nodeInfo.address && nodeInfo.address?.length && nodeInfo.address.length > 0) {
      uri = uri + '@' + nodeInfo.address[0].address + ':' + nodeInfo.address[0].port;
    } else if (nodeInfo.binding && nodeInfo.binding?.length && nodeInfo.binding.length > 0) {
      uri = uri + '@' + nodeInfo.binding[0].address + ':' + nodeInfo.binding[0].port;
    } else {
      uri = uri + '@ : ';
    }
    setNodeURI(uri);
  }, [nodeInfo]);

  const copyHandler = () => {
    copyTextToClipboard(nodeURI).then(() => {
      dispatch(setShowToast({show: true, message: 'Node ID Copied Successfully!', bg: 'success'}));
    }).catch((err) => {
      logger.error(err);
    });
  }

  const closeHandler = () => {
    dispatch(setShowModals({...showModals, nodeInfoModal: false}));
  }

  return (
      <Modal show={showModals.nodeInfoModal} onHide={closeHandler} centered className='modal-lg' data-testid='node-info-modal'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0 border-0'>
          <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0'>
          <Row className='qr-container m-auto d-flex'>
            <AnimatePresence>
              <motion.img
                key='cln-logo'
                alt='Core Lightning Logo'
                src={isDarkMode ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'}
                className='qr-cln-logo'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.01 }}
              />
            </AnimatePresence>
            <QRCodeCanvas value={nodeURI || ''} size={220} includeMargin={true} bgColor={isDarkMode ? '#0C0C0F' : '#FFFFFF'} fgColor={isDarkMode ? '#FFFFFF' : '#000000'} />
          </Row>
          <Row className='d-flex align-items-start justify-content-center pt-2'>
            <h4 className='text-blue fw-bold d-flex justify-content-center'>Node ID</h4>
            <p className='py-3 w-75 text-break text-dark d-flex justify-content-center'>
              Other Lightning nodes can open payment channels to your node following this Node ID.            
            </p>
            <div className='mb-4 text-break text-dark d-flex justify-content-center'>
            <InputGroup className='mb-3'>
              <Form.Control 
                onClick={copyHandler}
                placeholder={nodeURI}
                aria-label={nodeURI}
                aria-describedby="copy-addon"
                className="form-control-left"
                readOnly
              />
              <InputGroup.Text
                id={nodeURI}
                className="form-control-addon form-control-addon-right"
                onClick={copyHandler}
              >
                <CopySVG id={nodeURI} />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default NodeInfo;
