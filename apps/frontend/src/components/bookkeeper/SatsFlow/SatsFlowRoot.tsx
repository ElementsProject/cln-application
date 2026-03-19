import './SatsFlowRoot.scss';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import { CloseSVG } from '../../../svgs/Close';
import DataFilterOptions from '../../shared/DataFilterOptions/DataFilterOptions';
import SatsFlowGraph from './SatsFlowGraph/SatsFlowGraph';
import { SatsFlowPeriod } from '../../../types/bookkeeper.type';
import { useSelector } from 'react-redux';
import { selectSatsFlowPeriods } from '../../../store/bkprSelectors';

const SatsFlowRoot = () => {
  const navigate = useNavigate();
  const satsFlowPeriods = useSelector(selectSatsFlowPeriods);
  const [showZeroActivityPeriods, setShowZeroActivityPeriods] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagFilterMode, setTagFilterMode] = useState<string>('include');
  const [satsFlowData, setSatsFlowData] = useState<SatsFlowPeriod[]>(satsFlowPeriods);

  const applyFilters = useCallback((
    periods: SatsFlowPeriod[],
    showZeroActivity: boolean,
    tags: string[],
    filterMode: string
  ): SatsFlowPeriod[] => {
    const tagFiltered: SatsFlowPeriod[] = tags.length === 0
      ? periods
      : periods.map(period => ({
          ...period,
          tag_groups: period.tag_groups.filter(group => {
            const isMatch = tags.includes(group.tag);
            return filterMode === 'include' ? isMatch : !isMatch;
          }),
        }));
    return showZeroActivity
      ? tagFiltered
      : tagFiltered.filter(period => period.tag_groups.length > 0);
  }, []);

  const handleShowZeroActivityChange = useCallback((show: boolean) => {
    setShowZeroActivityPeriods(show);
    setSatsFlowData(applyFilters(satsFlowPeriods, show, selectedTags, tagFilterMode));
  }, [satsFlowPeriods, selectedTags, tagFilterMode, applyFilters]);

  const multiSelectChangeHandler = useCallback((selectedOptions: string[], filterMode: string) => {
    setTimeout(() => {
      setSelectedTags(selectedOptions);
      setTagFilterMode(filterMode);
      setSatsFlowData(applyFilters(satsFlowPeriods, showZeroActivityPeriods, selectedOptions, filterMode));
    }, 0);
  }, [satsFlowPeriods, showZeroActivityPeriods, applyFilters]);

  useEffect(() => {
    setSatsFlowData(applyFilters(satsFlowPeriods, showZeroActivityPeriods, selectedTags, tagFilterMode));
  }, [satsFlowPeriods]);

  return (
    <div data-testid='satsflow-container' className='satsflow-container'>
      <Card className='h-100 p-3 pb-4'>
        <Card.Header className='fs-5 fw-bold text-dark mb-2'>
          <Row className='d-flex justify-content-between align-items-center'>
            <Col xs={9} className='fs-4 fw-bold'>Sats Flow</Col>
            <Col className='text-end'>
              <span
                className='span-close-svg'
                onClick={() => navigate('..')}
              >
                <CloseSVG />
              </span>
            </Col>
          </Row>
          <DataFilterOptions
            filter='satsflow'
            onShowZeroActivityChange={handleShowZeroActivityChange}
            multiSelectValues={[
              { name: 'routed', dataKey: 'routed' },
              { name: 'invoice_fee', dataKey: 'invoice_fee' },
              { name: 'received_invoice', dataKey: 'received_invoice' },
              { name: 'paid_invoice', dataKey: 'paid_invoice' },
              { name: 'deposit', dataKey: 'deposit' },
              { name: 'onchain_fee', dataKey: 'onchain_fee' },
            ]}
            multiSelectPlaceholder='Filter Events'
            multiSelectChangeHandler={multiSelectChangeHandler}
          />
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
