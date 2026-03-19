import { memo, useMemo } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Legend, Line } from 'recharts';
import './SatsFlowGraph.scss';
import { Row, Col } from 'react-bootstrap';
import { Units } from '../../../../utilities/constants';
import { formatCurrency, titleCase } from '../../../../utilities/data-formatters';
import { transformSatsFlowGraphData } from '../../../../services/data-transform.service';
import { SatsFlowPeriod } from '../../../../types/bookkeeper.type';
import { useSelector } from 'react-redux';
import { selectUIConfigUnit } from '../../../../store/rootSelectors';

const ALL_EVENTS_VALUES = [
  { name: 'routed', dataKey: 'routed', fill: "rgba(201, 222, 83, 1)" },
  { name: 'invoice_fee', dataKey: 'invoice_fee', fill: "rgba(237, 88, 59, 1)" },
  { name: 'received_invoice', dataKey: 'received_invoice', fill: "rgba(121, 203, 96, 1)" },
  { name: 'paid_invoice', dataKey: 'paid_invoice', fill: "rgba(240, 147, 46, 1)" },
  { name: 'deposit', dataKey: 'deposit', fill: "rgba(0, 198, 160, 1)" },
  { name: 'onchain_fee', dataKey: 'onchain_fee', fill: "rgba(242, 207, 32, 1)" },
];

const SatsFlowGraphTooltip = ({ active, payload, label, unit, periods }: any) => {
  if (active && payload && payload.length >= 0) {
    const period = periods.find(d => d.period_key === label);
    if (!period) return null;
    return (
      <div className='bkpr-tooltip p-3'>
        <p><strong>Period: </strong>{period.period_key}</p>
        <hr />
        <p>Period Inflow: {formatCurrency(period.inflow_msat, Units.MSATS, unit, false, 0, 'string')}</p>
        <p>Period Outflow: {formatCurrency(period.outflow_msat, Units.MSATS, unit, false, 0, 'string')}</p>
        <p>Net Inflow: {formatCurrency(period.inflow_msat - period.outflow_msat, Units.MSATS, unit, false, 0, 'string')}</p>
        <hr />
        {payload.map((entry, index) => {
          if (entry.name !== 'net_inflow_msat') {
            return (
              <p className='ps-4' key={index} style={{ color: entry.color }}>
                {titleCase(entry.name.replace('_', ' '))}: {formatCurrency(entry?.payload[entry.name], Units.MSATS, unit, false, 0, 'string')}
              </p>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
  return null;
};

const SatsFlowGraphLegend = ({ eventValues }: { eventValues: typeof ALL_EVENTS_VALUES }) => {
  return (
    <Row className='gx-3 gy-1 justify-content-center align-items-center'>
      {eventValues.map((entry, index) => (
        <Col key={`item-${index}`} xs='auto' className='col-sats-flow-lagend d-flex align-items-center'>
          <div className='sats-flow-lagend-bullet' style={{ backgroundColor: entry.fill }} />
          <span className='span-sats-flow-lagend'>{titleCase(entry.name.replace(/_/g, ' '))}</span>
        </Col>
      ))}
    </Row>
  );
};

const CustomActiveDot = (props) => <circle cx={props.cx} cy={props.cy} r={4} fill="var(--bs-body-color)" />;

function SatsFlowGraph({ periods }: { periods: SatsFlowPeriod[] }) {
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const eventValues = useMemo(() => {
    const presentTags = new Set(
      periods.flatMap(period => period.tag_groups.map(group => group.tag))
    );
    return ALL_EVENTS_VALUES.filter(bar => presentTags.has(bar.name));
  }, [periods]);

  const data = useMemo(() => transformSatsFlowGraphData(periods), [periods]);

  return (
    <div data-testid='sats-flow-graph' className='sats-flow-graph'>
      <ResponsiveContainer width='100%'>
        <ComposedChart
          data={data}
          stackOffset='sign'
          margin={{ top: 20, right: 0, left: 30, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis
            tickFormatter={(value) => {
              const formatted = formatCurrency(value, Units.MSATS, uiConfigUnit, false, 0, 'string');
              return typeof formatted === 'string' ? formatted : String(formatted);
            }}
          />
          <Tooltip content={<SatsFlowGraphTooltip unit={uiConfigUnit} periods={periods} />} />
          <Legend content={<SatsFlowGraphLegend eventValues={eventValues} />} />
          {eventValues.map((value: any) => (
            <Bar name={value.name} key={value.name} dataKey={value.dataKey} stackId='bar' fill={value.fill} />
          ))}
          <Line className='series-net-inflow' type='monotone' dataKey='net_inflow_msat' activeDot={<CustomActiveDot />} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(SatsFlowGraph);
