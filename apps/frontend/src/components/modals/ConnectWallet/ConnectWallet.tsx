import './ConnectWallet.scss';
import { useContext, useState, useEffect } from 'react';
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
import { ConnectWalletFields } from '../../../types/app-config.type';
import logger from '../../../services/logger.service';
import useHttp from '../../../hooks/use-http';
import { AddSVG } from '../../../svgs/Add';
import { Spinner } from 'react-bootstrap';

const ConnectWallet = () => {
  const appCtx = useContext(AppContext);
  const { createInvoiceRune } = useHttp();
  const [networkTypes, setNetworkTypes] = useState<string[]>(['LN Message', 'LN Message (Tor)']);
  const [selNetwork, setSelNetwork] = useState('LN Message');
  const [connectUrl, setConnectUrl] = useState('');
  const initialConnectValues: ConnectWalletFields = { port: { title: 'Websocket Port', field: 'WS_PORT' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, macaroon: { title: 'Rune', field: 'COMMANDO_RUNE' }, invoiceRune: { title: 'Invoice Rune', field: "INVOICE_RUNE" }, connectUrl: { title: 'Lnmessage URL', field: '' }, clientCert: { title: 'Client Cert', field: '' }, caCert: { title: 'CA Cert', field: '' } };
  const [connectValues, setConnectValues] = useState(initialConnectValues);
  const [isLoadingInvoiceRune, setIsLoadingInvoiceRune] = useState(false);

  useEffect(() => {
    let newNetworkTypes: string[] = ['LN Message', 'LN Message (Tor)'];
    if (appCtx.walletConnect.REST_PORT && appCtx.walletConnect.REST_PORT !== '') {
      newNetworkTypes.push('REST');
      if (appCtx.walletConnect.TOR_HOST && appCtx.walletConnect.TOR_HOST !== '') {
        newNetworkTypes.push('REST (Tor)');
      }
    }
    if (appCtx.walletConnect.GRPC_PORT && appCtx.walletConnect.GRPC_PORT !== '') {
      newNetworkTypes.push('gRPC');
      if (appCtx.walletConnect.TOR_HOST && appCtx.walletConnect.TOR_HOST !== '') {
        newNetworkTypes.push('gRPC (Tor)');
      }
    }
    setNetworkTypes(newNetworkTypes);
    if (selNetwork === 'LN Message') {
      setConnectUrl('ln-message://' + appCtx.walletConnect.DEVICE_DOMAIN_NAME + ':' + appCtx.walletConnect.WS_PORT + '?rune=' + appCtx.walletConnect.COMMANDO_RUNE);
    }    
  }, [appCtx, selNetwork]);

  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'Websocket Port':
        textToCopy = appCtx.walletConnect.WS_PORT || '';
        break;
      case 'gRPC Port':
        textToCopy = appCtx.walletConnect.GRPC_PORT || '';
        break;
      case 'REST Port':
        textToCopy = appCtx.walletConnect.REST_PORT || '';
        break;
      case 'CLN Host':
        textToCopy = (selNetwork.includes('(Tor)') ? appCtx.walletConnect.TOR_HOST : appCtx.walletConnect.LOCAL_HOST) || '';
        break;
      case 'Rune':
        textToCopy = appCtx.walletConnect.COMMANDO_RUNE || '';
        break;
      case 'Macaroon':
        textToCopy = appCtx.walletConnect.REST_MACAROON || '';
        break;
      case 'Invoice Rune':
        textToCopy = appCtx.walletConnect.INVOICE_RUNE || '';
        break;
      case 'Client Key':
        textToCopy = appCtx.walletConnect.CLIENT_KEY || '';
        break;
      case 'Client Cert':
        textToCopy = appCtx.walletConnect.CLIENT_CERT || '';
        break;
      case 'CA Cert':
        textToCopy = appCtx.walletConnect.CA_CERT || '';
        break;
      default:
        textToCopy = connectUrl || '';
        break;
    }
    copyTextToClipboard(textToCopy).then((response) => {
      appCtx.setShowToast({show: true, message: (event.target.id + ' Copied Successfully!'), bg: 'success'});
    }).catch((err) => {
      logger.error(err);
    });
  }

  const createInvoiceRuneHandler = () => {
    setIsLoadingInvoiceRune(true);
    createInvoiceRune()
      .then(() => {
        appCtx.setShowToast({show: true, message: ('Created Invoice Rune Successfully!'), bg: 'success'});
      })
      .catch(err => {
        logger.error(err.message || JSON.stringify(err));
        appCtx.setShowToast({show: true, message: (`Error Creating Invoice Rune: ${err.message || ''}`), bg: 'danger'});
      })
      .finally(() => {
        setIsLoadingInvoiceRune(false);
      });
  }

  const closeHandler = () => {
    appCtx.setShowModals({...appCtx.showModals, connectWalletModal: false});
  }

  const networkChangeHandler = (event) => {
    setSelNetwork(event.target.id);
    switch (event.target.id) {
      case 'LN Message':
        setConnectValues({ port: { title: 'Websocket Port', field: 'WS_PORT' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, macaroon: { title: 'Rune', field: 'COMMANDO_RUNE' }, invoiceRune: { title: 'Invoice Rune', field: "INVOICE_RUNE" }, connectUrl: { title: 'Lnmessage URL', field: '' }, clientCert: { title: 'Client Cert', field: '' }, caCert: { title: 'CA Cert', field: '' } });
        setConnectUrl('ln-message://' + appCtx.walletConnect.DEVICE_DOMAIN_NAME + ':' + appCtx.walletConnect.WS_PORT + '?rune=' + appCtx.walletConnect.COMMANDO_RUNE);
        break;

      case 'LN Message (Tor)':
        setConnectValues({ port: { title: 'Websocket Port', field: 'WS_PORT' }, host: { title: 'CLN Host', field: 'TOR_DOMAIN_NAME' }, macaroon: { title: 'Rune', field: 'COMMANDO_RUNE' }, invoiceRune: { title: 'Invoice Rune', field: "INVOICE_RUNE" }, connectUrl: { title: 'Lnmessage URL', field: '' }, clientCert: { title: 'Client Cert', field: '' }, caCert: { title: 'CA Cert', field: '' } });
        setConnectUrl('ln-message://' + appCtx.walletConnect.TOR_DOMAIN_NAME + ':' + appCtx.walletConnect.WS_PORT + '?rune=' + appCtx.walletConnect.COMMANDO_RUNE);
        break;

      case 'REST':
        setConnectValues({ port: { title: 'REST Port', field: 'REST_PORT' }, host: { title: 'CLN Host', field: 'LOCAL_HOST' }, macaroon: { title: 'Macaroon', field: 'REST_MACAROON' }, invoiceRune: { title: 'Invoice Rune', field: "INVOICE_RUNE" }, connectUrl: { title: 'REST URL', field: '' }, clientCert: { title: 'Client Cert', field: '' }, caCert: { title: 'CA Cert', field: '' } });
        setConnectUrl('c-lightning-rest://' + appCtx.walletConnect.LOCAL_HOST + ':' + appCtx.walletConnect.REST_PORT + '?macaroon=' + appCtx.walletConnect.REST_MACAROON + '&protocol=http');
        break;

      case 'REST (Tor)':
        setConnectValues({ port: { title: 'REST Port', field: 'REST_PORT' }, host: { title: 'CLN Host', field: 'TOR_HOST' }, macaroon: { title: 'Macaroon', field: 'REST_MACAROON' }, invoiceRune: { title: 'Invoice Rune', field: "INVOICE_RUNE" }, connectUrl: { title: 'REST URL', field: '' }, clientCert: { title: 'Client Cert', field: '' }, caCert: { title: 'CA Cert', field: '' } });
        setConnectUrl('c-lightning-rest://' + appCtx.walletConnect.TOR_HOST + ':' + appCtx.walletConnect.REST_PORT + '?macaroon=' + appCtx.walletConnect.REST_MACAROON + '&protocol=http');
        break;
  
      case 'gRPC':
        setConnectValues({ port: { title: 'gRPC Port', field: 'GRPC_PORT' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, macaroon: { title: 'Client Key', field: 'CLIENT_KEY' }, invoiceRune: { title: 'Invoice Rune', field: "INVOICE_RUNE" }, connectUrl: { title: 'gRPC URL', field: '' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, caCert: { title: 'CA Cert', field: 'CA_CERT' } });
        setConnectUrl('cln-grpc://' + appCtx.walletConnect.DEVICE_DOMAIN_NAME + ':' + appCtx.walletConnect.GRPC_PORT + '?clientkey=' + appCtx.walletConnect.CLIENT_KEY + '&clientCert=' + appCtx.walletConnect.CLIENT_CERT + '&caCert=' + appCtx.walletConnect.CA_CERT);
        break;
  
      case 'gRPC (Tor)':
        setConnectValues({ port: { title: 'gRPC Port', field: 'GRPC_PORT' }, host: { title: 'CLN Host', field: 'TOR_DOMAIN_NAME' }, macaroon: { title: 'Client Key', field: 'CLIENT_KEY' }, invoiceRune: { title: 'Invoice Rune', field: "INVOICE_RUNE" }, connectUrl: { title: 'gRPC URL', field: '' }, clientCert: { title: 'Client Cert', field: 'CLIENT_CERT' }, caCert: { title: 'CA Cert', field: 'CA_CERT' } });
        setConnectUrl('cln-grpc://' + appCtx.walletConnect.TOR_DOMAIN_NAME + ':' + appCtx.walletConnect.GRPC_PORT + '?clientkey=' + appCtx.walletConnect.CLIENT_KEY + '&clientCert=' + appCtx.walletConnect.CLIENT_CERT);
        break;

      default:
        setConnectValues({ port: { title: 'Websocket Port', field: 'WS_PORT' }, host: { title: 'CLN Host', field: 'DEVICE_DOMAIN_NAME' }, macaroon: { title: 'Rune', field: 'COMMANDO_RUNE' }, invoiceRune: { title: 'Invoice Rune', field: "INVOICE_RUNE" }, connectUrl: { title: 'Lnmessage URL', field: '' }, clientCert: { title: 'Client Cert', field: '' }, caCert: { title: 'CA Cert', field: '' } });
        setConnectUrl('ln-message://' + appCtx.walletConnect.DEVICE_DOMAIN_NAME + ':' + appCtx.walletConnect.WS_PORT + '?rune=' + appCtx.walletConnect.COMMANDO_RUNE);
        break;
    }
  }

  let invoiceRuneClickHandler;
  let InvoiceRuneSvg;

  if (selNetwork === 'LN Message' || selNetwork === 'LN Message (Tor)') {
    if (appCtx.walletConnect.INVOICE_RUNE && appCtx.walletConnect.INVOICE_RUNE !== '') {
      invoiceRuneClickHandler = copyHandler;
      InvoiceRuneSvg = CopySVG;
    } else {
      invoiceRuneClickHandler = createInvoiceRuneHandler;
      InvoiceRuneSvg = AddSVG;
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
            <QRCodeCanvas value={connectUrl} size={220} includeMargin={true} bgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#0C0C0F' : '#FFFFFF'} fgColor={appCtx.appConfig.appMode === ApplicationModes.DARK ? '#FFFFFF' : '#000000'} />
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
              <Dropdown.Toggle variant='secondary' id='network' className='w-100 d-flex align-items-center justify-content-between' data-testid='network-toggle'>
                {selNetwork}
              </Dropdown.Toggle>
              <Dropdown.Menu data-testid='network-menu'>
                { networkTypes.map((type) => 
                  <Dropdown.Item data-testid='network-item' as='div' key={type} id={type} onClick={networkChangeHandler}>{type}</Dropdown.Item>
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
                  data-testid='port'
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
                  data-testid='host'
                  readOnly
                />
                <InputGroup.Text id={connectValues.host.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id={connectValues.host.title} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
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
                  data-testid='macaroon'
                  readOnly
                />
                <InputGroup.Text id={connectValues.macaroon.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                  <CopySVG id={connectValues.macaroon.title} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          { (selNetwork === 'LN Message' || selNetwork === 'LN Message (Tor)') && (
              <Row className='d-flex align-items-start justify-content-center'>
                <Col xs={12}>
                  <Form.Label className='text-light'>{connectValues.invoiceRune.title}</Form.Label>
                  <InputGroup className='mb-3'>
                    <Form.Control
                      onClick={invoiceRuneClickHandler}
                      id={connectValues.invoiceRune.title}
                      value={appCtx.walletConnect[connectValues.invoiceRune.field]}
                      placeholder='Not Found'
                      aria-label={appCtx.walletConnect[connectValues.invoiceRune.field]}
                      disabled={isLoadingInvoiceRune}
                      aria-describedby='copy-addon-macaroon'
                      className='form-control-left'
                      data-testid='invoice-rune'
                      readOnly
                    />
                    <InputGroup.Text id={connectValues.invoiceRune.title} className='form-control-addon form-control-addon-right' onClick={!isLoadingInvoiceRune ? invoiceRuneClickHandler : undefined} data-testid='invoice-rune-button'>
                      { isLoadingInvoiceRune ? 
                        <span className='h-100 d-flex justify-content-center align-items-center'>
                          <Spinner className='me-1' variant='light' size='sm' data-testid='invoice-rune-spinner'/>
                        </span>
                        : InvoiceRuneSvg && <InvoiceRuneSvg id={connectValues.invoiceRune.title} showTooltip={appCtx.walletConnect.INVOICE_RUNE === ''} tooltipText={'Create New Invoice Rune'} />
                      }
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
            )
          }
          { selNetwork === 'gRPC' || selNetwork === 'gRPC (Tor)' ?
              <Row className='d-flex align-items-start justify-content-center'>
                <Col xs={12}>
                  <Form.Label className='text-light'>{connectValues.clientCert.title}</Form.Label>
                  <InputGroup className='mb-3'>
                    <Form.Control 
                      onClick={copyHandler}
                      id={connectValues.clientCert.title}
                      value={appCtx.walletConnect[connectValues.clientCert.field]}
                      aria-label={appCtx.walletConnect[connectValues.clientCert.field]}
                      aria-describedby='copy-addon-host'
                      className='form-control-left'
                      data-testid='client-cert'
                      readOnly
                    />
                    <InputGroup.Text id={connectValues.clientCert.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                      <CopySVG id={connectValues.clientCert.title} />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
            :
            <></>
          }
          { selNetwork === 'gRPC' ?
              <Row className='d-flex align-items-start justify-content-center'>
                <Col xs={12}>
                  <Form.Label className='text-light'>{connectValues.caCert.title}</Form.Label>
                  <InputGroup className='mb-3'>
                    <Form.Control 
                      onClick={copyHandler}
                      id={connectValues.caCert.title}
                      value={appCtx.walletConnect[connectValues.caCert.field]}
                      aria-label={appCtx.walletConnect[connectValues.caCert.field]}
                      aria-describedby='copy-addon-host'
                      className='form-control-left'
                      data-testid='ca-cert'
                      readOnly
                    />
                    <InputGroup.Text id={connectValues.caCert.title} className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                      <CopySVG id={connectValues.caCert.title} />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
            :
            <></>
          }
          <Row className='mb-4 d-flex align-items-start justify-content-center'>
            <Col xs={12}>
              <Form.Label className='text-light'>{connectValues.connectUrl.title}</Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control 
                  onClick={copyHandler}
                  id={connectValues.connectUrl.title}
                  value={connectUrl || ''}
                  aria-label={connectUrl || ''}
                  aria-describedby='copy-addon-macaroon'
                  className='form-control-left'
                  data-testid='connect-url'
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
