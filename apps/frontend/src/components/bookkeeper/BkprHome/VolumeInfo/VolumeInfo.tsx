import './VolumeInfo.scss';
import { useNavigate } from 'react-router-dom';
import { Card, Col, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { ActionSVG } from '../../../../svgs/Action';
import { VolumeChartSVG } from '../../../../svgs/VolumeChart';
import { formatCurrency } from '../../../../utilities/data-formatters';
import { CallStatus, Units } from '../../../../utilities/constants';

import StatusAlert from '../../../shared/StatusAlert/StatusAlert';
import { useSelector } from 'react-redux';
import { selectIsVolumeLoading, selectSummary, selectVolumeError } from '../../../../store/bkprSelectors';
import { selectUIConfigUnit } from '../../../../store/rootSelectors';

const SummaryRouteTooltip = ({ route, unit }: any) => {
  return (
    <Tooltip>
      <Row className='p-1'>
        <Col xs={12}>Aliases: {route?.channel_aliases}</Col>
        <Col xs={12}>Fee Collected: {formatCurrency(route?.fee_msat, Units.MSATS, unit, false, 5, 'string')}</Col>
      </Row>
    </Tooltip>
  );
};

const VolumeInfo = () => {
  const navigate = useNavigate();
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const bkprSummary = useSelector(selectSummary);
  const volumeLoading = useSelector(selectIsVolumeLoading);
  const volumeError = useSelector(selectVolumeError);

  return (
    <Card className='volume-info inner-box-shadow p-4 pb-3'>
      <Card.Header className='d-flex px-1 fs-18px p-0 fw-bold text-dark'>
        <VolumeChartSVG className='me-3' />
        <Row>
          <span className='fw-bold'>Volume Chart</span>
          <span className='text-muted fs-7'>Track route performance.</span>
        </Row>
      </Card.Header>
      <Card.Body className='mt-2 p-0'>
        {volumeLoading ?
          <span className='h-100 d-flex justify-content-center align-items-center'>
            <Spinner animation='grow' variant='primary' />
          </span>
          :
          volumeError ?
            <StatusAlert responseStatus={CallStatus.ERROR} responseMessage={volumeError.replace('Volume: ', '')} />
            :
            bkprSummary.most_traffic_route?.channel_scids === '' && bkprSummary.least_traffic_route?.channel_scids === '' ?
              <Row className='text-light fs-6 h-75 mt-2 align-items-center justify-content-center'>
                <Row className='d-flex align-items-center justify-content-center text-center'>
                  No forwarding activity found.<br />Forward transactions to see details!
                </Row>
              </Row>
            :
            <>
              <div className='d-flex flex-column align-items-start p-2 pb-0 h-50'>
                <span className='fs-6 text-dark'>Route with Most Traffic</span>
                <OverlayTrigger
                  placement='auto'
                  delay={{ show: 250, hide: 250 }}
                  overlay={SummaryRouteTooltip({ route: bkprSummary.most_traffic_route, unit: uiConfigUnit })}
                >
                  <span className='fs-4 fw-bold positive'>{bkprSummary.most_traffic_route?.channel_scids}</span>
                </OverlayTrigger>
              </div>
              <div className='d-flex flex-column align-items-start p-2 pt-0 h-50'>
                <span className='fs-6 text-dark'>Route with Least Traffic</span>
                <OverlayTrigger
                  placement='auto'
                  delay={{ show: 250, hide: 250 }}
                  overlay={SummaryRouteTooltip({ route: bkprSummary.least_traffic_route, unit: uiConfigUnit })}
                >
                  <span className='fs-4 fw-bold negative'>{bkprSummary.least_traffic_route?.channel_scids}</span>
                </OverlayTrigger>
              </div>
            </>
        }
      </Card.Body>
      <Card.Footer className='d-flex justify-content-end px-2'>
        <button
          tabIndex={1}
          type='button'
          disabled={volumeLoading || !!volumeError}
          className='btn-rounded bg-primary fs-6'
          onClick={() => navigate('./volume')}
        >
          View More
          <ActionSVG className='ms-3' />
        </button>
      </Card.Footer>
    </Card>
  );
};

export default VolumeInfo;
