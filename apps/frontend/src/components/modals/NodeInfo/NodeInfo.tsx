import React from 'react';

import './NodeInfo.scss';
import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal, Row, InputGroup, Form } from 'react-bootstrap';

import { CopySVG } from '../../../svgs/Copy';
import { ApplicationModes } from '../../../utilities/constants';
import { CloseSVG } from '../../../svgs/Close';
import logger from '../../../services/logger.service';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import { RootContext } from '../../../store/RootContext';
import { CLNContext } from '../../../store/CLNContext';

const NodeInfo = () => {
  const rootCtx = useContext(RootContext);
  const clnCtx = useContext(CLNContext);
  const [nodeURI, setNodeURI] = useState('');

  useEffect(() => {
    let uri = (clnCtx.nodeInfo.id || '');
    if (clnCtx.nodeInfo.address && clnCtx.nodeInfo.address?.length && clnCtx.nodeInfo.address.length > 0) {
      uri = uri + '@' + clnCtx.nodeInfo.address[0].address + ':' + clnCtx.nodeInfo.address[0].port;
    } else if (clnCtx.nodeInfo.binding && clnCtx.nodeInfo.binding?.length && clnCtx.nodeInfo.binding.length > 0) {
      uri = uri + '@' + clnCtx.nodeInfo.binding[0].address + ':' + clnCtx.nodeInfo.binding[0].port;
    } else {
      uri = uri + '@ : ';
    }
    setNodeURI(uri);
  }, [clnCtx]);

  const copyHandler = () => {
    copyTextToClipboard(nodeURI).then((response) => {
      rootCtx.setShowToast({show: true, message: 'Node ID Copied Successfully!', bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  const closeHandler = () => {
    rootCtx.setShowModals({...rootCtx.showModals, nodeInfoModal: false});
  }

  return (
      <Modal show={rootCtx.showModals.nodeInfoModal} onHide={closeHandler} centered className='modal-lg' data-testid='node-info-modal'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0'>
          <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0'>
          <Row className='qr-container m-auto d-flex'>
            <AnimatePresence>
              <motion.img
                key='cln-logo'
                alt='Core Lightning Logo'
                src={rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'}
                className='qr-cln-logo'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.01 }}
              />
            </AnimatePresence>
            <QRCodeCanvas value={nodeURI || ''} size={220} includeMargin={true} bgColor={rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK ? '#0C0C0F' : '#FFFFFF'} fgColor={rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK ? '#FFFFFF' : '#000000'} />
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
                aria-describedby='copy-addon'
                className='form-control-left'
                readOnly
              />
              <InputGroup.Text id={nodeURI} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                <CopySVG id={nodeURI} />
              </InputGroup.Text>
            </InputGroup>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
  );  
}

export default NodeInfo;
