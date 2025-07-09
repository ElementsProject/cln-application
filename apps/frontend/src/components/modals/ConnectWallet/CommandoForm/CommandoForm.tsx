import './CommandoForm.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Spinner, InputGroup, Form } from 'react-bootstrap';

import { CopySVG } from '../../../../svgs/Copy';
import { copyTextToClipboard, decodeCombinedCerts } from '../../../../utilities/data-formatters';
import logger from '../../../../services/logger.service';
import { AddSVG } from '../../../../svgs/Add';
import { CLNService } from '../../../../services/http.service';
import { setShowToast, setConnectWallet } from '../../../../store/rootSlice';
import { selectWalletConnect } from '../../../../store/rootSelectors';

const CommandoForm = ({ selNetwork }) => {
  const dispatch = useDispatch();
  const connectWallet = useSelector(selectWalletConnect);
  const [isLoadingInvoiceRune, setIsLoadingInvoiceRune] = useState(false);
  const [copyEncoded, setCopyEncoded] = useState(true);
  let invoiceRuneClickHandler;
  let InvoiceRuneSvg;

  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'WS Protocol':
        textToCopy = connectWallet.LIGHTNING_WS_PROTOCOL || '';
        break;
      case 'WS Host':
        textToCopy = (selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_TOR_HOST : connectWallet.LIGHTNING_HOST) || '';
        break;
      case 'WS Port':
        textToCopy = connectWallet.LIGHTNING_WS_PORT?.toString() || '';
        break;
      case 'Node Public Key':
        textToCopy = connectWallet.NODE_PUBKEY || '';
        break;
      case 'Rune':
        textToCopy = connectWallet.ADMIN_RUNE || '';
        break;
      case 'Invoice Rune':
        textToCopy = connectWallet.INVOICE_RUNE || '';
        break;
      case 'WSS TLS Certs':
        if (!copyEncoded) {
          textToCopy = decodeCombinedCerts(connectWallet.LIGHTNING_WS_TLS_CERTS || '');
        } else {
          textToCopy = connectWallet.LIGHTNING_WS_TLS_CERTS || '';
        }
        setCopyEncoded(prev => !prev);
        break;
    }
    copyTextToClipboard(textToCopy).then(() => {
      dispatch(setShowToast({ show: true, message: ((event.target.id !== 'WSS TLS Certs' ? event.target.id : !copyEncoded ? 'Decoded WSS Certs' : 'Encoded WSS Certs') + ' Copied Successfully!'), bg: 'success' }));
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


  if (connectWallet.INVOICE_RUNE && connectWallet.INVOICE_RUNE !== '') {
    invoiceRuneClickHandler = copyHandler;
    InvoiceRuneSvg = CopySVG;
  } else {
    invoiceRuneClickHandler = createInvoiceRuneHandler;
    InvoiceRuneSvg = AddSVG;
  }

  return (
    <Col data-testid='commando-form'>
      <Row className='d-flex align-items-start justify-content-start'>
        <Col xs={4}>
          <Form.Label className='text-light'>WS Protocol</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='WS Protocol'
              value={connectWallet.LIGHTNING_WS_PROTOCOL || ''}
              aria-label={connectWallet.LIGHTNING_WS_PROTOCOL}
              aria-describedby='copy-addon-protocol'
              className='form-control-left'
              data-testid='ws-protocol'
              readOnly
            />
            <InputGroup.Text id='WS Protocol' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='WS Protocol' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col xs={4}>
          <Form.Label className='text-light'>WS Host</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='WS Host'
              value={selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_TOR_HOST : connectWallet.LIGHTNING_HOST}
              aria-label={selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_TOR_HOST : connectWallet.LIGHTNING_HOST}
              aria-describedby='copy-addon-host'
              className='form-control-left'
              data-testid='ws-host'
              readOnly
            />
            <InputGroup.Text
              id='WS Host'
              className="form-control-addon form-control-addon-right"
              onClick={copyHandler}
            >
              <CopySVG id='WS Host' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col xs={4}>
          <Form.Label className='text-light'>WS Port</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='WS Port'
              value={connectWallet.LIGHTNING_WS_PORT}
              aria-label={connectWallet.LIGHTNING_WS_PORT?.toString() || ''}
              aria-describedby='copy-addon-port'
              className='form-control-left'
              data-testid='ws-port'
              readOnly
            />
            <InputGroup.Text id='WS Port' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='WS Port' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row className='d-flex align-items-start justify-content-center'>
        <Col xs={12}>
          <Form.Label className='text-light'>Node Public Key</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='Node Public Key'
              value={connectWallet.NODE_PUBKEY}
              aria-label={connectWallet.NODE_PUBKEY}
              aria-describedby='copy-addon-pubkey'
              className='form-control-left'
              data-testid='node-pubkey'
              readOnly
            />
            <InputGroup.Text id='Node Public Key' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='Node Public Key' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row className='d-flex align-items-start justify-content-center'>
        <Col xs={12}>
          <Form.Label className='text-light'>Rune</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='Rune'
              value={connectWallet.ADMIN_RUNE}
              aria-label={connectWallet.ADMIN_RUNE}
              aria-describedby='copy-addon-rune'
              className='form-control-left'
              data-testid='rune'
              readOnly
            />
            <InputGroup.Text id='Rune' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='Rune' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row className='d-flex align-items-start justify-content-center'>
        <Col xs={12}>
          <Form.Label className='text-light'>Invoice Rune</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={invoiceRuneClickHandler}
              id='Invoice Rune'
              value={connectWallet.INVOICE_RUNE || ''}
              placeholder='Not Found'
              aria-label={connectWallet.INVOICE_RUNE || ''}
              disabled={isLoadingInvoiceRune}
              aria-describedby='copy-addon-invoice-rune'
              className='form-control-left'
              data-testid='invoice-rune'
              readOnly
            />
            <InputGroup.Text id='Invoice Rune' className='form-control-addon form-control-addon-right' onClick={!isLoadingInvoiceRune ? invoiceRuneClickHandler : undefined} data-testid='invoice-rune-button'>
              {isLoadingInvoiceRune ?
                <span className='h-100 d-flex justify-content-center align-items-center'>
                  <Spinner className='me-1' variant='light' size='sm' data-testid='invoice-rune-spinner' />
                </span>
                : InvoiceRuneSvg && <InvoiceRuneSvg id='Invoice Rune' showTooltip={true} tooltipText={connectWallet.INVOICE_RUNE !== '' ? 'Copy Invoice Rune' : 'Create New Invoice Rune'} />
              }
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      {connectWallet.LIGHTNING_WS_PROTOCOL?.toLowerCase() === 'wss' && (
        <Row className='d-flex align-items-start justify-content-center'>
          <Col xs={12}>
            <Form.Label className='text-light'>WSS TLS Certs (Client Key + Client Cert + Ca Cert)</Form.Label>
            <InputGroup className='mb-2'>
              <Form.Control
                onClick={copyHandler}
                id='WSS TLS Certs'
                value={connectWallet.LIGHTNING_WS_TLS_CERTS || ''}
                aria-label={connectWallet.LIGHTNING_WS_TLS_CERTS || ''}
                aria-describedby='copy-addon-wss-client-key'
                className='form-control-left'
                data-testid='wss-tls-certs'
                readOnly
              />
              <InputGroup.Text id='WSS TLS Certs' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                <CopySVG id='WSS TLS Certs' showTooltip={true} tooltipText={!copyEncoded ? 'Copy Decoded Certs' : 'Copy Encoded Certs'} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
      )}
    </Col>
  );
};

export default CommandoForm;
