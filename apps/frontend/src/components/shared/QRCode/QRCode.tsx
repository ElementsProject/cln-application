import React from 'react';

import './QRCode.scss';
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Row, Form, InputGroup } from 'react-bootstrap';

import { CopySVG } from '../../../svgs/Copy';
import { ApplicationModes } from '../../../utilities/constants';
import logger from '../../../services/logger.service';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import { RootContext } from '../../../store/RootContext';

const QRCodeComponent = (props) => {
  const rootCtx = useContext(RootContext);

  const copyHandler = () => {
    copyTextToClipboard(props.message).then((response) => {
      rootCtx.setShowToast({show: true, message: (props.toastMessage || props.message), bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  return (
    <div className={props.className} data-testid='qr-code-component'>
      <Row className='qr-container d-flex align-items-start justify-content-center'>
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
        <QRCodeCanvas value={props.message || ''} size={220} includeMargin={true} bgColor={rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK ? '#2A2A2C' : '#FFFFFF'} fgColor={rootCtx.appConfig.uiConfig.appMode === ApplicationModes.DARK ? '#FFFFFF' : '#000000'} />
      </Row>
      <Row className='w-100 mt-5 d-flex align-items-start justify-content-center'>
        <InputGroup className='px-0 mb-3'>
          <Form.Control
            onClick={copyHandler}
            placeholder={props.message}
            aria-label={props.message}
            aria-describedby='copy-addon'
            className='form-control-left'
            readOnly
          />
          <InputGroup.Text
            id={props.message}
            className='form-control-addon form-control-addon-right'
            onClick={copyHandler}
          >
            <CopySVG id={props.message} />
          </InputGroup.Text>
        </InputGroup>
      </Row>
    </div>
  );
};

export default QRCodeComponent;
