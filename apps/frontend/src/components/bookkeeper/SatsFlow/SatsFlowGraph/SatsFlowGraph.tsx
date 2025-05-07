import { memo, useMemo } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Line
} from 'recharts';
import './SatsFlowGraph.scss';
import { Row, Col } from 'react-bootstrap';
import { Units } from '../../../../utilities/constants';
import { formatCurrency, titleCase } from '../../../../utilities/data-formatters';
import { transformSatsFlowGraphData } from '../../../../services/data-transform.service';
import { SatsFlowPeriod } from '../../../../types/bookkeeper.type';
import { useSelector } from 'react-redux';
import { selectUIConfigUnit } from '../../../../store/rootSelectors';

const SatsFlowGraphTooltip = ({ active, payload, label, unit, periods }: any) => {
  if (active && payload && payload.length) {
    const period = periods.find(d => d.period_key === label);
    if (!period) return null;
    return (
      <div className='bkpr-tooltip p-3'>
        <p><strong>Period:</strong>{period.period_key}</p>
        <hr />
        <p>Period Inflow: {formatCurrency(period.inflow_msat, Units.MSATS, unit, false, 0, 'string')}</p>
        <p>Period Outflow: {formatCurrency(period.outflow_msat, Units.MSATS, unit, false, 0, 'string')}</p>
        <p>Net Inflow: {formatCurrency(period.inflow_msat - period.outflow_msat, Units.MSATS, unit, false, 0, 'string')}</p>
        <hr />
        {payload.map((entry, index) => {
          if (entry.name !== 'net_inflow_msat') {
            return (
              <p className='ps-4' key={index} style={{ color: entry.color }}>
                {titleCase(entry.name.replace('_', ' '))}: {formatCurrency(entry.payload[entry.name], Units.MSATS, unit, false, 0, 'string')}
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

const SatsFlowGraphLegend = (props: any) => {
  const { payload } = props;
  return (
    <Row className='gx-3 gy-1 justify-content-center align-items-center'>
      {payload
        .filter((entry: any) => entry.value !== 'net_inflow_msat')
        .map((entry: any, index: number) => (
          <Col key={`item-${index}`} xs='auto' className='d-flex align-items-center'>
            <div className='sats-flow-lagend-bullet' style={{ backgroundColor: entry.color }}/>
            <span>{titleCase(entry.value.replace(/_/g, ' '))}</span>
          </Col>
        ))
      }
    </Row>
  )
};

const CustomActiveDot = (props) => <circle cx={props.cx} cy={props.cy} r={4} fill="var(--bs-body-color)" />;

function SatsFlowGraph({periods}: {periods: SatsFlowPeriod[]}) {
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const barColors = ["rgba(0, 198, 160, 1)", "rgba(121, 203, 96, 1)", "rgba(201, 222, 83, 1)", "rgba(242, 207, 32, 1)", "rgba(240, 147, 46, 1)", "rgba(237, 88, 59, 1)"];
  
  const data = useMemo(() => {
    return transformSatsFlowGraphData(periods);
  }, [periods]);

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
          <Legend content={SatsFlowGraphLegend} />
          <Bar name='routed' dataKey='routed' stackId='bar' fill={barColors[2]} />
          <Bar name='invoice_fee' dataKey='invoice_fee' stackId='bar' fill={barColors[5]} />
          <Bar name='received_invoice' dataKey='received_invoice' stackId='bar' fill={barColors[1]} />
          <Bar name='paid_invoice' dataKey='paid_invoice' stackId='bar' fill={barColors[4]} />
          <Bar name='deposit' dataKey='deposit' stackId='bar' fill={barColors[0]} />
          <Bar name='onchain_fee' dataKey='onchain_fee' stackId='bar' fill={barColors[3]} />
          <Line className='series-net-inflow' type='monotone' dataKey='net_inflow_msat' activeDot={<CustomActiveDot />} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(SatsFlowGraph);
