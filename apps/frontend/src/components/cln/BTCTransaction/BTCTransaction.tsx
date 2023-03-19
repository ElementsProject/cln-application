import './BTCTransaction.scss';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { AppContext } from '../../../store/AppContext';
import { CopySVG } from '../../../svgs/Copy';
import { TRANSITION_DURATION } from '../../../utilities/constants';
import { OpenLinkSVG } from '../../../svgs/OpenLink';

const TransactionDetail = ({transaction, copyHandler, openLinkHandler}) => {
  return (
    <>
    {transaction.blockheight ?
      <Row className='btc-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Blockheight</Col>
        <Col xs={12} className='fs-7 overflow-x-ellipsis'>{transaction.blockheight}</Col>
      </Row>
      :
      <></>
    }
    {(transaction.description) ?
      <Row className='btc-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Description</Col>
        <Col xs={12} className='pe-1 fs-7 overflow-x-ellipsis'>{transaction.description}</Col>
      </Row>
    :
      <></>
    }
    {transaction.txid ?
      <Row className='btc-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Transaction ID</Col>
        <Col xs={10} className='pe-1 fs-7 overflow-x-ellipsis'>{transaction.txid}</Col>
        <Col xs={1} onClick={copyHandler} className='btc-transaction-copy'><CopySVG id='Transaction ID' showTooltip={true} /></Col>
        <Col xs={1} onClick={openLinkHandler} className='btc-transaction-open'><OpenLinkSVG id={transaction.txid} /></Col>
      </Row>
    :
      <></>
    }
    {transaction.payment_id ?
      <Row className='btc-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Payment ID</Col>
        <Col xs={10} className='pe-1 fs-7 overflow-x-ellipsis'>{transaction.payment_id}</Col>
        <Col xs={1} onClick={copyHandler} className='btc-transaction-copy'><CopySVG id='Payment ID' showTooltip={true} /></Col>
        <Col xs={1} onClick={openLinkHandler} className='btc-transaction-open'><OpenLinkSVG id={transaction.payment_id} /></Col>
      </Row>
    :
      <></>
    }
    {transaction.outpoint ?
      <Row className='btc-transaction-detail'>
        <Col xs={12} className='fs-7 text-light'>Outpoint</Col>
        <Col xs={10} className='pe-1 fs-7 overflow-x-ellipsis'>{transaction.outpoint}</Col>
        <Col xs={1} onClick={copyHandler} className='btc-transaction-copy'><CopySVG id='Outpoint' showTooltip={true} /></Col>
        <Col xs={1} onClick={openLinkHandler} className='btc-transaction-open'><OpenLinkSVG id={transaction.outpoint ? (transaction.outpoint).split(':')[0] : ''} /></Col>
      </Row>
    :
      <></>
    }
    </>
  )
};

const BTCTransaction = (props) => {
  const appCtx = useContext(AppContext);
  
  const openLinkHandler = (event) => {
    window.open('https://blockstream.info/' + (appCtx.nodeInfo.network === 'testnet' ? 'testnet/' : '') + 'tx/' + event.target.id, '_blank');
  };

  const copyHandler = (event) => {
    switch (event.target.id) {
      case 'Outpoint':
        navigator.clipboard.writeText(props.transaction.outpoint || '');
        break;
      case 'Transaction ID':
        navigator.clipboard.writeText(props.transaction.txid || '');
        break;
      case 'Payment ID':
        navigator.clipboard.writeText(props.transaction.payment_id || '');
        break;
      default:
        navigator.clipboard.writeText(props.transaction.payment_id || '');
        break;
    }
    appCtx.setShowToast({show: true, message: (event.target.id + ' Copied Successfully!'), bg: 'success'});
  }

  return (
    <motion.div
        variants={{ collapsed: { scale: 0.8, opacity: 0 }, open: { scale: 1, opacity: 1 } }}
        transition={{ duration: TRANSITION_DURATION }}
        className='btc-transaction-placeholder pb-2'
      >
      <TransactionDetail transaction={props.transaction} copyHandler={copyHandler} openLinkHandler={openLinkHandler} />
    </motion.div>
  );
};

export default BTCTransaction;
