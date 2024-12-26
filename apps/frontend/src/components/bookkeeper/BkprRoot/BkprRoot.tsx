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
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useHttp from '../../../hooks/use-http';
import { AppContext } from '../../../store/AppContext';
import { BookkeeperLandingData } from '../../../types/lightning-bookkeeper-landing.type';
import { BALANCE_FORMAT } from '../../../utilities/constants';
import { format } from 'd3';

const Bookkeeper = () => {
  const appCtx = useContext(AppContext);
  const navigate = useNavigate();
  const [bookkeeperLandingData, setBookkeeperLandingData] = useState<BookkeeperLandingData>();
  const { getBookkeeperLanding } = useHttp();
  const formatBalance = useMemo(() => format(BALANCE_FORMAT), []);

  const fetchBookkeeperLandingData = useCallback(
    async () => {
    getBookkeeperLanding()
      .then((response: BookkeeperLandingData) => {
        setBookkeeperLandingData(response);
      })
      .catch(err => {
        console.error("fetchBookkeeperLandingData error" + err);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (appCtx.authStatus.isAuthenticated) {
      fetchBookkeeperLandingData();
    }
  }, [appCtx.authStatus.isAuthenticated, fetchBookkeeperLandingData]);

  return (
    <div data-testid="bookkeeper-container">
      <div className="fs-4 p-0 ps-3 d-flex fw-bold text-dark">
        Bookkeeper Dashboard
        <button
          tabIndex={0}
          type="submit"
          className="btn-rounded bg-primary fs-6 ms-3"
          onClick={() => navigate('/bookkeeper/terminal')}
        >
          Terminal
        </button>
      </div>
      <Container fluid className="">
        <Row className="">
          <Col lg={5} md={12} xs={12} className="">
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
                      <span className="fs-1 fw-bold text-primary">
                        {bookkeeperLandingData?.balanceSheetSummary.numberOfChannels}
                      </span>
                      <span className="fs-6 text-dark">Total Number of Channels</span>
                    </div>
                    <div className="mt-3 d-flex flex-column align-items-start">
                      <span className="fs-1 fw-bold text-primary">
                        {formatBalance(
                          bookkeeperLandingData?.balanceSheetSummary.balanceInChannels || 0,
                        )}
                      </span>
                      <span className="fs-6 text-dark">Total Balance in Channels</span>
                    </div>
                    <div className="mt-3 d-flex flex-column align-items-start">
                      <span className="fs-1 fw-bold text-primary">
                        {formatBalance(
                          bookkeeperLandingData?.balanceSheetSummary.balanceInWallet || 0,
                        )}
                      </span>
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
          <Col lg={6} md={12} xs={12} className="ms-lg-4 ms-xs-0 px-4 mt-4 d-flex flex-column">
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
                        <Col lg={12} xl={6} className="d-flex flex-column align-items-start">
                          <SatsFlowInfo
                            label={'Inflow this month'}
                            value={bookkeeperLandingData?.satsFlowSummary.inflows || 0}
                          />
                        </Col>
                        <Col lg={12} xl={6} className="d-flex flex-column align-items-start">
                          <SatsFlowInfo
                            label={'Outflow this month'}
                            value={-(bookkeeperLandingData?.satsFlowSummary.outflows || 0)}
                          />
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
                      Track route performance.
                      <VolumeInfo
                        bestRoute={bookkeeperLandingData?.volumeSummary.mostTrafficRoute}
                        worstRoute={bookkeeperLandingData?.volumeSummary.leastTrafficRoute}
                      />
                    </Card.Body>
                    <Card.Footer className="mt-3 mb-3 d-flex justify-content-end">
                      <button
                        tabIndex={1}
                        type="submit"
                        className="btn-rounded bg-primary"
                        onClick={() => navigate('/bookkeeper/volume')}
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
};

export default Bookkeeper;
