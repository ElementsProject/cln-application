import './SatsFlowInfo.scss';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Spinner } from 'react-bootstrap';
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
  const satsFlowLoading = useSelector(selectIsSatsFlowLoading);
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
        {satsFlowLoading ?
          <span className='h-100 d-flex justify-content-center align-items-center'>
            <Spinner animation='grow' variant='primary' />
          </span>
          :
          satsFlowError ?
            <StatusAlert responseStatus={CallStatus.ERROR} responseMessage={satsFlowError.replace('Satsflow: ', '')} />
            :
            bkprSummary.inflows_for_period_msat === 0 && bkprSummary.outflows_for_period_msat === 0 ?
              <Row className='text-light fs-6 h-75 mt-2 align-items-center justify-content-center'>
                <Row className='d-flex align-items-center justify-content-center text-center'>
                  No inbound/outbound satsflow yet.<br />Forward transactions to see details!
                </Row>
              </Row>
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
      <Card.Footer className='d-flex justify-content-end px-2'>
        <button
          tabIndex={1}
          type='button'
          disabled={satsFlowLoading || !!satsFlowError}
          className='btn-rounded bg-primary fs-6'
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
