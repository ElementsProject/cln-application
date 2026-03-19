import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { FilterMode } from '../../../utilities/constants';

const AccountEventsRoot = () => {
  const navigate = useNavigate();
  const accEvntPeriods = useSelector(selectAccountEventPeriods);
  const [showZeroActivityPeriods, setShowZeroActivityPeriods] = useState<boolean>(false);
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);
  const [channelFilterMode, setChannelFilterMode] = useState<FilterMode>('include');
  const [accountEventsData, setAccountEventsData] = useState<AccountEventsPeriod[]>(accEvntPeriods);
  const multiSelectOptions = useMemo(() => {
      const seen = new Set<string>();
      const accounts: { name: string; dataKey: string }[] = [];
      accEvntPeriods.forEach(period => {
        period.accounts.forEach(account => {
          const id = account.short_channel_id || account.account || account.remote_alias || '';
          if (!seen.has(id)) {
            seen.add(id);
            accounts.push({ name: id, dataKey: id });
          }
        });
      });
      return accounts;
    }, [accEvntPeriods]);

  const applyFilters = useCallback((
    periods: AccountEventsPeriod[],
    showZero: boolean,
    channelIds: string[],
    filterMode: FilterMode,
  ): AccountEventsPeriod[] => {
    const zeroFiltered = filterZeroActivityAccountEvents(periods, showZero);

    if (!channelIds || channelIds.length === 0) {
      return zeroFiltered;
    }

    return zeroFiltered.map(period => ({
      ...period,
      accounts: period.accounts.filter(account => {
        const id = account.short_channel_id;
        const isMatch = id ? channelIds.includes(id) : false;
        return filterMode === 'include' ? isMatch : !isMatch;
      }),
    }));
  }, []);

  const handleShowZeroActivityChange = useCallback((show: boolean) => {
    setShowZeroActivityPeriods(show);
    setAccountEventsData(applyFilters(accEvntPeriods, show, selectedChannelIds, channelFilterMode));
  }, [accEvntPeriods, selectedChannelIds, channelFilterMode, applyFilters]);

  const multiSelectChangeHandler = useCallback((selectedOptions: string[], filterMode: FilterMode) => {
    setTimeout(() => {
      setSelectedChannelIds(selectedOptions);
      setChannelFilterMode(filterMode);
      setAccountEventsData(
        applyFilters(accEvntPeriods, showZeroActivityPeriods, selectedOptions, filterMode)
      );
    }, 0);
  }, [accEvntPeriods, showZeroActivityPeriods, applyFilters]);

  useEffect(() => {
    setAccountEventsData(
      applyFilters(accEvntPeriods, showZeroActivityPeriods, selectedChannelIds, channelFilterMode)
    );
  }, [accEvntPeriods]);

  return (
    <div className='account-events-container' data-testid='account-events-container'>
      <Card className='p-3 pb-4'>
        <Card.Header className='fs-5 fw-bold text-dark'>
          <Row className='d-flex justify-content-between align-items-center'>
            <Col xs={9} className='fs-4 fw-bold'>Account Events</Col>
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
            filter='accountevents'
            onShowZeroActivityChange={handleShowZeroActivityChange}
            multiSelectValues={multiSelectOptions}
            multiSelectPlaceholder='Filter Channels'
            multiSelectChangeHandler={multiSelectChangeHandler}
          />
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
