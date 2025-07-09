import './GRPCForm.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, InputGroup, Form } from 'react-bootstrap';

import { CopySVG } from '../../../../svgs/Copy';
import { copyTextToClipboard, decodeCombinedCerts } from '../../../../utilities/data-formatters';
import logger from '../../../../services/logger.service';
import { setShowToast } from '../../../../store/rootSlice';
import { selectWalletConnect } from '../../../../store/rootSelectors';

const GRPCForm = ({ selNetwork }) => {
  const dispatch = useDispatch();
  const connectWallet = useSelector(selectWalletConnect);
  const [copyEncoded, setCopyEncoded] = useState(true);

  const copyHandler = (event) => {
    let textToCopy = '';
    switch (event.target.id) {
      case 'gRPC Host':
        textToCopy = (selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_GRPC_TOR_HOST : connectWallet.LIGHTNING_GRPC_HOST) || '';
        break;
      case 'gRPC Port':
        textToCopy = connectWallet.LIGHTNING_GRPC_PORT?.toString() || '';
        break;
      case 'Node Public Key':
        textToCopy = connectWallet.NODE_PUBKEY || '';
        break;
      case 'Proto Path':
        textToCopy = decodeURIComponent(connectWallet.LIGHTNING_GRPC_PROTO_PATH || '');
        break;
      case 'gRPC TLS Certs':
        if (!copyEncoded) {
          textToCopy = decodeCombinedCerts(connectWallet.LIGHTNING_GRPC_TLS_CERTS || '');
        } else {
          textToCopy = connectWallet.LIGHTNING_GRPC_TLS_CERTS || '';
        }
        setCopyEncoded(prev => !prev);
        break;
    }
    copyTextToClipboard(textToCopy).then(() => {
      dispatch(setShowToast({ show: true, message: ((event.target.id !== 'gRPC TLS Certs' ? event.target.id : !copyEncoded ? 'Decoded gRPC Certs' : 'Encoded gRPC Certs') + ' Copied Successfully!'), bg: 'success' }));
    }).catch((err) => {
      logger.error(err);
    });
  }

  return (
    <Col data-testid='grpc-form'>
      <Row className='d-flex align-items-start justify-content-start'>
        <Col xs={6}>
          <Form.Label className='text-light'>gRPC Host</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='gRPC Host'
              value={selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_GRPC_TOR_HOST : connectWallet.LIGHTNING_GRPC_HOST }
              aria-label={selNetwork.includes('(Tor)') ? connectWallet.LIGHTNING_GRPC_TOR_HOST : connectWallet.LIGHTNING_GRPC_HOST }
              aria-describedby='copy-addon-host'
              className='form-control-left'
              data-testid='grpc-host'
              readOnly
            />
            <InputGroup.Text
              id='gRPC Host'
              className="form-control-addon form-control-addon-right"
              onClick={copyHandler}
            >
              <CopySVG id='gRPC Host' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col xs={6}>
          <Form.Label className='text-light'>gRPC Port</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='gRPC Port'
              value={connectWallet.LIGHTNING_GRPC_PORT}
              aria-label={connectWallet.LIGHTNING_GRPC_PORT?.toString() || ''}
              aria-describedby='copy-addon-port'
              className='form-control-left'
              data-testid='grpc-port'
              readOnly
            />
            <InputGroup.Text id='gRPC Port' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='gRPC Port' showTooltip={true} />
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
          <Form.Label className='text-light'>Proto Path</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='Proto Path'
              value={decodeURIComponent(connectWallet.LIGHTNING_GRPC_PROTO_PATH || '')}
              aria-label={connectWallet.LIGHTNING_GRPC_PROTO_PATH || ''}
              aria-describedby='copy-addon-proto'
              className='form-control-left'
              data-testid='proto-path'
              readOnly
            />
            <InputGroup.Text id='Proto Path' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='Proto Path' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row className='d-flex align-items-start justify-content-center'>
        <Col xs={12}>
          <Form.Label className='text-light'>gRPC TLS Certs (Client Key + Client Cert + Ca Cert)</Form.Label>
          <InputGroup className='mb-2'>
            <Form.Control
              onClick={copyHandler}
              id='gRPC TLS Certs'
              value={connectWallet.LIGHTNING_GRPC_TLS_CERTS || ''}
              aria-label={connectWallet.LIGHTNING_GRPC_TLS_CERTS || ''}
              aria-describedby='copy-addon-grpc-client-key'
              className='form-control-left'
              data-testid='grpc-tls-certs'
              readOnly
            />
            <InputGroup.Text id='gRPC TLS Certs' className='form-control-addon form-control-addon-right' onClick={copyHandler}>
              <CopySVG id='gRPC TLS Certs' showTooltip={true} tooltipText={!copyEncoded ? 'Copy Decoded Certs' : 'Copy Encoded Certs'} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
    </Col>
  );
};

export default GRPCForm;
