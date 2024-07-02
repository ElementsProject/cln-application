import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import './BalanceSheetRoot.scss';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import BalanceSheetGraph from './Graph/BalanceSheetGraph';
import { AppContext } from '../../../store/AppContext';
import BalanceSheetTable from './Table/BalanceSheetTable';
import useHttp from '../../../hooks/use-http';
import { TimeGranularity } from '../../../utilities/constants';
import { BalanceSheet } from '../../../types/lightning-bookkeeper.type';
import TimeGranularitySelection from '../TimeGranularitySelection/TimeGranularitySelection';
import { Col, Container } from 'react-bootstrap';

const BalanceSheetRoot = (props) => {
  const appCtx = useContext(AppContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheet>({ isLoading: true, periods: [] }); //todo deal with loading
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>(TimeGranularity.DAILY);
  const { getBalanceSheet } = useHttp();

  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  };

  const fetchBalanceSheetData = useCallback(async (timeGranularity: TimeGranularity) => {
    getBalanceSheet(timeGranularity)
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
      fetchBalanceSheetData(timeGranularity);
    }
  }, [appCtx.authStatus.isAuthenticated, timeGranularity, fetchBalanceSheetData]);

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
