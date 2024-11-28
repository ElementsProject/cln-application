import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../store/AppContext";
import { SatsFlow } from "../../../types/lightning-satsflow.type";
import { TimeGranularity } from "../../../utilities/constants";
import useHttp from "../../../hooks/use-http";
import { Card, Container, Row } from "react-bootstrap";
import TimeGranularitySelection from "../TimeGranularitySelection/TimeGranularitySelection";
import SatsFlowGraph from "./SatsFlowGraph/SatsFlowGraph";
import DatePicker from 'react-datepicker';
import DatepickerInput from '../DatepickerInput/DatepickerInput';

const SatsFlowRoot = (props) => {
  const appCtx = useContext(AppContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [satsFlowData, setSatsFlowData] = useState<SatsFlow>({ periods: [] });
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>(TimeGranularity.DAILY);
  const [rangeStart, setRangeStart] = useState<Date | undefined>(undefined);
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>(undefined);
  const [hideZeroActivityPeriods, setHideZeroActivityPeriods] = useState<boolean>(true);
  const { getSatsFlow } = useHttp();

  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  };

  const fetchSatsFlowData = useCallback(async (timeGranularity: TimeGranularity, hideZeroActivityPeriods: boolean, startDate?: Date, endDate?: Date) => {
    let startTimestamp = 1;
    let endTimestamp = Math.floor(new Date().getTime());

    if (startDate != null) {
      startTimestamp = Math.floor(startDate.getTime() / 1000);
    }
    if (endDate != null) {
      endTimestamp = Math.floor(endDate.getTime() / 1000);
    }

    getSatsFlow(timeGranularity, hideZeroActivityPeriods, startTimestamp, endTimestamp)
      .then((response: SatsFlow) => {
        setSatsFlowData(response);
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
      fetchSatsFlowData(timeGranularity, hideZeroActivityPeriods, rangeStart, rangeEnd);
    }
  }, [
    appCtx.authStatus.isAuthenticated,
    timeGranularity,
    rangeStart,
    rangeEnd,
    hideZeroActivityPeriods,
    fetchSatsFlowData,
  ]);

  return (
    <div data-testid="satsflow-container" ref={containerRef}>
      <Card className="d-flex align-items-stretch inner-box-shadow">
        <Card.Header className="p-2">
          <Container fluid>
            <Row>
              <div className="fs-4 mt-2 fw-bold">Sats Flow</div>
              <div className="d-flex align-items-center mt-2 gap-4">
                <div className="fw-bold">Time Granularity</div>
                <TimeGranularitySelection
                  className="time-granularity-dropdown"
                  timeGranularity={timeGranularity}
                  onTimeGranularityChanged={timeGranularityChangeHandler}
                />
                <DatePicker
                  customInput={<DatepickerInput />}
                  selected={rangeStart}
                  onChange={date => setRangeStart(date ?? undefined)}
                  placeholderText="Starts"
                />
                <DatePicker
                  customInput={<DatepickerInput />}
                  selected={rangeEnd}
                  onChange={date => setRangeEnd(date ?? undefined)}
                  placeholderText="Ends"
                />
                <div className="ms-3 me-3 mt-2 d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="hideZeroActivityCheckbox"
                    name="hideZeroActivity"
                    checked={hideZeroActivityPeriods}
                    onChange={hideZeroActivityPeriodsChangeHandler}
                  />
                  <label htmlFor="hideZeroActivityCheckbox" className="ms-2">
                    Hide Zero Activity
                  </label>
                </div>
              </div>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body className="pb-4 d-flex flex-column align-items-center">
          <Row>
            <SatsFlowGraph satsFlowData={satsFlowData} width={containerWidth} />
          </Row>
          {/* <Row className='w-100 overflow-x-auto'>
            <SatsFlowTable satsFlowData={satsFlowData} />
          </Row> */}
        </Card.Body>
      </Card>
    </div>
  );

};

export default SatsFlowRoot;
