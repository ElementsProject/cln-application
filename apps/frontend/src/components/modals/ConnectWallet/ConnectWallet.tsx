import './ConnectWallet.scss';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal, Col, Row, Dropdown, InputGroup, Form } from 'react-bootstrap';

import { CopySVG } from '../../../svgs/Copy';
import { CloseSVG } from '../../../svgs/Close';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import logger from '../../../services/logger.service';
import { setConnectionUrl, setShowModals, setShowToast } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDarkMode, selectShowModals, selectWalletConnect } from '../../../store/rootSelectors';
import CommandoForm from './CommandoForm/CommandoForm';
import RESTForm from './RESTForm/RESTForm';
import GRPCForm from './GRPCForm/GRPCForm';

const ConnectWallet = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const connectWallet = useSelector(selectWalletConnect);
  const showModals = useSelector(selectShowModals);
  const [networkTypes, setNetworkTypes] = useState<string[]>(['Commando']);
  const [selNetwork, setSelNetwork] = useState('Commando');
  const [connectUrl, setConnectUrl] = useState('');

  useEffect(() => {
    let newNetworkTypes: string[] = ['Commando'];
    if (connectWallet.LIGHTNING_WS_PORT && connectWallet.LIGHTNING_WS_TOR_HOST && connectWallet.LIGHTNING_WS_TOR_HOST !== '') {
      newNetworkTypes.push('Commando (Tor)');
    }
    if (connectWallet.LIGHTNING_REST_PORT) {
      newNetworkTypes.push('REST');
      if (connectWallet.LIGHTNING_REST_TOR_HOST && connectWallet.LIGHTNING_REST_TOR_HOST !== '') {
        newNetworkTypes.push('REST (Tor)');
      }
    }
    if (connectWallet.LIGHTNING_GRPC_PORT) {
      newNetworkTypes.push('gRPC');
      if (connectWallet.LIGHTNING_GRPC_TOR_HOST && connectWallet.LIGHTNING_GRPC_TOR_HOST !== '') {
        newNetworkTypes.push('gRPC (Tor)');
      }
    }
    setNetworkTypes(newNetworkTypes);
    setConnectUrlOnChange();
  }, [connectWallet, selNetwork]);

  const closeHandler = () => {
    dispatch(setShowModals({ ...showModals, connectWalletModal: false, qrCodeLarge: false }));
  }

  const showQRCodeLarge = () => {
    dispatch(setShowModals({ ...showModals, connectWalletModal: false, qrCodeLarge: true }));
  }

  const setConnectUrlOnChange = () => {
    let newConnectUrl = '';
    if (selNetwork === 'Commando' || selNetwork === 'Commando (Tor)') {
      newConnectUrl = 'commando+' + connectWallet.LIGHTNING_WS_PROTOCOL + '://' + (selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_WS_TOR_HOST : connectWallet.LIGHTNING_WS_HOST) + ':' + connectWallet.LIGHTNING_WS_PORT + '?pubkey=' + connectWallet.NODE_PUBKEY + '&rune=' + connectWallet.ADMIN_RUNE + (connectWallet.INVOICE_RUNE != '' ? '&invoiceRune=' + connectWallet.INVOICE_RUNE : '') + (connectWallet.LIGHTNING_WS_PROTOCOL?.toLowerCase() === 'wss' ? '&certs=' + connectWallet.LIGHTNING_WS_TLS_CERTS : '');
    } else if (selNetwork === 'REST' || selNetwork === 'REST (Tor)') {
      newConnectUrl = 'clnrest+' + connectWallet.LIGHTNING_REST_PROTOCOL + '://' + (selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_REST_TOR_HOST : connectWallet.LIGHTNING_REST_HOST) + ':' + connectWallet.LIGHTNING_REST_PORT + '?rune=' + connectWallet.ADMIN_RUNE + (connectWallet.LIGHTNING_REST_PROTOCOL?.toLowerCase() === 'https' ? '&certs=' + connectWallet.LIGHTNING_REST_TLS_CERTS : '');
    } else if (selNetwork === 'gRPC' || selNetwork === 'gRPC (Tor)') {
      newConnectUrl = 'clngrpc://' + (selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_GRPC_TOR_HOST : connectWallet.LIGHTNING_GRPC_HOST) + ':' + connectWallet.LIGHTNING_GRPC_PORT + '?pubkey=' + connectWallet.NODE_PUBKEY + '&protoPath=' + connectWallet.LIGHTNING_GRPC_PROTO_PATH + '&certs=' + connectWallet.LIGHTNING_GRPC_TLS_CERTS;
    } else {
      newConnectUrl = '';
    }
    setConnectUrl(newConnectUrl);
    dispatch(setConnectionUrl(newConnectUrl));
  }

  const networkChangeHandler = (event) => {
    setSelNetwork(event.target.id);
    setConnectUrlOnChange();
  };

  const copyHandler = () => {
    copyTextToClipboard(connectUrl).then(() => {
      dispatch(setShowToast({ show: true, message: ('Connection URL Copied Successfully!'), bg: 'success' }));
    }).catch((err) => {
      logger.error(err);
    });
  }

  return (
    <>
      <Modal show={showModals.connectWalletModal} onHide={closeHandler} centered className='modal-lg' data-testid='connect-wallet'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0 border-0'>
          <span data-testid='modal-close' className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0 px-4'>
          <Row data-testid='qr-container' className='qr-container m-auto d-flex'>
            <AnimatePresence>
              <motion.img
                key='cln-logo'
                alt='Core Lightning Logo'
                src={isDarkMode ? '/images/cln-logo-dark.png' : '/images/cln-logo-light.png'}
                onClick={showQRCodeLarge}
                className='qr-cln-logo'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.01 }}
                data-testid='qr-cln-logo'
              />
            </AnimatePresence>
            <QRCodeCanvas data-testid='qr-code-canvas' onClick={showQRCodeLarge} value={connectUrl} size={220} includeMargin={true} bgColor={isDarkMode ? '#0C0C0F' : '#FFFFFF'} fgColor={isDarkMode ? '#FFFFFF' : '#000000'} />
          </Row>
          <Row className='d-flex align-items-start justify-content-center'>
            <h4 className='w-100 text-blue fw-semibold d-flex justify-content-center text-center mb-0'>
              Connect wallet to your node
            </h4>
          </Row>
          <Row className='d-flex align-items-start justify-content-left'>
            <Col xs={12}>
              <Form.Label className='text-light'>Network</Form.Label>
              <Dropdown className='dropdown-network mb-2'>
                <Dropdown.Toggle variant='secondary' id='network' className='w-100 d-flex align-items-center justify-content-between' data-testid='network-toggle'>
                  {selNetwork}
                </Dropdown.Toggle>
                <Dropdown.Menu data-testid='network-menu'>
                  {networkTypes.map((type) =>
                    <Dropdown.Item data-testid='network-item' as='div' key={type} id={type} onClick={networkChangeHandler}>{type}</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          {selNetwork === 'Commando' || selNetwork === 'Commando (Tor)' ?
            <CommandoForm selNetwork={selNetwork} />
            : selNetwork === 'REST' || selNetwork === 'REST (Tor)' ?
              <RESTForm selNetwork={selNetwork} />
              : selNetwork === 'gRPC' || selNetwork === 'gRPC (Tor)' ?
                <GRPCForm selNetwork={selNetwork} />
                : null
          }
          <Row className="mb-3 d-flex align-items-start justify-content-center">
            <Col xs={12}>
              <Form.Label className='text-light'>Connection URL</Form.Label>
              <InputGroup>
                <Form.Control
                  onClick={copyHandler}
                  id='Connection URL'
                  value={connectUrl}
                  aria-label={connectUrl}
                  aria-describedby='copy-addon-url'
                  className='form-control-left'
                  data-testid='connect-url'
                  readOnly
                />
                <InputGroup.Text data-testid='connect-url-copy' id='Connection URL' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id='Connection URL' showTooltip={true} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConnectWallet;
