import { useCallback, useEffect, useState } from 'react';
import './SatsFlowRoot.scss';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import { CloseSVG } from '../../../svgs/Close';
import DataFilterOptions from '../../shared/DataFilterOptions/DataFilterOptions';
import SatsFlowGraph from './SatsFlowGraph/SatsFlowGraph';
import { SatsFlowPeriod } from '../../../types/bookkeeper.type';
import { useSelector } from 'react-redux';
import { selectSatsFlowPeriods } from '../../../store/bkprSelectors';

const SatsFlowRoot = props => {
  const navigate = useNavigate();
  const satsFlowPeriods = useSelector(selectSatsFlowPeriods);
  const [showZeroActivityPeriods, setShowZeroActivityPeriods] = useState<boolean>(false);
  const [satsFlowData, setSatsFlowData] = useState<SatsFlowPeriod[]>(satsFlowPeriods);

  const filterSatsFlowData = (periods, showZeroActivity) => {
    return (showZeroActivity) ? periods : periods.filter(key => key.tag_groups.length > 0)
  }

  const handleShowZeroActivityChange = useCallback((show: boolean) => {
    setShowZeroActivityPeriods(show);
    setSatsFlowData(filterSatsFlowData(satsFlowPeriods, show));
  }, [satsFlowPeriods]);

  useEffect(() => {
    setSatsFlowData(filterSatsFlowData(satsFlowPeriods, showZeroActivityPeriods));
  }, [satsFlowPeriods, showZeroActivityPeriods]);

  return (
    <div data-testid='satsflow-container' className='satsflow-container'>
      <Card className='h-100 p-3 pb-4'>
        <Card.Header className='fs-5 fw-bold text-dark mb-2'>
          <Row className='d-flex justify-content-between align-items-center'>
            <Col xs={9} className='fs-4 fw-bold'>Sats Flow</Col>
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
          <DataFilterOptions filter='satsflow' onShowZeroActivityChange={handleShowZeroActivityChange} />
        </Card.Header>
        <Card.Body className='pb-4 d-flex flex-column align-items-center'>
          <Col xs={12} className='sats-flow-graph-container'>
            <SatsFlowGraph periods={satsFlowData} />
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SatsFlowRoot;
