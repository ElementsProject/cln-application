import { memo, useMemo } from 'react';
import './AccountEventsGraph.scss';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getBarColors, Units } from '../../../../utilities/constants';
import { formatCurrency } from '../../../../utilities/data-formatters';
import { transformAccountEventsGraphData } from '../../../../services/data-transform.service';
import { AccountEventsPeriod } from '../../../../types/bookkeeper.type';
import { useSelector } from 'react-redux';
import { selectUIConfigUnit } from '../../../../store/rootSelectors';

const AccountEventsGraphTooltip = ({ active, payload, unit }: { active?: boolean; payload?: any[], unit?: Units }) => {
  if (active && payload && payload.length >= 0) {
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
    return (
      <div className='bkpr-tooltip p-3'>
        <p><strong>Period: </strong>{payload[0]?.payload?.period_key}</p>
        <p><strong>Total: </strong>{formatCurrency(total, Units.MSATS, unit, false, 0, 'string')}</p>
        <hr />
        {payload.map((entry, index) => (
          <p className='ps-4' key={index} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value, Units.MSATS, unit, false, 0, 'string')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AccountEventsGraph = ({periods}: {periods: AccountEventsPeriod[]}) => {
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const { chartData, accountNames, barColors } = useMemo(() => {
    const data = transformAccountEventsGraphData(periods)
    const names = Array.from(new Set(periods.flatMap((period) => period.accounts.map((account) => account.short_channel_id))));
    return { chartData: data, accountNames: names, barColors: getBarColors(names.length) };
  }, [periods]);

  return (
    <div data-testid='account-events-graph' className='account-events-graph'>
      <ResponsiveContainer width='100%'>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 0,
            left: periods && periods.length > 0 ? 35 : 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='period_key' />
          <Tooltip content={<AccountEventsGraphTooltip unit={uiConfigUnit} />} />
          {periods && periods.length > 0 && (
            <YAxis 
              tickFormatter={(value) => {
                const formatted = formatCurrency(value, Units.MSATS, uiConfigUnit, false, 0, 'string');
                return typeof formatted === 'string' ? formatted : String(formatted);
              }}
            />
          )}
          <Legend />
          {accountNames.map((account, index) => (
            <Bar
              key={index}
              dataKey={account || ''}
              stackId='a'
              fill={barColors[index]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(AccountEventsGraph);
