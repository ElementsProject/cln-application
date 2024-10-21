import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

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
import { Col, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

const BalanceSheetRoot = (props) => {
  const appCtx = useContext(AppContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheet>({ periods: [] }); //todo deal with loading
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>(TimeGranularity.MONTHLY);
  const [rangeStart, setRangeStart] = useState<Date|undefined>(undefined);
  const [rangeEnd, setRangeEnd] = useState<Date|undefined>(undefined);
  const { getBalanceSheet } = useHttp();

  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  };

  const fetchBalanceSheetData = useCallback(async (timeGranularity: TimeGranularity, startDate?: Date, endDate?: Date) => {
    let startTimestamp = 1
    let endTimestamp = Math.floor(new Date().getTime());

    if (startDate != null) {
      startTimestamp = Math.floor(startDate.getTime() / 1000);
    }
    if (endDate != null) {
      endTimestamp = Math.floor(endDate.getTime() / 1000);
    }

    getBalanceSheet(timeGranularity, startTimestamp, endTimestamp)
      .then((response: BalanceSheet) => {
        setBalanceSheetData(response);
      })
      .catch(err => {
        console.error("fetchBalanceSheet error " + JSON.stringify(err));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeGranularityChangeHandler = (timeGranularity) => {
    setTimeGranularity(timeGranularity);
  };

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (appCtx.authStatus.isAuthenticated) {
      fetchBalanceSheetData(timeGranularity, rangeStart, rangeEnd);
    }
  }, [appCtx.authStatus.isAuthenticated, timeGranularity, rangeStart, rangeEnd, fetchBalanceSheetData]);

  return (
    <div data-testid='balancesheet-container' ref={containerRef}>
      <Card className='d-flex align-items-stretch inner-box-shadow'>
        <Card.Header className='p-2'>
          <Container fluid>
            <Row>
              <Col md={2}>
                <div className='fs-4 p-0 ps-3 mt-2 fw-bold'>
                  Balance Sheet
                </div>
              </Col>
              <Col md={3} className='d-flex align-items-center'>
                <div className='ms-3 me-3 mt-2'>
                  Time Granularity
                </div>
                <TimeGranularitySelection
                  className='time-granularity-dropdown mt-2'
                  timeGranularity={timeGranularity}
                  onTimeGranularityChanged={timeGranularityChangeHandler} />
              </Col>
              <Col md={3} className='d-flex align-items-center'>
                <DatePicker className='outline border-gray-300 datepicker' selected={rangeStart} onChange={(date) => setRangeStart(date ?? undefined)} placeholderText='Starts' style={{borderRadius: '80px'}}/>
              </Col>
              <Col md={3} className='d-flex align-items-center'>
                <DatePicker className='outline border-gray-300 datepicker' selected={rangeEnd} onChange={(date) => setRangeEnd(date ?? undefined)} placeholderText='Ends' />
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body className='pb-4 d-flex flex-column align-items-center'>
          <Row>
            <BalanceSheetGraph balanceSheetData={balanceSheetData} width={containerWidth} />
          </Row>
          <Row className='w-100 overflow-x-auto'>
            <BalanceSheetTable balanceSheetData={balanceSheetData} />
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BalanceSheetRoot;
