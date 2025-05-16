import { useState, useEffect, Fragment, memo } from 'react';
import './AccountEventsTable.scss';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { formatCurrency } from '../../../../utilities/data-formatters';
import { TRANSITION_DURATION, Units } from '../../../../utilities/constants';
import { ChevronDown } from '../../../../svgs/ChevronDown';
import { motion, AnimatePresence } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AccountEventsPeriod } from '../../../../types/bookkeeper.type';
import { useSelector } from 'react-redux';
import { selectUIConfigUnit } from '../../../../store/rootSelectors';

function AccountEventsTable({periods}: {periods: AccountEventsPeriod[]}) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  
  useEffect(() => {
    const allperiod_keys = periods.map((period) => period.period_key);
    setExpandedRows(allperiod_keys);
  }, [periods]);

  const toggleRow = (period_key: string) => {
    if (expandedRows.includes(period_key)) {
      setExpandedRows(expandedRows.filter((key) => key !== period_key));
    } else {
      setExpandedRows([...expandedRows, period_key]);
    }
  };

  return (
    <div className='account-events-table-container' data-testid="account-events-table-container">
      <PerfectScrollbar>
        <Table className='expandable-table'>
          <thead className='expandable-head'>
            <tr className='expandable-row'>
              <th>Period</th>
              <th>Total Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='expandable-body'>
            {periods.map((period) => (
              <Fragment key={period.period_key}>
                <tr
                  onClick={() => toggleRow(period.period_key)}
                  className='expandable-header-row'
                >
                  <td>{period.period_key}</td>
                  <td>
                    {period.total_balance_across_accounts
                      ? formatCurrency(
                        period.total_balance_across_accounts,
                        Units.MSATS,
                        uiConfigUnit,
                        false,
                        0,
                        'string',
                      )
                      : 0
                    }
                  </td>
                  <OverlayTrigger
                    placement='auto'
                    delay={{ show: 250, hide: 250 }}
                    overlay={<Tooltip>{expandedRows.includes(period.period_key) ? 'Hide Details' : 'Show Details'}</Tooltip>}
                  >
                    <td>
                      <Button variant="link" onClick={() => toggleRow(period.period_key)}>
                        <motion.div
                          animate={{ rotate: expandedRows.includes(period.period_key) ? -180 : 0 }}
                          transition={{ duration: TRANSITION_DURATION }}
                        >
                          <ChevronDown width={16} height={10} />
                        </motion.div>
                      </Button>
                    </td>
                  </OverlayTrigger>
                </tr>
                <AnimatePresence mode="wait">
                  {expandedRows.includes(period.period_key) && (
                    <motion.tr
                      className='expandable-child-row h-100 overflow-hidden'
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: TRANSITION_DURATION }}
                    >
                      <td className='expandable-child-cell' colSpan={3}>
                        <Table className='child-table'>
                          <thead className='child-head'>
                            <tr className='child-row'>
                              <th>Short Channel ID</th>
                              <th>Remote Alias</th>
                              <th>Balance</th>
                              <th>Percentage</th>
                              <th>Account</th>
                            </tr>
                          </thead>
                          <tbody className='child-body'>
                            {period.accounts.map((account) => (
                              <tr className='child-row' key={account.short_channel_id}>
                                <td>{account.short_channel_id}</td>
                                <td>
                                  <OverlayTrigger
                                    placement="auto"
                                    delay={{ show: 250, hide: 250 }}
                                    overlay={
                                      <Tooltip id="tooltip-alias">
                                        {account.remote_alias}
                                      </Tooltip>
                                    }
                                  >
                                    <span>{account.remote_alias}</span>
                                  </OverlayTrigger>
                                </td>
                                <td>
                                  {account.balance_msat
                                    ? formatCurrency(
                                      account.balance_msat,
                                      Units.MSATS,
                                      uiConfigUnit,
                                      false,
                                      0,
                                      'string',
                                    )
                                    : 0
                                  }
                                </td>
                                <td>
                                  {((account.balance_msat / period.total_balance_across_accounts) * 100).toFixed(2) + '%'}
                                </td>
                                <td>
                                  <OverlayTrigger
                                    placement="auto"
                                    delay={{ show: 250, hide: 250 }}
                                    overlay={
                                      <Tooltip id="tooltip-account">
                                        {account.account}
                                      </Tooltip>
                                    }
                                  >
                                    <span>{account.account}</span>
                                  </OverlayTrigger>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </tbody>
        </Table>
      </PerfectScrollbar>
    </div>
  );
}

export default memo(AccountEventsTable);
