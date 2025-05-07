import './SatsFlowInfo.scss';
import { useNavigate } from 'react-router-dom';
import { Card, Row } from 'react-bootstrap';
import { SatsFlowSVG } from '../../../../svgs/SatsFlow';
import { ActionSVG } from '../../../../svgs/Action';
import { CallStatus, Units } from '../../../../utilities/constants';
import CurrencyBox from '../../../shared/CurrencyBox/CurrencyBox';

import StatusAlert from '../../../shared/StatusAlert/StatusAlert';
import { useSelector } from 'react-redux';
import { selectIsSatsFlowLoading, selectSatsFlowError, selectSummary } from '../../../../store/bkprSelectors';

const SatsFlowInfo = () => {
  const navigate = useNavigate();
  const bkprSummary = useSelector(selectSummary);
  const isSatsFlowLoading = useSelector(selectIsSatsFlowLoading);
  const satsFlowError = useSelector(selectSatsFlowError);

  return (
    <Card className='sats-flow-info inner-box-shadow p-4 pb-3'>
      <Card.Header className='d-flex px-1 fs-18px p-0 fw-bold text-dark'>
        <SatsFlowSVG className='me-3' />
        <Row>
          <span className='fw-bold'>Sats Flow</span>
          <span className='text-muted fs-7'>Track inflows and outflow events over time.</span>
        </Row>
      </Card.Header>
      <Card.Body className='mt-2 p-0'>
        {isSatsFlowLoading ?
          <span className='h-100 d-flex justify-content-center align-items-center text-light fs-6 delayed-load'>
            No inbound/outboud satsflow yet. Forward transactions to see details!
          </span>
          :
          satsFlowError ?
            <StatusAlert responseStatus={CallStatus.ERROR} responseMessage={satsFlowError.replace('Satsflow: ', '')} />
            :
            <div className='d-flex flex-row justify-content-between '>
              <div className='d-flex flex-column align-items-start p-2'>
                <span className='fs-6 text-dark'>Inflow this month</span>
                <span className='fs-3 fw-bold positive'>
                  <CurrencyBox value={bkprSummary.inflows_for_period_msat} shorten={false} hideUnit={true} fromUnit={Units.MSATS} rootClasses='d-inline-flex flex-column' currencyClasses='fs-3 fw-bold positive'></CurrencyBox>
                </span>
              </div>
              <div className='d-flex flex-column align-items-start p-2'>
                <span className='fs-6 text-dark'>Outflow this month</span>
                <span className='fs-3 fw-bold negative'>
                  <CurrencyBox value={bkprSummary.outflows_for_period_msat} shorten={false} hideUnit={true} fromUnit={Units.MSATS} rootClasses='d-inline-flex flex-column' currencyClasses='fs-3 fw-bold negative'></CurrencyBox>
                </span>
              </div>
            </div>
        }
      </Card.Body>
      <Card.Footer className='d-flex justify-content-end'>
        <button
          tabIndex={1}
          type='button'
          disabled
          className='btn-rounded bg-primary fs-6 me-3'
          onClick={() => navigate('./satsflow')}
        >
          View More
          <ActionSVG className='ms-3' />
        </button>
      </Card.Footer>
    </Card>

  );
};

export default SatsFlowInfo;
