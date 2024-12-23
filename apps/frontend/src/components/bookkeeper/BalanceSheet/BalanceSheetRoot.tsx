import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import './BalanceSheetRoot.scss';
import 'react-datepicker/dist/react-datepicker.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import BalanceSheetGraph from './Graph/BalanceSheetGraph';
import { AppContext } from '../../../store/AppContext';
import BalanceSheetTable from './Table/BalanceSheetTable';
import useHttp from '../../../hooks/use-http';
import { TimeGranularity } from '../../../utilities/constants';
import { BalanceSheet } from '../../../types/lightning-balancesheet.type';
import TimeGranularitySelection from '../TimeGranularitySelection/TimeGranularitySelection';
import { Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import DatepickerInput from '../DatepickerInput/DatepickerInput';

const BalanceSheetRoot = () => {
  const appCtx = useContext(AppContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheet>({ periods: [] });
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>(TimeGranularity.MONTHLY);
  const [rangeStart, setRangeStart] = useState<Date | undefined>(undefined);
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>(undefined);
  const [hideZeroActivityPeriods, setHideZeroActivityPeriods] = useState<boolean>(true);
  const { getBalanceSheet } = useHttp();

  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  };

  const fetchBalanceSheetData = useCallback(
    async (timeGranularity: TimeGranularity, hideZeroActivityPeriods: Boolean, startDate?: Date, endDate?: Date) => {
      getBalanceSheet(timeGranularity, hideZeroActivityPeriods, startDate, endDate)
        .then((response: BalanceSheet) => {
          setBalanceSheetData(response);
        })
        .catch(err => {
          console.error('fetchBalanceSheet error ' + JSON.stringify(err));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const timeGranularityChangeHandler = timeGranularity => {
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
      fetchBalanceSheetData(timeGranularity, hideZeroActivityPeriods, rangeStart, rangeEnd);
    }
  }, [
    appCtx.authStatus.isAuthenticated,
    timeGranularity,
    rangeStart,
    rangeEnd,
    fetchBalanceSheetData,
    hideZeroActivityPeriods,
  ]);

  return (
    <div data-testid="balancesheet-container" ref={containerRef}>
      <Card className="d-flex align-items-stretch inner-box-shadow">
        <Card.Header className="p-2">
          <Container fluid>
            <Row>
              <div className="fs-4 mt-2 fw-bold">Balance Sheet</div>
            </Row>
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
          </Container>
        </Card.Header>
        <Card.Body className="pb-4 d-flex flex-column align-items-center">
          <Row>
            <BalanceSheetGraph balanceSheetData={balanceSheetData} width={containerWidth} />
          </Row>
          <Row className="w-100 overflow-x-auto">
            <BalanceSheetTable balanceSheetData={balanceSheetData} />
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BalanceSheetRoot;
