import React, { useContext, useEffect, useState } from 'react';

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
  const appCtx = useContext(AppContext); //todo use for units and stuff?  or get units from higher up the chain.
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheet>({ isLoading: true, periods: [] }); //todo deal with loading
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>(TimeGranularity.DAILY);
  const { getBalanceSheet } = useHttp();

  const fetchBalanceSheetData = async (timeGranularity: TimeGranularity) => {
    getBalanceSheet(timeGranularity)
      .then((response: BalanceSheet) => {
        setBalanceSheetData(response);
      })
      .catch(err => {
        console.log("fetchBalanceSheet error " + JSON.stringify(err));
      });
  };

  const timeGranularityChangeHandler = (timeGranularity) => {
    setTimeGranularity(timeGranularity);
  };

  useEffect(() => {
    if (appCtx.authStatus.isAuthenticated) {
      fetchBalanceSheetData(timeGranularity);
    }
  }, [appCtx.authStatus.isAuthenticated, timeGranularity]);

  return (
    <div data-testid='balancesheet-container' >
      <Card className='d-flex align-items-stretch inner-box-shadow'>
        <Card.Body className='text-dark d-flex align-items-stretch flex-column pt-4'>
          <Card.Header className='p-0'>
            <Container fluid>
              <Row>
                <Col xs={12}>
                  <div className='fs-4 p-0 ps-3 fw-bold text-dark'>
                    Balance Sheet
                  </div>
                </Col>
                <Col xs={12} className='d-flex align-items-center'>
                  <div className='ms-3 me-3 mt-4'>
                    Time Granularity
                  </div>
                  <TimeGranularitySelection
                    className='time-granularity-dropdown mt-4'
                    timeGranularity={timeGranularity}
                    onTimeGranularityChanged={timeGranularityChangeHandler} />
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body className='pb-0 px-1 d-flex flex-column align-items-start justify-content-between'>
            <Row>
              <BalanceSheetGraph balanceSheetData={balanceSheetData} />
            </Row>
            <Row>
              <BalanceSheetTable balanceSheetData={balanceSheetData} />
            </Row>
          </Card.Body>
          <Card.Footer className='d-flex justify-content-center'>
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BalanceSheetRoot;
