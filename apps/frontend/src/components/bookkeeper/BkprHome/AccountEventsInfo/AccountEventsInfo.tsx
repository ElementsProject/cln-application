import './AccountEventsInfo.scss';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Spinner } from 'react-bootstrap';
import { ActionSVG } from '../../../../svgs/Action';
import { AccountEventsSVG } from '../../../../svgs/AccountEvents';
import { CallStatus, Units } from '../../../../utilities/constants';
import CurrencyBox from '../../../shared/CurrencyBox/CurrencyBox';
import StatusAlert from '../../../shared/StatusAlert/StatusAlert';
import { useSelector } from 'react-redux';
import { selectIsSatsFlowLoading, selectSatsFlowError, selectSummary } from '../../../../store/bkprSelectors';

const AccountEventsInfo = () => {
  const navigate = useNavigate();
  const bkprSummary = useSelector(selectSummary);
  const satsFlowLoading = useSelector(selectIsSatsFlowLoading);
  const satsFlowError = useSelector(selectSatsFlowError);

  return (
    <Card className='h-100 inner-box-shadow px-4 pt-4 pb-3'>
      <Card.Header className='d-flex px-1 fs-18px p-0 fw-bold text-dark'>
        <AccountEventsSVG className='me-3' />
        <Row>
          <span className='fw-bold'>Account Events</span>
          <span className='text-muted fs-7'>Track account activity at any given time.</span>
        </Row>
      </Card.Header>
      <Card.Body className='mt-2 p-0'>
        {satsFlowLoading ?
          <span className='h-100 d-flex justify-content-center align-items-center'>
            <Spinner animation='grow' variant='primary' />
          </span>
          :
          satsFlowError ?
            <StatusAlert responseStatus={CallStatus.ERROR} responseMessage={satsFlowError.replace('Satsflow: ', '')} />
            :
            bkprSummary.total_invoice_received_msat === 0 && bkprSummary.total_payments_sent_msat === 0 && 
            bkprSummary.routing_revenue_msat === 0 && bkprSummary.onchain_fee_msat === 0 ?
              <Row className='text-light fs-6 h-75 mt-2 align-items-center justify-content-center'>
                <Row className='d-flex align-items-center justify-content-center text-center'>
                  No account activity found.<br />Send/Receive payments to see details!
                </Row>
              </Row>
            :
              <>
                <div className='d-flex flex-column align-items-stretch justify-content-between'>
                  <div className='d-flex flex-column align-items-start p-2'>
                    <span className='fs-6 text-dark'>Total Invoice Received</span>
                    <span className='fs-2 fw-bold primary'>+<CurrencyBox value={bkprSummary.total_invoice_received_msat} shorten={false} hideUnit={true} fromUnit={Units.MSATS} rootClasses='d-inline-flex flex-column' currencyClasses='fs-2 fw-bold primary'></CurrencyBox></span>
                  </div>
                  <div className='d-flex flex-column align-items-start p-2'>
                    <span className='fs-6 text-dark'>Total Payments Sent</span>
                    <span className='fs-2 fw-bold primary'>-<CurrencyBox value={bkprSummary.total_payments_sent_msat} shorten={false} hideUnit={true} fromUnit={Units.MSATS} rootClasses='d-inline-flex flex-column' currencyClasses='fs-2 fw-bold primary'></CurrencyBox></span>
                  </div>
                </div>
                <div className='d-flex flex-column align-items-stretch justify-content-between'>
                  <div className='d-flex flex-column align-items-start p-2'>
                    <span className='fs-6 text-dark'>Routing Revenue</span>
                    <span className='fs-2 fw-bold primary'>+<CurrencyBox value={bkprSummary.routing_revenue_msat} shorten={false} hideUnit={true} fromUnit={Units.MSATS} rootClasses='d-inline-flex flex-column' currencyClasses='fs-2 fw-bold primary'></CurrencyBox></span>
                  </div>
                  <div className='d-flex flex-column align-items-start p-2'>
                    <span className='fs-6 text-dark'>On-Chain Fee</span>
                    <span className='fs-2 fw-bold primary'>-<CurrencyBox value={bkprSummary.onchain_fee_msat} shorten={false} hideUnit={true} fromUnit={Units.MSATS} rootClasses='d-inline-flex flex-column' currencyClasses='fs-2 fw-bold primary'></CurrencyBox></span>
                  </div>
                </div>
              </>
        }
      </Card.Body>
      <Card.Footer className='d-flex justify-content-end px-2'>
        <button
          tabIndex={1}
          type='button'
          disabled={satsFlowLoading || !!satsFlowError}
          className='btn-rounded bg-primary fs-6'
          onClick={() => navigate('./accountevents')}
        >
          View More
          <ActionSVG className='ms-3' />
        </button>
      </Card.Footer>
    </Card>
  );
};

export default AccountEventsInfo;
