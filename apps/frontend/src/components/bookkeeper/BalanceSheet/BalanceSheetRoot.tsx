import React, { useContext } from 'react';

import './BalanceSheetRoot.scss';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import BalanceSheetGraph from './Graph/BalanceSheetGraph';
import { AppContext } from '../../../store/AppContext';
import BalanceSheetTable from './Table/BalanceSheetTable';

function BalanceSheet() {
  const appCtx = useContext(AppContext);
  return (
    <div data-testid='balancesheet-container'>
      <Card className='d-flex align-items-stretch inner-box-shadow'>
        <Card.Body className='text-dark d-flex align-items-stretch flex-column pt-4'>
          <Card.Header className='p-0 d-flex align-items-start justify-content-between'>
            <div className='fs-4 p-0 ps-3 fw-bold text-dark'>
              Balance Sheet
            </div>
          </Card.Header>
          <Card.Body className='pb-0 px-1 d-flex flex-column align-items-start justify-content-between'>
            <Row>
              <BalanceSheetGraph balanceSheetData={appCtx.balanceSheet} />
            </Row>
            <Row>
              <BalanceSheetTable balanceSheetData={appCtx.balanceSheet} />
            </Row>
          </Card.Body>
          <Card.Footer className='d-flex justify-content-center'>
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BalanceSheet;
