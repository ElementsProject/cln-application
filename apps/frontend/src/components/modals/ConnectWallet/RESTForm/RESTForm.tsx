import './RESTForm.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, InputGroup, Form } from 'react-bootstrap';

import { CopySVG } from '../../../../svgs/Copy';
import { copyTextToClipboard, decodeCombinedCerts } from '../../../../utilities/data-formatters';
import logger from '../../../../services/logger.service';
import { setShowToast } from '../../../../store/rootSlice';
import { selectWalletConnect } from '../../../../store/rootSelectors';

const RESTForm = ({ selNetwork }) => {
  const dispatch = useDispatch();
  const connectWallet = useSelector(selectWalletConnect);
  const [copyEncoded, setCopyEncoded] = useState(true);

  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'REST Protocol':
        textToCopy = connectWallet.LIGHTNING_REST_PROTOCOL || '';
        break;
      case 'REST Host':
        textToCopy = (selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_REST_TOR_HOST : connectWallet.LIGHTNING_REST_HOST) || '';
        break;
      case 'REST Port':
        textToCopy = connectWallet.LIGHTNING_REST_PORT?.toString() || '';
        break;
      case 'Rune':
        textToCopy = connectWallet.ADMIN_RUNE || '';
        break;
      case 'REST TLS Certs':
        if (!copyEncoded) {
          textToCopy = decodeCombinedCerts(connectWallet.LIGHTNING_REST_TLS_CERTS || '');
        } else {
          textToCopy = connectWallet.LIGHTNING_REST_TLS_CERTS || '';
        }
        setCopyEncoded(prev => !prev);
        break;
    }
    copyTextToClipboard(textToCopy).then(() => {
      dispatch(setShowToast({ show: true, message: ((event.target.id !== 'REST TLS Certs' ? event.target.id : !copyEncoded ? 'Decoded REST Certs' : 'Encoded REST Certs') + ' Copied Successfully!'), bg: 'success' }));
    }).catch((err) => {
      logger.error(err);
    });
  }

  return (
    <Col data-testid='rest-form'>
      <Row className='d-flex align-items-start justify-content-start'>
        <Col xs={4}>
          <Form.Label className='text-light'>REST Protocol</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='REST Protocol'
              value={connectWallet.LIGHTNING_REST_PROTOCOL || ''}
              aria-label={connectWallet.LIGHTNING_REST_PROTOCOL}
              aria-describedby='copy-addon-protocol'
              className='form-control-left'
              data-testid='rest-protocol'
              readOnly
            />
            <InputGroup.Text id='REST Protocol' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='REST Protocol' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col xs={4}>
          <Form.Label className='text-light'>REST Host</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='REST Host'
              value={selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_REST_TOR_HOST : connectWallet.LIGHTNING_REST_HOST }
              aria-label={selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_REST_TOR_HOST : connectWallet.LIGHTNING_REST_HOST }
              aria-describedby='copy-addon-host'
              className='form-control-left'
              data-testid='rest-host'
              readOnly
            />
            <InputGroup.Text
              id='REST Host'
              className="form-control-addon form-control-addon-right"
              onClick={copyHandler}
            >
              <CopySVG id='REST Host' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col xs={4}>
          <Form.Label className='text-light'>REST Port</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='REST Port'
              value={connectWallet.LIGHTNING_REST_PORT}
              aria-label={connectWallet.LIGHTNING_REST_PORT?.toString() || ''}
              aria-describedby='copy-addon-port'
              className='form-control-left'
              data-testid='rest-port'
              readOnly
            />
            <InputGroup.Text id='REST Port' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='REST Port' showTooltip={true} />
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
      {connectWallet.LIGHTNING_REST_PROTOCOL?.toLowerCase() === 'https' && (
        <Row className='d-flex align-items-start justify-content-center'>
          <Col xs={12}>
            <Form.Label className='text-light'>REST TLS Certs (Client Key + Client Cert + Ca Cert)</Form.Label>
            <InputGroup className='mb-2'>
              <Form.Control
                onClick={copyHandler}
                id='REST TLS Certs'
                value={connectWallet.LIGHTNING_REST_TLS_CERTS || ''}
                aria-label={connectWallet.LIGHTNING_REST_TLS_CERTS}
                aria-describedby='copy-addon-rest-client-key'
                className='form-control-left'
                data-testid='rest-tls-certs'
                readOnly
              />
              <InputGroup.Text id='REST TLS Certs' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
                <CopySVG id='REST TLS Certs' showTooltip={true} tooltipText={!copyEncoded ? 'Copy Decoded Certs' : 'Copy Encoded Certs'} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
      )}
    </Col>
  );
};

export default RESTForm;
