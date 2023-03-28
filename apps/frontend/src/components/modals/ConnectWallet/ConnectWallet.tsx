import './ConnectWallet.scss';
import { useContext, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/esm/Dropdown';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import Form from 'react-bootstrap/esm/Form';

import { ApplicationModes } from '../../../utilities/constants';
import { CopySVG } from '../../../svgs/Copy';
import { AppContext } from '../../../store/AppContext';
import { CloseSVG } from '../../../svgs/Close';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import logger from '../../../services/logger.service';

const NETWORK_TYPES = ['Local Network', 'Tor']

const ConnectWallet = () => {
  const appCtx = useContext(AppContext);
  const [selNetwork, setSelNetwork] = useState(0);
  const [clnConnectUrl, setClnConnectUrl] = useState('c-lightning-rest://' + appCtx.walletConnect.LOCAL_HOST + ':' + appCtx.walletConnect.REST_PORT + '?macaroon=' + appCtx.walletConnect.REST_MACAROON + '&protocol=http');

  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'REST Port':
        textToCopy = appCtx.walletConnect.REST_PORT || '';
        break;
      case 'Host':
        textToCopy = (selNetwork === 0 ? appCtx.walletConnect.LOCAL_HOST : appCtx.walletConnect.TOR_HOST) || '';
        break;
      case 'Macaroon':
        textToCopy = appCtx.walletConnect.REST_MACAROON || '';
        break;
      default:
        textToCopy = clnConnectUrl;
        break;
    }
    copyTextToClipboard(textToCopy).then((response) => {
      appCtx.setShowToast({show: true, message: (event.target.id + ' Copied Successfully!'), bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  const closeHandler = () => {
    appCtx.setShowModals({...appCtx.showModals, connectWalletModal: false});
  }

  const networkChangeHandler = (event) => {
    setSelNetwork(+event.target.id);
    const url = (+event.target.id === 0) ?
      'c-lightning-rest://' + appCtx.walletConnect.LOCAL_HOST + ':' + appCtx.walletConnect.REST_PORT + '?macaroon=' + appCtx.walletConnect.REST_MACAROON + '&protocol=http'
    :
      'c-lightning-rest://' + appCtx.walletConnect.TOR_HOST + ':' + appCtx.walletConnect.REST_PORT + '?macaroon=' + appCtx.walletConnect.REST_MACAROON + '&protocol=http'
    setClnConnectUrl(url);
  }

  return (
    <>
      <Modal show={appCtx.showModals.connectWalletModal} onHide={closeHandler} centered className='modal-lg'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0'>
          <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0 px-4'>
          <Row className='qr-container m-auto d-flex'>
            <img alt='cln-logo' src={appCtx.appConfig.appMode === ApplicationModes.DARK ? 'images/cln-logo-dark.png' : 'images/cln-logo-light.png'} className='qr-cln-logo' />
            <QRCodeCanvas value={clnConnectUrl || ''} size={220} includeMargin={true} bgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#0C0C0F' : '#FFFFFF'} fgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#FFFFFF' : '#000000'} />
          </Row>
          <Row className='d-flex align-items-start justify-content-center pt-2'>
            <h4 className='w-75 text-blue fw-bold d-flex justify-content-center text-center'>
              Connect your lightning wallet to your node
            </h4>
          </Row>
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={6}>
            <Form.Label className='text-light'>Network</Form.Label>
            <Dropdown className='dropdown-network mt-1'>
              <Dropdown.Toggle variant='secondary' id='network' className='w-100 d-flex align-items-center justify-content-between'>
                {NETWORK_TYPES[selNetwork]}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                { NETWORK_TYPES.map((type, i) => 
                  <Dropdown.Item as='div' key={i} id={i.toString()} onClick={networkChangeHandler}>{type}</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>              
            </Col>
            <Col xs={6}>
              <Form.Label className='text-light'>REST Port</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id='REST Port'
                  value={appCtx.walletConnect.REST_PORT}
                  aria-label={appCtx.walletConnect.REST_PORT}
                  aria-describedby='copy-addon-port'
                  className='form-control-left'
                  readOnly
                />
                <InputGroup.Text className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id='REST Port' />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className='text-light'>Host</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id='Host'
                  value={selNetwork === 0 ? appCtx.walletConnect.LOCAL_HOST : appCtx.walletConnect.TOR_HOST}
                  aria-label={selNetwork === 0 ? appCtx.walletConnect.LOCAL_HOST : appCtx.walletConnect.TOR_HOST}
                  aria-describedby='copy-addon-host'
                  className='form-control-left'
                  readOnly
                />
                <InputGroup.Text className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id='Host' />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className='text-light'>Macaroon</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id='Macaroon'
                  value={appCtx.walletConnect.REST_MACAROON}
                  aria-label={appCtx.walletConnect.REST_MACAROON}
                  aria-describedby='copy-addon-macaroon'
                  className='form-control-left'
                  readOnly
                />
                <InputGroup.Text className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id='Macaroon' />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Row className='mb-4 d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className='text-light'>REST Connect URL</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id='REST URL'
                  value={clnConnectUrl}
                  aria-label={clnConnectUrl}
                  aria-describedby='copy-addon-macaroon'
                  className='form-control-left'
                  readOnly
                />
                <InputGroup.Text className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id='REST URL' />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ConnectWallet;
