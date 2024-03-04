import React from 'react';

import './ConnectWallet.scss';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const NETWORK_TYPES = ['REST (Local Network)', 'REST (Tor)', 'LN Message', 'LN Message (Tor)']

const ConnectWallet = () => {
  const appCtx = useContext(AppContext);
  const [selNetwork, setSelNetwork] = useState(0);
  const [clnConnectUrl, setClnConnectUrl] = useState('c-lightning-rest://' + appCtx.walletConnect.LOCAL_HOST + ':' + appCtx.walletConnect.REST_PORT + '?macaroon=' + appCtx.walletConnect.REST_MACAROON + '&protocol=http');
  const [lnMessageConnectUrl, setLnMessageConnectUrl] = useState('ln-message://' + appCtx.walletConnect.DEVICE_DOMAIN_NAME + ':' + appCtx.walletConnect.WS_PORT + '?pubkey=' + appCtx.walletConnect.NODE_PUBKEY + '&rune=' + appCtx.walletConnect.COMMANDO_RUNE);
  const [connectValues, setConnectValues] = useState({ pubkey: { title: 'Node Pubkey', field: 'NODE_PUBKEY' }, port: { title: 'REST Port', field: 'REST_PORT' }, host: { title: 'Host', field: 'LOCAL_HOST' }, macaroon: { title: 'Macaroon', field: 'REST_MACAROON' }, connectUrl: { title: 'REST URL', field: '' } });

  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'Websocket Port':
        textToCopy = appCtx.walletConnect.WS_PORT || '';
        break;
      case 'CLN Host':
        textToCopy = ((selNetwork === 2 || selNetwork === 3) ? appCtx.walletConnect.DEVICE_DOMAIN_NAME : appCtx.walletConnect.TOR_DOMAIN_NAME) || '';
        break;
      case 'Rune':
        textToCopy = appCtx.walletConnect.COMMANDO_RUNE || '';
        break;
      case 'Node Pubkey':
        textToCopy = appCtx.walletConnect.NODE_PUBKEY || '';
        break;
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
        textToCopy = (selNetwork === 2 || selNetwork === 3) ? lnMessageConnectUrl : clnConnectUrl;
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
    switch (+event.target.id) {
      case 1:
        setConnectValues({ pubkey: { title: 'Node Pubkey', field: 'NODE_PUBKEY' }, port: { title: 'REST Port', field: 'REST_PORT' }, host: { title: 'Host', field: 'TOR_HOST' }, macaroon: { title: 'Macaroon', field: 'REST_MACAROON' }, connectUrl: { title: 'REST URL', field: '' } });
        setClnConnectUrl('c-lightning-rest://' + appCtx.walletConnect.TOR_HOST + ':' + appCtx.walletConnect.REST_PORT + '?macaroon=' + appCtx.walletConnect.REST_MACAROON + '&protocol=http');
        break;

      case 2:
        setConnectValues({ pubkey: { title: 'Node Pubkey', field: 'NODE_PUBKEY' }, port: { title: 'Websocket Port', field: 'WS_PORT' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, macaroon: { title: 'Rune', field: 'COMMANDO_RUNE' }, connectUrl: { title: 'Lnmessage URL', field: '' } });
        setLnMessageConnectUrl('ln-message://' + appCtx.walletConnect.DEVICE_DOMAIN_NAME + ':' + appCtx.walletConnect.WS_PORT + '?pubkey=' + appCtx.walletConnect.NODE_PUBKEY + '&rune=' + appCtx.walletConnect.COMMANDO_RUNE);
        break;

      case 3:
        setConnectValues({ pubkey: { title: 'Node Pubkey', field: 'NODE_PUBKEY' }, port: { title: 'Websocket Port', field: 'WS_PORT' }, host: { title: 'CLN Host', field: 'TOR_DOMAIN_NAME' }, macaroon: { title: 'Rune', field: 'COMMANDO_RUNE' }, connectUrl: { title: 'Lnmessage URL', field: '' } });
        setLnMessageConnectUrl('ln-message://' + appCtx.walletConnect.TOR_DOMAIN_NAME + ':' + appCtx.walletConnect.WS_PORT + '?pubkey=' + appCtx.walletConnect.NODE_PUBKEY + '&rune=' + appCtx.walletConnect.COMMANDO_RUNE);
        break;
  
      default:
        setConnectValues({ pubkey: { title: 'Node Pubkey', field: 'NODE_PUBKEY' }, port: { title: 'REST Port', field: 'REST_PORT' }, host: { title: 'Host', field: 'LOCAL_HOST' }, macaroon: { title: 'Macaroon', field: 'REST_MACAROON' }, connectUrl: { title: 'REST URL', field: '' } });
        setClnConnectUrl('c-lightning-rest://' + appCtx.walletConnect.LOCAL_HOST + ':' + appCtx.walletConnect.REST_PORT + '?macaroon=' + appCtx.walletConnect.REST_MACAROON + '&protocol=http');
        break;
    }
  }

  return (
    <>
      <Modal show={appCtx.showModals.connectWalletModal} onHide={closeHandler} centered className='modal-lg' data-testid='connect-wallet'> 
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0'>
          <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0 px-4'>
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
            <QRCodeCanvas value={(selNetwork === 2 || selNetwork === 3) ? (lnMessageConnectUrl || '') : (clnConnectUrl || '')} size={220} includeMargin={true} bgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#0C0C0F' : '#FFFFFF'} fgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#FFFFFF' : '#000000'} />
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
              <Form.Label className='text-light'>{connectValues.port.title}</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id={connectValues.port.title}
                  value={appCtx.walletConnect[connectValues.port.field]}
                  aria-label={appCtx.walletConnect[connectValues.port.field]}
                  aria-describedby='copy-addon-port'
                  className='form-control-left'
                  readOnly
                />
                <InputGroup.Text id={connectValues.port.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id={connectValues.port.title} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className='text-light'>{connectValues.host.title}</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id={connectValues.host.title}
                  value={appCtx.walletConnect[connectValues.host.field]}
                  aria-label={appCtx.walletConnect[connectValues.host.field]}
                  aria-describedby='copy-addon-host'
                  className='form-control-left'
                  readOnly
                />
                <InputGroup.Text id={connectValues.host.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id={connectValues.host.title} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          { (selNetwork === 2 || selNetwork === 3) ? 
            <Row className='d-flex align-items-start justify-content-center'>
              <Col xs={12}>
                <Form.Label className='text-light'>{connectValues.pubkey.title}</Form.Label>
                <InputGroup className='mb-3'>
                  <Form.Control 
                    onClick={copyHandler}
                    id={connectValues.pubkey.title}
                    value={appCtx.walletConnect[connectValues.pubkey.field]}
                    aria-label={appCtx.walletConnect[connectValues.pubkey.field]}
                    aria-describedby='copy-addon-host'
                    className='form-control-left'
                    readOnly
                  />
                  <InputGroup.Text id={connectValues.pubkey.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                    <CopySVG id={connectValues.pubkey.title} />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
            :
            <></>
          }
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className='text-light'>{connectValues.macaroon.title}</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id={connectValues.macaroon.title}
                  value={appCtx.walletConnect[connectValues.macaroon.field]}
                  aria-label={appCtx.walletConnect[connectValues.macaroon.field]}
                  aria-describedby='copy-addon-macaroon'
                  className='form-control-left'
                  readOnly
                />
                <InputGroup.Text id={connectValues.macaroon.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id={connectValues.macaroon.title} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Row className='mb-4 d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className='text-light'>{connectValues.connectUrl.title}</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id={connectValues.connectUrl.title}
                  value={(selNetwork === 2 || selNetwork === 3) ? (lnMessageConnectUrl || '') : (clnConnectUrl || '')}
                  aria-label={(selNetwork === 2 || selNetwork === 3) ? (lnMessageConnectUrl || '') : (clnConnectUrl || '')}
                  aria-describedby='copy-addon-macaroon'
                  className='form-control-left'
                  readOnly
                />
                <InputGroup.Text id={connectValues.connectUrl.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id={connectValues.connectUrl.title} />
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
