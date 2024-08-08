import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../store/AppContext";
import { SatsFlow } from "../../../types/lightning-satsflow.type";
import { TimeGranularity } from "../../../utilities/constants";
import useHttp from "../../../hooks/use-http";
import { Card, Container, Row, Col } from "react-bootstrap";
import TimeGranularitySelection from "../TimeGranularitySelection/TimeGranularitySelection";
import SatsFlowGraph from "./SatsFlowGraph/SatsFlowGraph";

const SatsFlowRoot = (props) => {
  const appCtx = useContext(AppContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [satsFlowData, setSatsFlowData] = useState<SatsFlow>({ periods: [] });
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>(TimeGranularity.DAILY);
  const [hideZeroActivityPeriods, setHideZeroActivityPeriods] = useState<boolean>(true);
  const { getSatsFlow } = useHttp();

  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  };

  const fetchSatsFlowData = useCallback(async (timeGranularity: TimeGranularity, hideZeroActivityPeriods: boolean) => {
    getSatsFlow(timeGranularity, hideZeroActivityPeriods)
      .then((response: SatsFlow) => {
        setSatsFlowData(response);
        console.log("satsFlowData: " + JSON.stringify(response));
      })
      .catch(err => {
        console.error("fetchSatsFlow error" + err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeGranularityChangeHandler = (timeGranularity) => {
    setTimeGranularity(timeGranularity);
  };

  const hideZeroActivityPeriodsChangeHandler = (event) => {
    setHideZeroActivityPeriods(event.target.checked);
  };

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (appCtx.authStatus.isAuthenticated) {
      fetchSatsFlowData(timeGranularity, hideZeroActivityPeriods);
    }
  }, [appCtx.authStatus.isAuthenticated, timeGranularity, hideZeroActivityPeriods, fetchSatsFlowData]);

  return (
    <div data-testid='satsflow-container' ref={containerRef}>
      <Card className='d-flex align-items-stretch inner-box-shadow'>
        <Card.Header className='p-2'>
          <Container fluid>
            <Row>
              <Col md={2}>
                <div className='fs-4 p-0 ps-3 mt-2 fw-bold'>
                  Sats Flow
                </div>
              </Col>
              <Col md={3} className='d-flex align-items-center'>
                <TimeGranularitySelection
                  className='time-granularity-dropdown mt-2'
                  timeGranularity={timeGranularity}
                  onTimeGranularityChanged={timeGranularityChangeHandler} />
                <div className='ms-3 me-3 mt-2 d-flex align-items-center'>
                  <input
                    type="checkbox"
                    id="hideZeroActivityCheckbox"
                    name="hideZeroActivity"
                    checked={hideZeroActivityPeriods}
                    onChange={hideZeroActivityPeriodsChangeHandler}
                  />
                  <label htmlFor="hideZeroActivityCheckbox" className='ms-2'>
                    Hide Zero Activity
                  </label>
                </div>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body className='pb-4 d-flex flex-column align-items-center'>
          <Row>
            <SatsFlowGraph satsFlowData={satsFlowData} width={containerWidth} />
          </Row>
          {/* <Row className='w-100 overflow-x-auto'>
            <SatsFlowTable satsFlowData={satsFlowData} />
          </Row> */}
        </Card.Body>
      </Card>
    </div>
  )

};

export default SatsFlowRoot;
