import './NodeInfo.scss';
import { useContext } from 'react';
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

  const copyHandler = () => {
    copyTextToClipboard(appCtx.nodeInfo.id).then((response) => {
      appCtx.setShowToast({show: true, message: 'Node ID Copied Successfully!', bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  const closeHandler = () => {
    appCtx.setShowModals({...appCtx.showModals, nodeInfoModal: false});
  }

  return (
      <Modal show={appCtx.showModals.nodeInfoModal} onHide={closeHandler} centered className='modal-lg'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0'>
          <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0'>
          <Row className='qr-container m-auto d-flex'>
            <img alt='cln-logo' src={appCtx.appConfig.appMode === ApplicationModes.DARK ? 'images/cln-logo-dark.png' : 'images/cln-logo-light.png'} className='qr-cln-logo' />
            <QRCodeCanvas value={appCtx.nodeInfo.id || ''} size={220} includeMargin={true} bgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#0C0C0F' : '#FFFFFF'} fgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#FFFFFF' : '#000000'} />
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
                placeholder={appCtx.nodeInfo.id}
                aria-label={appCtx.nodeInfo.id}
                aria-describedby='copy-addon'
                className='form-control-left'
                readOnly
              />
              <InputGroup.Text className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                <CopySVG id={appCtx.nodeInfo.id} />
              </InputGroup.Text>
            </InputGroup>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
  );  
}

export default NodeInfo;
