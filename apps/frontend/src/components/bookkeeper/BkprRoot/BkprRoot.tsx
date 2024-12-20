import './BkprRoot.scss';
import { ActionSVG } from '../../../svgs/Action';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { BalanceSheetSVG } from '../../../svgs/BalanceSheet';
import { SatsFlowSVG } from '../../../svgs/SatsFlow';
import { VolumeChartSVG } from '../../../svgs/VolumeChart';
import SatsFlowInfo from './SatsFlowInfo';
import VolumeInfo from './VolumeInfo';

function Bookkeeper() {
  const navigate = useNavigate();
  return (
    <div data-testid="bookkeeper-container">
      <div className="fs-4 p-0 ps-3 fw-bold text-dark">Bookkeeper Dashboard</div>
      <Container fluid className="">
        <Row className="">
          <Col md={5} xs={12} className="">
            <Card className="mt-4 pt-4 px-4 inner-box-shadow">
              <div className="d-flex align-items-start">
                <BalanceSheetSVG className="me-3" />

                <div className="flex-grow-1">
                  <Card.Header className="d-flex align-items-start fs-18px p-0 fw-bold text-dark">
                    Balance Sheet
                  </Card.Header>

                  <Card.Body className="px-0 pt-0">
                    Track channel and wallet balances over time.
                    <div className="mt-5 d-flex flex-column align-items-start">
                      <span className="fs-1 fw-bold text-primary">4</span>
                      <span className="fs-6 text-dark">Total Number of Channels</span>
                    </div>
                    <div className="mt-3 d-flex flex-column align-items-start">
                      <span className="fs-1 fw-bold text-primary">4,000,000</span>
                      <span className="fs-6 text-dark">Total Balance in Channels</span>
                    </div>
                    <div className="mt-3 d-flex flex-column align-items-start">
                      <span className="fs-1 fw-bold text-primary">4</span>
                      <span className="fs-6 text-dark">Total Balance in Wallet</span>
                    </div>
                  </Card.Body>
                  <Card.Footer className="mt-5 mb-3 d-flex justify-content-end">
                    <button
                      tabIndex={1}
                      type="submit"
                      className="btn-rounded bg-primary"
                      onClick={() => navigate('/bookkeeper/balancesheet')}
                    >
                      View More
                      <ActionSVG className="ms-3" />
                    </button>
                  </Card.Footer>
                </div>
              </div>
            </Card>
          </Col>
          <Col md={6} xs={12} className="ms-md-4 ms-xs-0 px-4 mt-4 d-flex flex-column">
            <Row>
              <Card className="pt-4 px-4 inner-box-shadow">
                <div className="d-flex align-items-start">
                  <SatsFlowSVG className="me-3" />

                  <div className="flex-grow-1">
                    <Card.Header className="d-flex align-items-start fs-18px p-0 fw-bold text-dark">
                      Sats Flow
                    </Card.Header>

                    <Card.Body className="px-0 pt-0">
                      Track inflows and outflow events over time.
                      <Row className="g-3 flex-wrap">
                        <Col xs={12} md={12} lg={12} xl={6} className="d-flex flex-column align-items-start">
                          <SatsFlowInfo label={'Inflow this month'} value={-90000000000} />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={6} className="d-flex flex-column align-items-start">
                          <SatsFlowInfo label={'Outflow this month'} value={4000000000} />
                        </Col>
                      </Row>
                    </Card.Body>
                    <Card.Footer className="mb-3 d-flex justify-content-end">
                      <button
                        tabIndex={1}
                        type="submit"
                        className="btn-rounded bg-primary"
                        onClick={() => navigate('/bookkeeper/satsflow')}
                      >
                        View More
                        <ActionSVG className="ms-3" />
                      </button>
                    </Card.Footer>
                  </div>
                </div>
              </Card>
            </Row>
            <Row>
              <Card className="mt-4 pt-4 px-4 inner-box-shadow">
                <div className="d-flex align-items-start">
                  <VolumeChartSVG className="me-3" />

                  <div className="flex-grow-1">
                    <Card.Header className="d-flex align-items-start fs-18px p-0 fw-bold text-dark">
                      Volume Chart
                    </Card.Header>

                    <Card.Body className="px-0 pt-0">
                      Track channel routing performance.
                      <VolumeInfo
                        bestRoutingChannel={
                          '41b2aeea3791fcd38d9d1e0183075868808fad06092b3224e91b8b16a4ec3a6b'
                        }
                        worstRoutingChannel={
                          '41b2aeea3791fcd38d9d1e0183075868808fad06092b3224e91b8b16a4ec3a6b'
                        }
                      />
                    </Card.Body>
                    <Card.Footer className="mt-3 mb-3 d-flex justify-content-end">
                      <button
                        tabIndex={1}
                        type="submit"
                        className="btn-rounded bg-primary"
                        onClick={() => navigate('/bookkeeper/satsflow')}
                      >
                        View More
                        <ActionSVG className="ms-3" />
                      </button>
                    </Card.Footer>
                  </div>
                </div>
              </Card>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Bookkeeper;
