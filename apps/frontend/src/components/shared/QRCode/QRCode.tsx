import './QRCode.scss';
import { useContext } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { CopySVG } from '../../../svgs/Copy';
import { ApplicationModes } from '../../../utilities/constants';
import { AppContext } from '../../../store/AppContext';
import logger from '../../../services/logger.service';
import { copyTextToClipboard } from '../../../utilities/data-formatters';

const QRCodeComponent = (props) => {
  const appCtx = useContext(AppContext);

  const copyHandler = () => {
    copyTextToClipboard(props.message).then((response) => {
      appCtx.setShowToast({show: true, message: (props.toastMessage || props.message), bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  return (
    <div className={props.className}>
      <Row className='qr-container d-flex align-items-start justify-content-center'>
        <img alt='cln-logo' src={appCtx.appConfig.appMode === ApplicationModes.DARK ? 'images/cln-logo-dark.png' : 'images/cln-logo-light.png'} className='qr-cln-logo' />
        <QRCodeCanvas value={props.message || ''} size={220} includeMargin={true} bgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#2A2A2C' : '#FFFFFF'} fgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#FFFFFF' : '#000000'} />
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
