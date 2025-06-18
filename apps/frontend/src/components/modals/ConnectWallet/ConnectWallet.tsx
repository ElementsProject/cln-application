import './ConnectWallet.scss';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal, Col, Row, Spinner, Dropdown, InputGroup, Form } from 'react-bootstrap';

import { CopySVG } from '../../../svgs/Copy';
import { CloseSVG } from '../../../svgs/Close';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import { ConnectWalletFields } from '../../../types/root.type';
import logger from '../../../services/logger.service';
import { AddSVG } from '../../../svgs/Add';
import { CLNService } from '../../../services/http.service';
import { setShowModals, setShowToast, setConnectWallet } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDarkMode, selectShowModals, selectWalletConnect } from '../../../store/rootSelectors';

const ConnectWallet = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const connectWallet = useSelector(selectWalletConnect);
  const showModals = useSelector(selectShowModals);
  const [networkTypes, setNetworkTypes] = useState<string[]>(['LN Message', 'LN Message (Tor)']);
  const [selNetwork, setSelNetwork] = useState('LN Message');
  const [connectUrl, setConnectUrl] = useState('');
  const initialConnectValues: ConnectWalletFields = { protocol: { title: 'WS Protocol', field: 'LIGHTNING_WS_PROTOCOL' }, port: { title: 'Websocket Port', field: 'LIGHTNING_WS_PORT' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, rune: { title: 'Rune', field: 'COMMANDO_RUNE' }, invoiceRune: { title: 'Invoice Rune', field: 'INVOICE_RUNE' }, connectUrl: { title: 'Lnmessage URL', field: '' } };
  const [connectValues, setConnectValues] = useState(initialConnectValues);
  const [isLoadingInvoiceRune, setIsLoadingInvoiceRune] = useState(false);

  useEffect(() => {
    let newNetworkTypes: string[] = ['LN Message', 'LN Message (Tor)'];
    if (connectWallet.LIGHTNING_REST_PORT) {
      newNetworkTypes.push('REST');
      if (connectWallet.TOR_SERVICE && connectWallet.TOR_SERVICE !== '') {
        newNetworkTypes.push('REST (Tor)');
      }
    }
    if (connectWallet.LIGHTNING_GRPC_PORT) {
      newNetworkTypes.push('gRPC');
      if (connectWallet.TOR_SERVICE && connectWallet.TOR_SERVICE !== '') {
        newNetworkTypes.push('gRPC (Tor)');
      }
    }
    setNetworkTypes(newNetworkTypes);
    if (selNetwork === 'LN Message') {
      setConnectUrl('ln-message://' + connectWallet.LIGHTNING_WS_PROTOCOL + '://' + connectWallet.DEVICE_DOMAIN_NAME + ':' + connectWallet.LIGHTNING_WS_PORT + '?rune=' + connectWallet.COMMANDO_RUNE + (connectWallet.LIGHTNING_WS_PROTOCOL?.toLowerCase() === 'wss' ? '&clientKey=' + connectWallet.CLIENT_KEY + '&clientCert=' + connectWallet.CLIENT_CERT : '') + (connectWallet.INVOICE_RUNE !== '' ? '&invoiceRune=' + connectWallet.INVOICE_RUNE : ''));
    }
  }, [connectWallet, selNetwork]);

  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'WS Protocol':
        textToCopy = connectWallet.LIGHTNING_WS_PROTOCOL?.toString() || '';
        break;
      case 'Websocket Port':
        textToCopy = connectWallet.LIGHTNING_WS_PORT?.toString() || '';
        break;
      case 'gRPC Port':
        textToCopy = connectWallet.LIGHTNING_GRPC_PORT?.toString() || '';
        break;
      case 'REST Port':
        textToCopy = connectWallet.LIGHTNING_REST_PORT?.toString() || '';
        break;
      case 'CLN Host':
        textToCopy = (selNetwork.includes('(Tor)') ? connectWallet.TOR_SERVICE : connectWallet.DEVICE_DOMAIN_NAME) || '';
        break;
      case 'Rune':
        textToCopy = connectWallet.COMMANDO_RUNE || '';
        break;
      case 'Invoice Rune':
        textToCopy = connectWallet.INVOICE_RUNE || '';
        break;
      case 'Client Key':
        textToCopy = connectWallet.CLIENT_KEY || '';
        break;
      case 'Client Cert':
        textToCopy = connectWallet.CLIENT_CERT || '';
        break;
      case 'CA Cert':
        textToCopy = connectWallet.CA_CERT || '';
        break;
      default:
        textToCopy = connectUrl || '';
        break;
    }
    copyTextToClipboard(textToCopy).then(() => {
      dispatch(setShowToast({ show: true, message: (event.target.id + ' Copied Successfully!'), bg: 'success' }));
    }).catch((err) => {
      logger.error(err);
    });
  }

  const createInvoiceRuneHandler = () => {
    setIsLoadingInvoiceRune(true);
    CLNService.createInvoiceRune()
      .then((updatedWalletConnectData) => {
        dispatch(setConnectWallet(updatedWalletConnectData));
        dispatch(setShowToast({ show: true, message: ('Created Invoice Rune Successfully!'), bg: 'success' }));
      })
      .catch(err => {
        logger.error(err.message || JSON.stringify(err));
        dispatch(setShowToast({ show: true, message: (`Error Creating Invoice Rune: ${err.message || ''}`), bg: 'danger' }));
      })
      .finally(() => {
        setIsLoadingInvoiceRune(false);
      });
  };

  const closeHandler = () => {
    dispatch(setShowModals({ ...showModals, connectWalletModal: false }));
  }

  const networkChangeHandler = (event) => {
    setSelNetwork(event.target.id);
    switch (event.target.id) {
      case 'LN Message':
        setConnectValues({ protocol: { title: 'WS Protocol', field: 'LIGHTNING_WS_PROTOCOL' }, port: { title: 'Websocket Port', field: 'LIGHTNING_WS_PORT' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, clientKey: { title: 'Client Key', field: 'CLIENT_KEY' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, rune: { title: 'Rune', field: 'COMMANDO_RUNE' }, invoiceRune: { title: 'Invoice Rune', field: 'INVOICE_RUNE' }, connectUrl: { title: 'Lnmessage URL', field: '' } });
        setConnectUrl('ln-message://' + connectWallet.LIGHTNING_WS_PROTOCOL + '://' + connectWallet.DEVICE_DOMAIN_NAME + ':' + connectWallet.LIGHTNING_WS_PORT + '?rune=' + connectWallet.COMMANDO_RUNE + (connectWallet.LIGHTNING_WS_PROTOCOL?.toLowerCase() === 'wss' ? '&clientKey=' + connectWallet.CLIENT_KEY + '&clientCert=' + connectWallet.CLIENT_CERT : '') + (connectWallet.INVOICE_RUNE !== '' ? '&invoiceRune=' + connectWallet.INVOICE_RUNE : ''));
        break;

      case 'LN Message (Tor)':
        setConnectValues({ protocol: { title: 'WS Protocol', field: 'LIGHTNING_WS_PROTOCOL' }, port: { title: 'Websocket Port', field: 'LIGHTNING_WS_PORT' }, host: { title: 'CLN Host', field: 'TOR_SERVICE' }, clientKey: { title: 'Client Key', field: 'CLIENT_KEY' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, rune: { title: 'Rune', field: 'COMMANDO_RUNE' }, invoiceRune: { title: 'Invoice Rune', field: 'INVOICE_RUNE' }, connectUrl: { title: 'Lnmessage URL', field: '' } });
        setConnectUrl('ln-message://' + connectWallet.LIGHTNING_WS_PROTOCOL + '://' + connectWallet.TOR_SERVICE + ':' + connectWallet.LIGHTNING_WS_PORT + '?rune=' + connectWallet.COMMANDO_RUNE + (connectWallet.LIGHTNING_WS_PROTOCOL?.toLowerCase() === 'wss' ? '&clientKey=' + connectWallet.CLIENT_KEY + '&clientCert=' + connectWallet.CLIENT_CERT : '') + (connectWallet.INVOICE_RUNE !== '' ? '&invoiceRune=' + connectWallet.INVOICE_RUNE : ''));
        break;

      case 'REST':
        setConnectValues({ protocol: { title: 'REST Protocol', field: 'LIGHTNING_REST_PROTOCOL' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, port: { title: 'REST Port', field: 'LIGHTNING_REST_PORT' }, clientKey: { title: 'Client Key', field: 'CLIENT_KEY' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, caCert: { title: 'CA Cert', field: 'CA_CERT' }, connectUrl: { title: 'REST URL', field: '' } });
        setConnectUrl('clnrest://' + connectWallet.LIGHTNING_REST_PROTOCOL + '://' + connectWallet.DEVICE_DOMAIN_NAME + ':' + connectWallet.LIGHTNING_REST_PORT + '?rune=' + connectWallet.COMMANDO_RUNE + (connectWallet.LIGHTNING_REST_PROTOCOL?.toLowerCase() === 'https' ? '&clientKey=' + connectWallet.CLIENT_KEY + '&clientCert=' + connectWallet.CLIENT_CERT + '&caCert=' + connectWallet.CA_CERT : ''));
        break;

      case 'REST (Tor)':
        setConnectValues({ protocol: { title: 'REST Protocol', field: 'LIGHTNING_REST_PROTOCOL' }, host: { title: 'CLN Host', field: 'TOR_SERVICE' }, port: { title: 'REST Port', field: 'LIGHTNING_REST_PORT' }, clientKey: { title: 'Client Key', field: 'CLIENT_KEY' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, caCert: { title: 'CA Cert', field: 'CA_CERT' }, connectUrl: { title: 'REST URL', field: '' } });
        setConnectUrl('clnrest://' + connectWallet.LIGHTNING_REST_PROTOCOL + '://' + connectWallet.TOR_SERVICE + ':' + connectWallet.LIGHTNING_REST_PORT + '?rune=' + connectWallet.COMMANDO_RUNE + (connectWallet.LIGHTNING_REST_PROTOCOL?.toLowerCase() === 'https' ? '&clientKey=' + connectWallet.CLIENT_KEY + '&clientCert=' + connectWallet.CLIENT_CERT + '&caCert=' + connectWallet.CA_CERT : ''));
        break;

      case 'gRPC':
        setConnectValues({ protocol: { title: 'gRPC Protocol', field: 'LIGHTNING_GRPC_PROTOCOL' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, port: { title: 'GRPC Port', field: 'LIGHTNING_GRPC_PORT' }, clientKey: { title: 'Client Key', field: 'CLIENT_KEY' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, caCert: { title: 'CA Cert', field: 'CA_CERT' }, connectUrl: { title: 'gRPC URL', field: '' } });
        setConnectUrl('cln-grpc://' + connectWallet.LIGHTNING_GRPC_PROTOCOL + '://' + connectWallet.DEVICE_DOMAIN_NAME + ':' + connectWallet.LIGHTNING_GRPC_PORT + (connectWallet.LIGHTNING_GRPC_PROTOCOL?.toLowerCase() === 'https' ? '?clientKey=' + connectWallet.CLIENT_KEY + '&clientCert=' + connectWallet.CLIENT_CERT + '&caCert=' + connectWallet.CA_CERT : ''));
        break;

      case 'gRPC (Tor)':
        setConnectValues({ protocol: { title: 'gRPC Protocol', field: 'LIGHTNING_GRPC_PROTOCOL' }, host: { title: 'CLN Host', field: 'TOR_SERVICE' }, port: { title: 'GRPC Port', field: 'LIGHTNING_GRPC_PORT' }, clientKey: { title: 'Client Key', field: 'CLIENT_KEY' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, caCert: { title: 'CA Cert', field: 'CA_CERT' }, connectUrl: { title: 'gRPC URL', field: '' } });
        setConnectUrl('cln-grpc://' + connectWallet.LIGHTNING_GRPC_PROTOCOL + '://' + connectWallet.TOR_SERVICE + ':' + connectWallet.LIGHTNING_GRPC_PORT + (connectWallet.LIGHTNING_GRPC_PROTOCOL?.toLowerCase() === 'https' ? '?clientKey=' + connectWallet.CLIENT_KEY + '&clientCert=' + connectWallet.CLIENT_CERT + '&caCert=' + connectWallet.CA_CERT : ''));
        break;

      default:
        setConnectValues({ protocol: { title: 'WS Protocol', field: 'LIGHTNING_WS_PROTOCOL' }, port: { title: 'Websocket Port', field: 'LIGHTNING_WS_PORT' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, clientKey: { title: 'Client Key', field: 'CLIENT_KEY' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, rune: { title: 'Rune', field: 'COMMANDO_RUNE' }, invoiceRune: { title: 'Invoice Rune', field: 'INVOICE_RUNE' }, connectUrl: { title: 'Lnmessage URL', field: '' } });
        setConnectUrl('ln-message://' + connectWallet.LIGHTNING_WS_PROTOCOL + '://' + connectWallet.DEVICE_DOMAIN_NAME + ':' + connectWallet.LIGHTNING_WS_PORT + '?rune=' + connectWallet.COMMANDO_RUNE + (connectWallet.LIGHTNING_WS_PROTOCOL?.toLowerCase() === 'wss' ? '&clientKey=' + connectWallet.CLIENT_KEY + '&clientCert=' + connectWallet.CLIENT_CERT : '') + (connectWallet.INVOICE_RUNE !== '' ? '&invoiceRune=' + connectWallet.INVOICE_RUNE : ''));
        break;
    }
  };

  let invoiceRuneClickHandler;
  let InvoiceRuneSvg;

  if (selNetwork === 'LN Message' || selNetwork === 'LN Message (Tor)') {
    if (connectWallet.INVOICE_RUNE && connectWallet.INVOICE_RUNE !== '') {
      invoiceRuneClickHandler = copyHandler;
      InvoiceRuneSvg = CopySVG;
    } else {
      invoiceRuneClickHandler = createInvoiceRuneHandler;
      InvoiceRuneSvg = AddSVG;
    }
  }

  return (
    <>
      <Modal show={showModals.connectWalletModal} onHide={closeHandler} centered className='modal-lg' data-testid='connect-wallet'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0'>
          <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0 px-4'>
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
            <QRCodeCanvas value={connectUrl} size={220} includeMargin={true} bgColor={isDarkMode ? '#0C0C0F' : '#FFFFFF'} fgColor={isDarkMode ? '#FFFFFF' : '#000000'} />
          </Row>
          <Row className='d-flex align-items-start justify-content-center pt-2'>
            <h4 className='w-100 text-blue fw-semibold d-flex justify-content-center text-center'>
              Connect wallet to your node
            </h4>
          </Row>
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={6}>
              <Form.Label className='text-light'>Network</Form.Label>
              <Dropdown className='dropdown-network mt-1 mb-2'>
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
            {connectValues.protocol ?
              <Col xs={6}>
                <Form.Label className='text-light'>{connectValues.protocol.title}</Form.Label>
                <InputGroup className='mb-2'>
                  <Form.Control
                    onClick={copyHandler}
                    id={connectValues.protocol.title}
                    value={connectWallet[connectValues.protocol.field] || ''}
                    aria-label={connectWallet[connectValues.protocol.field]}
                    aria-describedby='copy-addon-port'
                    className='form-control-left'
                    data-testid='protocol'
                    readOnly
                  />
                  <InputGroup.Text id={connectValues.port.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                    <CopySVG id={connectValues.port.title} />
                  </InputGroup.Text>
                </InputGroup>
              </Col> : <Col xs={6}></Col>
            }
          </Row>
          <Row className='d-flex align-items-start justify-content-center'>
            <Col xs={6}>
              <Form.Label className='text-light'>{connectValues.host.title}</Form.Label>
              <InputGroup className='mb-2'>
                <Form.Control
                  onClick={copyHandler}
                  id={connectValues.host.title}
                  value={connectWallet[connectValues.host.field] || ''}
                  aria-label={connectWallet[connectValues.host.field]}
                  aria-describedby='copy-addon-host'
                  className='form-control-left'
                  data-testid='host'
                  readOnly
                />
                <InputGroup.Text id={connectValues.host.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id={connectValues.host.title} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col xs={6}>
              <Form.Label className='text-light'>{connectValues.port.title || ''}</Form.Label>
              <InputGroup className='mb-2'>
                <Form.Control
                  onClick={copyHandler}
                  id={connectValues.port.title}
                  value={connectWallet[connectValues.port.field] || ''}
                  aria-label={connectWallet[connectValues.port.field]}
                  aria-describedby='copy-addon-port'
                  className='form-control-left'
                  data-testid='port'
                  readOnly
                />
                <InputGroup.Text
                  id={connectValues.port.title}
                  className="form-control-addon form-control-addon-right"
                  onClick={copyHandler}
                >
                  <CopySVG id={connectValues.port.title} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          {(selNetwork !== 'gRPC' && selNetwork !== 'gRPC (Tor)') && connectValues.rune ?
            <Row className='d-flex align-items-start justify-content-center'>
              <Col xs={12}>
                <Form.Label className='text-light'>{connectValues.rune.title || ''}</Form.Label>
                <InputGroup className='mb-2'>
                  <Form.Control
                    onClick={copyHandler}
                    id={connectValues.rune.title}
                    value={connectWallet[connectValues.rune.field] || ''}
                    aria-label={connectWallet[connectValues.rune.field]}
                    aria-describedby='copy-addon-rune'
                    className='form-control-left'
                    data-testid='rune'
                    readOnly
                  />
                  <InputGroup.Text id={connectValues.rune.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                    <CopySVG id={connectValues.rune.title} />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row> : <></>
          }
          {(selNetwork === 'LN Message' || selNetwork === 'LN Message (Tor)') && (
            <Row className='d-flex align-items-start justify-content-center'>
              <Col xs={12}>
                <Form.Label className='text-light'>{connectValues.invoiceRune?.title || ''}</Form.Label>
                <InputGroup className='mb-2'>
                  <Form.Control
                    onClick={invoiceRuneClickHandler}
                    id={connectValues.invoiceRune?.title}
                    value={connectWallet['INVOICE_RUNE'] || ''}
                    placeholder='Not Found'
                    aria-label={connectWallet['INVOICE_RUNE']}
                    disabled={isLoadingInvoiceRune}
                    aria-describedby='copy-addon-invoice-rune'
                    className='form-control-left'
                    data-testid='invoice-rune'
                    readOnly
                  />
                  <InputGroup.Text id={connectValues.invoiceRune?.title} className='form-control-addon form-control-addon-right' onClick={!isLoadingInvoiceRune ? invoiceRuneClickHandler : undefined} data-testid='invoice-rune-button'>
                    {isLoadingInvoiceRune ?
                      <span className='h-100 d-flex justify-content-center align-items-center'>
                        <Spinner className='me-1' variant='light' size='sm' data-testid='invoice-rune-spinner' />
                      </span>
                      : InvoiceRuneSvg && <InvoiceRuneSvg id={connectValues.invoiceRune?.title} showTooltip={connectWallet.INVOICE_RUNE === ''} tooltipText={'Create New Invoice Rune'} />
                    }
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
          )}
          {(connectWallet.LIGHTNING_WS_PROTOCOL?.toLowerCase() === 'wss' || 
            connectWallet.LIGHTNING_REST_PROTOCOL?.toLowerCase() === 'https' || 
            connectWallet.LIGHTNING_GRPC_PROTOCOL?.toLowerCase() === 'https') ?
            <>
            <Row className='d-flex align-items-start justify-content-center'>
              <Col xs={12}>
                <Form.Label className='text-light'>{connectValues.clientKey?.title || ''}</Form.Label>
                <InputGroup className='mb-2'>
                  <Form.Control
                    onClick={copyHandler}
                    id={connectValues.clientKey?.title}
                    value={connectWallet['CLIENT_KEY'] || ''}
                    aria-label={connectWallet['CLIENT_KEY']}
                    aria-describedby='copy-addon-host'
                    className='form-control-left'
                    data-testid='client-key'
                    readOnly
                  />
                  <InputGroup.Text id={connectValues.clientKey?.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                    <CopySVG id={connectValues.clientKey?.title} />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
            <Row className='d-flex align-items-start justify-content-center'>
              <Col xs={12}>
                <Form.Label className='text-light'>{connectValues.clientCert?.title || ''}</Form.Label>
                <InputGroup className='mb-2'>
                  <Form.Control
                    onClick={copyHandler}
                    id={connectValues.clientCert?.title}
                    value={connectWallet['CLIENT_CERT'] || ''}
                    aria-label={connectWallet['CLIENT_CERT']}
                    aria-describedby='copy-addon-host'
                    className='form-control-left'
                    data-testid='client-cert'
                    readOnly
                  />
                  <InputGroup.Text id={connectValues.clientCert?.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                    <CopySVG id={connectValues.clientCert?.title} />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
            </>
            :
            <></>
          }
          {(selNetwork === 'REST' && connectWallet.LIGHTNING_REST_PROTOCOL?.toLowerCase() === 'https') || 
            (selNetwork === 'gRPC' && connectWallet.LIGHTNING_GRPC_PROTOCOL?.toLowerCase() === 'https') ?
            <Row className='d-flex align-items-start justify-content-center'>
              <Col xs={12}>
                <Form.Label className='text-light'>{connectValues.caCert?.title || ''}</Form.Label>
                <InputGroup className='mb-2'>
                  <Form.Control
                    onClick={copyHandler}
                    id={connectValues.caCert?.title}
                    value={connectWallet['CA_CERT'] || ''}
                    aria-label={connectWallet['CA_CERT']}
                    aria-describedby='copy-addon-host'
                    className='form-control-left'
                    data-testid='ca-cert'
                    readOnly
                  />
                  <InputGroup.Text id={connectValues.caCert?.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                    <CopySVG id={connectValues.caCert?.title} />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
            :
            <></>
          }
          <Row className="mb-4 d-flex align-items-start justify-content-center">
            <Col xs={12}>
              <Form.Label className='text-light'>{connectValues.connectUrl?.title || ''}</Form.Label>
              <InputGroup className='mb-2'>
                <Form.Control
                  onClick={copyHandler}
                  id={connectValues.connectUrl?.title}
                  value={connectUrl || ''}
                  aria-label={connectUrl || ''}
                  aria-describedby='copy-addon-url'
                  className='form-control-left'
                  data-testid='connect-url'
                  readOnly
                />
                <InputGroup.Text id={connectValues.connectUrl?.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id={connectValues.connectUrl?.title} />
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
