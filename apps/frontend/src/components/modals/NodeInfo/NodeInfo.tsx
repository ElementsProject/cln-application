import React from 'react';

import './NodeInfo.scss';
import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import { AppContext } from '../../../store/AppContext';
import { CopySVG } from '../../../svgs/Copy';
import { ApplicationModes } from '../../../utilities/constants';
import { CloseSVG } from '../../../svgs/Close';
import logger from '../../../services/logger.service';
import { copyTextToClipboard } from '../../../utilities/data-formatters';

const NodeInfo = () => {
  const appCtx = useContext(AppContext);
  const [nodeURI, setNodeURI] = useState('');

  useEffect(() => {
    let uri = (appCtx.nodeInfo.id || '');
    if (appCtx.nodeInfo.address && appCtx.nodeInfo.address?.length && appCtx.nodeInfo.address.length > 0) {
      uri = uri + '@' + appCtx.nodeInfo.address[0].address + ':' + appCtx.nodeInfo.address[0].port;
    } else if (appCtx.nodeInfo.binding && appCtx.nodeInfo.binding?.length && appCtx.nodeInfo.binding.length > 0) {
      uri = uri + '@' + appCtx.nodeInfo.binding[0].address + ':' + appCtx.nodeInfo.binding[0].port;
    } else {
      uri = uri + '@ : ';
    }
    setNodeURI(uri);
  }, [appCtx]);

  const copyHandler = () => {
    copyTextToClipboard(nodeURI).then((response) => {
      appCtx.setShowToast({show: true, message: 'Node ID Copied Successfully!', bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  const closeHandler = () => {
    appCtx.setShowModals({...appCtx.showModals, nodeInfoModal: false});
  }

  return (
      <Modal show={appCtx.showModals.nodeInfoModal} onHide={closeHandler} centered className='modal-lg' data-testid='node-info-modal'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0'>
          <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0'>
          <Row className='qr-container m-auto d-flex'>
            <AnimatePresence>
              <motion.img
                key='cln-logo'
                alt='Core Lightning Logo'
                src={appCtx.appConfig.appMode === ApplicationModes.DARK ? 'images/cln-logo-dark.png' : 'images/cln-logo-light.png'}
                className='qr-cln-logo'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.01 }}
              />
            </AnimatePresence>
            <QRCodeCanvas value={nodeURI || ''} size={220} includeMargin={true} bgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#0C0C0F' : '#FFFFFF'} fgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#FFFFFF' : '#000000'} />
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
