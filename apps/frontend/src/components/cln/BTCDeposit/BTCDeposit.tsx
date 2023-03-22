import './BTCDeposit.scss';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

import { CallStatus, CLEAR_STATUS_ALERT_DELAY } from '../../../utilities/constants';
import logger from '../../../services/logger.service';
import useHttp from '../../../hooks/use-http';
import { BitcoinWalletSVG } from '../../../svgs/BitcoinWallet';
import QRCodeComponent from '../../shared/QRCode/QRCode';
import { CloseSVG } from '../../../svgs/Close';
import StatusAlert from '../../shared/StatusAlert/StatusAlert';

const BTCDeposit = (props) => {
  const { btcDeposit } = useHttp();
  const [responseStatus, setResponseStatus] = useState(CallStatus.NONE);
  const [responseMessage, setResponseMessage] = useState('');

  const delayedClearStatusAlert = () => {
    setTimeout(() => {
      setResponseStatus(CallStatus.NONE);
      setResponseMessage('');
    }, CLEAR_STATUS_ALERT_DELAY);
  }

  useEffect(() => {
    setResponseStatus(CallStatus.PENDING);
    setResponseMessage('Generating New Address...');
    btcDeposit()
    .then((response: any) => {
      logger.info(response);
      if (response.data && response.data.bech32) {
        setResponseStatus(CallStatus.SUCCESS);
        setResponseMessage((response.data.bech32));
      } else {
        setResponseStatus(CallStatus.ERROR);
        setResponseMessage(response.response.data || response.message || 'Unknown Error');
        delayedClearStatusAlert();
      }
    })
    .catch(err => {
      logger.error(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
      setResponseStatus(CallStatus.ERROR);
      setResponseMessage(err.response && err.response.data ? err.response.data : err.message ? err.message : JSON.stringify(err));
      delayedClearStatusAlert();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className='h-100 d-flex align-items-stretch'>
      <Card.Body className='d-flex align-items-stretch flex-column pt-4'>
        <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
          <div className='p-0 fw-bold text-primary d-flex align-items-center'>
            <BitcoinWalletSVG svgClassName='svg-small me-2' className='fill-primary' />
            <span className='fw-bold'>Bitcoin Wallet</span>
          </div>
          <span className='span-close-svg' onClick={props.onClose}><CloseSVG /></span>
        </Card.Header>
        <h4 className='text-blue fw-bold mt-2'>Deposit</h4>
        <Card.Body className='py-0 px-1'>
          {responseStatus === CallStatus.SUCCESS ?
            <QRCodeComponent message={responseMessage} toastMessage='Address Copied Successfully!' className='py-0 px-1 d-flex flex-column align-items-center justify-content-start' />
          :
            <StatusAlert responseStatus={responseStatus} responseMessage={responseMessage} />
          }
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default BTCDeposit;
