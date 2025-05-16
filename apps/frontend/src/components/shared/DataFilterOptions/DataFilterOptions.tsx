import moment from 'moment';
import './DataFilterOptions.scss';
import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { Row, Col, Dropdown, InputGroup, Form } from 'react-bootstrap';
import { getTimestampWithGranularity, TimeGranularity } from '../../../utilities/constants';
import CLNDatePicker from '../DatepickerInput/DatepickerInput';
import { ChevronDown } from '../../../svgs/ChevronDown';
import { BookkeeperService } from '../../../services/http.service';
import logger from '../../../services/logger.service';
import { setAccountEvents, setSatsFlow } from '../../../store/bkprSlice';
import { useDispatch, useSelector } from 'react-redux';
import { appStore } from '../../../store/appStore';
import { selectIsAuthenticated } from '../../../store/rootSelectors';
import { AppState } from '../../../store/store.type';

const DataFilterOptions = (props: {filter: string, onShowZeroActivityChange: (show: boolean) => void}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentDate = new Date();
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>(TimeGranularity.DAILY);
  const [rangeStart, setRangeStart] = useState<Date>(moment(currentDate).subtract(1, 'month').add(1, 'day').toDate());
  const [rangeEnd, setRangeEnd] = useState<Date>(currentDate);
  const [showZeroActivityPeriods, setShowZeroActivityPeriods] = useState<boolean>(false);

  const transformDataRange = useCallback(
    async (
      timeGranularity: TimeGranularity,
      startDate: Date,
      endDate: Date,
    ) => {
      try {
        const startTimestamp = getTimestampWithGranularity(timeGranularity, startDate, 'start');
        const endTimestamp = getTimestampWithGranularity(timeGranularity, endDate, 'end');
        const state = appStore.getState() as AppState;
        const accountEvents = state.bkpr?.accountEvents ?? { isLoading: true, timeGranularity: TimeGranularity.DAILY, startTimestamp: 0, endTimestamp: 0, events: [], periods: [], error: null };
        if (props.filter === 'accountevents' && accountEvents.events.length > 0) {
          dispatch(setAccountEvents({accountEvents, timeGranularity, startTimestamp, endTimestamp}));
        }
        if (props.filter === 'satsflow') {
          const satsFlow = await BookkeeperService.getSatsFlow(startTimestamp, endTimestamp);
          dispatch(setSatsFlow({satsFlow, timeGranularity, startTimestamp, endTimestamp}));
        }
      } catch (err) {
        logger.error(`Error filtering ${props.filter} data: ${err}`);
      }
    },
    [props.filter, dispatch]
  );
  
  useEffect(() => {
    if (isAuthenticated) {
      transformDataRange(timeGranularity, rangeStart, rangeEnd);
    }
  }, [isAuthenticated, transformDataRange, timeGranularity, rangeStart, rangeEnd]);

  const onTimeGranularityChanged = (eventKey: string | null) => {
    if (eventKey !== null) {
      setTimeGranularity(eventKey as TimeGranularity);
      if (eventKey === TimeGranularity.MINUTELY || eventKey === TimeGranularity.HOURLY) {
        setShowZeroActivityPeriods(false);
        props.onShowZeroActivityChange(false);
      }
    }
  };

  const showZeroActivityPeriodsChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setShowZeroActivityPeriods(event.target.checked);
    props.onShowZeroActivityChange(event.target.checked);
  };

  return (
    <Row className="ps-1 d-flex align-items-center justify-content-start">
      <Col xs="auto" className='px-2'>
        <h6 className='pt-2'>Time Granularity</h6>
      </Col>
      <Col xs={12} md="auto" className='px-2'>
        <InputGroup className='time-granularity-group' data-testid='time-granularity-group'>
          <Dropdown
            tabIndex={1}
            onSelect={onTimeGranularityChanged}            
          >
            <Dropdown.Toggle as='div' className='d-flex' data-testid="time-granularity-selection">
              <span data-testid='selected-time-granularity' className='form-control form-control-left pe-2'>{timeGranularity}</span>
              <InputGroup.Text
                className='form-control-addon form-control-addon-right'
              >
                <ChevronDown width={12} height={7} />
              </InputGroup.Text>
            </Dropdown.Toggle>
            <Dropdown.Menu data-testid='time-granularity-menu'>
              {Object.values(TimeGranularity).map((timeGran, i) => (
                <Dropdown.Item data-testid={'time-granularity-' + timeGran} eventKey={timeGran} key={i}>{timeGran}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>
      </Col>
      <Col xs="auto" className='px-2'>
        <CLNDatePicker
          tabIndex={2}
          data-testid='start-range-datepicker'
          id='start-range-datepicker'
          placeholderText='Start'
          selectedDate={rangeStart}
          onChangeDate={date => setRangeStart(date)}
        />
      </Col>
      <Col xs="auto" className='px-2'>
        <CLNDatePicker
          tabIndex={3}
          id='end-range-datepicker'
          placeholderText='End'
          maxDate={currentDate}
          selectedDate={rangeEnd}
          onChangeDate={date => setRangeEnd(date)}
        />
      </Col>
      <Col xs="auto" className='px-2'>
        <Form.Check
          tabIndex={4}
          onChange={showZeroActivityPeriodsChangeHandler}
          checked={showZeroActivityPeriods}
          disabled={timeGranularity === TimeGranularity.MINUTELY || timeGranularity === TimeGranularity.HOURLY}
          inline
          className="mt-2 fs-base fw-light"
          label="Show Zero Activity"
          name="showZeroActivity"
          type="checkbox"
          id="showZeroActivityCheckbox"
          data-testid='show-zero-activity'
        />
      </Col>
    </Row>
  );
};

export default DataFilterOptions;
