import './NodeInfo.scss';
import { useEffect, useState } from 'react';
import { nodeUris } from '../../../utilities/channel-status';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal, Row, InputGroup, Form } from 'react-bootstrap';

import { CopySVG } from '../../../svgs/Copy';
import { CloseSVG } from '../../../svgs/Close';
import logger from '../../../services/logger.service';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import { setShowModals, setShowToast } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDarkMode, selectNodeInfo, selectShowModals } from '../../../store/rootSelectors';

const NodeInfo = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const nodeInfo = useSelector(selectNodeInfo);
  const showModals = useSelector(selectShowModals);
  const [nodeURI, setNodeURI] = useState('');

  useEffect(() => {
    const uris = nodeUris(nodeInfo.id || '', nodeInfo.address || []);
    setNodeURI(previous => uris.includes(previous) ? previous : (uris[0] || ''));
  }, [nodeInfo]);

  const uris = nodeUris(nodeInfo.id || '', nodeInfo.address || []);

  const copyHandler = () => {
    copyTextToClipboard(nodeURI || nodeInfo.id || '').then(() => {
      dispatch(setShowToast({show: true, message: nodeURI ? 'Node URI copied' : 'Node ID copied', bg: 'success'}));
    }).catch((err) => {
      logger.error(err);
    });
  }

  const closeHandler = () => {
    dispatch(setShowModals({...showModals, nodeInfoModal: false}));
  }

  return (
      <Modal show={showModals.nodeInfoModal} onHide={closeHandler} centered className='modal-lg' data-testid='node-info-modal'>
        <Modal.Header className='d-flex align-items-start justify-content-end pb-0 border-0'>
          <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
        </Modal.Header>
        <Modal.Body className='py-0'>
          {nodeURI && <Row className='qr-container m-auto d-flex'>
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
            <QRCodeCanvas value={nodeURI || ''} size={220} includeMargin={true} bgColor={isDarkMode ? '#0C0C0F' : '#FFFFFF'} fgColor={isDarkMode ? '#FFFFFF' : '#000000'} />
          </Row>}
          <Row className='d-flex align-items-start justify-content-center pt-2'>
            <h4 className='text-blue fw-bold d-flex justify-content-center'>{nodeURI ? 'Node URI' : 'Node ID'}</h4>
            <p className='py-3 w-75 text-break text-dark d-flex justify-content-center'>
              {nodeURI ? 'Use this URI to connect to your node. LAN addresses require access to the same network or VPN.' : 'No reachable peer address is configured. Configure an advertised address on your Core Lightning node. A node ID alone is not a connection endpoint.'}
            </p>
            {uris.length > 1 && <Form.Select aria-label="Peer address" value={nodeURI} onChange={event => setNodeURI(event.target.value)}>
              {uris.map(uri => <option key={uri} value={uri}>{uri}</option>)}
            </Form.Select>}
            <div className='mb-4 text-break text-dark d-flex justify-content-center'>
            <InputGroup className='mb-3'>
              <Form.Control
                onClick={copyHandler}
                value={nodeURI || nodeInfo.id || ''}
                aria-label='Node connection address'
                aria-describedby="copy-addon"
                className="form-control-left"
                readOnly
              />
              <InputGroup.Text
                id={nodeURI}
                className="form-control-addon form-control-addon-right"
                onClick={copyHandler}
              >
                <CopySVG id={nodeURI} />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default NodeInfo;
