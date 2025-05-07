import { useState, useEffect } from 'react';
import './AccountEventsRoot.scss';
import { Card, Row, Col } from 'react-bootstrap';
import AccountEventsGraph from './AccountEventsGraph/AccountEventsGraph';
import AccountEventsTable from './AccountEventsTable/AccountEventsTable';
import { CloseSVG } from '../../../svgs/Close';
import { useNavigate } from 'react-router-dom';
import DataFilterOptions from '../../shared/DataFilterOptions/DataFilterOptions';
import { filterZeroActivityAccountEvents } from '../../../services/data-transform.service';
import { AccountEventsPeriod } from '../../../types/bookkeeper.type';
import { useSelector } from 'react-redux';
import { selectAccountEventPeriods } from '../../../store/bkprSelectors';

const AccountEventsRoot = () => {
  const navigate = useNavigate();
  const accEvntPeriods = useSelector(selectAccountEventPeriods);
  const [showZeroActivityPeriods, setShowZeroActivityPeriods] = useState<boolean>(false);
  const [accountEventsData, setAccountEventsData] = useState<AccountEventsPeriod[]>(accEvntPeriods);

  const handleShowZeroActivityChange = (show: boolean) => {
    setShowZeroActivityPeriods(show);
    setAccountEventsData(filterZeroActivityAccountEvents((accEvntPeriods), show));
  };

  useEffect(() => {
    setAccountEventsData(filterZeroActivityAccountEvents((accEvntPeriods), showZeroActivityPeriods));
  }, [accEvntPeriods, showZeroActivityPeriods]);

  return (
    <div className='account-events-container' data-testid='account-events-container'>
      <Card className='p-3 pb-4'>
        <Card.Header className='fs-5 fw-bold text-dark'>
          <Row className='d-flex justify-content-between align-items-center'>
            <Col xs={9} className='fs-4 fw-bold'>Account Events</Col>
            <Col className='text-end'>
              <span
                className='span-close-svg'
                onClick={() => {
                  navigate('..');
                }}
              >
                <CloseSVG />
              </span>
            </Col>
          </Row>
          <DataFilterOptions filter='accountevents' onShowZeroActivityChange={handleShowZeroActivityChange} />
        </Card.Header>
        <Card.Body className='pt-1 pb-3 d-flex flex-column align-items-center'>
            <Col xs={12} className='account-events-graph-container'>
              <AccountEventsGraph periods={accountEventsData} />
            </Col>
          <Col xs={12} className='account-events-table-container'>
            <AccountEventsTable periods={accountEventsData} />
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AccountEventsRoot;
