import { useMemo, useState, useEffect, memo } from 'react';
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip, Legend } from 'recharts';
import './VolumeGraph.scss';
import { getBarColors, Units } from '../../../../utilities/constants';
import { formatCurrency } from '../../../../utilities/data-formatters';
import { transformVolumeGraphData } from '../../../../services/data-transform.service';
import { Badge, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDarkMode, selectUIConfigUnit } from '../../../../store/rootSelectors';
import { selectVolumeForwards } from '../../../../store/bkprSelectors';

const VolumeGraphTooltip = ({ active, payload, unit }: any) => {
  if (active && payload && payload.length >= 0) {
    const forward = payload[0]?.payload;
    if (!forward) return null;
    return (
      <div className='bkpr-tooltip p-3'>
        <p><strong>Inbound Channel SCID: </strong>{forward.in_channel_scid}</p>
        <p><strong>Inbound Peer Alias: </strong>{forward.in_channel_peer_alias}</p>
        {forward.out_channel_scid && (
          <>
            <p><strong>Outbout Channel SCID: </strong>{forward.out_channel_scid}</p>
            <p><strong>Outbout Peer Alias: </strong>{forward.out_channel_peer_alias}</p>
          </>
        )}
        <hr />
        {forward.out_channel_scid && (
          <>
            <p>Inbound: {formatCurrency(forward.in_msat, Units.MSATS, unit, false, 0, 'string')}</p>
            <p>Outbound: {formatCurrency(forward.out_msat, Units.MSATS, unit, false, 0, 'string')}</p>
          </>
        )}
        <p>Fee: {formatCurrency(forward.fee_msat, Units.MSATS, unit, false, 0, 'string')}</p>
      </div>
    );
  }
  return null;
};

const VolumeGraphLegend = ({ colorChannelMap }: { colorChannelMap: Map<string, string> }) => {
  return (
    <Row className='volume-graph-legend'>
      <Row className='d-flex align-items-center justify-content-center mb-2'>
        {'Inbound SCID (Inner Circle) -> Outbound SCID (Outer Circle)'}
      </Row>
      Inbound SCID: 
      {Array.from(colorChannelMap.entries()).map(([channelId, color]) => (
        <Col key={`legend-${channelId}`} xs='auto'>
          <div className='d-flex align-items-center'>
            <Badge
              pill
              className='legend-color me-2'
              bg={color}
              style={{ backgroundColor: color }}
            />
            <span className='legend-label text-truncate' style={{ color: color }}>
              {channelId}
            </span>
          </div>
        </Col>
      ))}
    </Row>
  );
};

const VolumeGraph = () => {
  const location = useLocation();
  const isDarkMode = useSelector(selectIsDarkMode);
  const uiConfigUnit = useSelector(selectUIConfigUnit);
  const volumeForwards = useSelector(selectVolumeForwards);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [location.key]);

  let pieColors: any[] = [];
  const RADIAN = Math.PI / 180;

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index, data, isInner = false }) => {
    const entry = data[index];
    const radius = innerRadius + (outerRadius - innerRadius) * (isInner ? 0.5 : 1.4);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const textAnchor = isInner  
      ? (x > cx ? 'start' : 'end') 
      : (Math.cos(midAngle * RADIAN) > 0 ? 'start' : 'end');
  
    return (
      <text 
        x={x} 
        y={y} 
        fill={!isInner ? colorChannelMap.get(entry.in_channel_scid) : isDarkMode ? '#FFFFFF' : '#0C0C0F'} 
        textAnchor={textAnchor}
        dominantBaseline='central'
        fontSize={12} 
        style={{ 
          pointerEvents: 'none', 
          fontWeight: 'bold',
          transition: 'all 1s ease-out'
        }}
      >
        {`${isInner ? entry.in_channel_scid : entry.out_channel_scid}: (${formatCurrency(entry.fee_msat, Units.MSATS, uiConfigUnit, false, 0, 'string')})`}
      </text>
    );
  };

  const { inbound, outbound } = useMemo(() => {
    return transformVolumeGraphData(volumeForwards);
  }, [volumeForwards]);

  pieColors = getBarColors(inbound.length);
  const colorChannelMap = new Map();
  inbound.forEach((channel, index) => {
    colorChannelMap.set(channel.in_channel_scid, pieColors[inbound.length - index - 1]);
  });

  return (
    <div data-testid='volume-graph' className='volume-graph'>
      <ResponsiveContainer width='100%' key={location.key}>
        {animate ? (
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Tooltip content={<VolumeGraphTooltip unit={uiConfigUnit} />} />
            <Legend
              content={<VolumeGraphLegend colorChannelMap={colorChannelMap} />}
              layout='horizontal'
              verticalAlign='bottom'
              align='center'
            />
            <Pie
              data={inbound}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={(props) => renderLabel({ ...props, data: inbound, isInner: true })}
              outerRadius='76%'
              dataKey='fee_msat'
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1000}
              nameKey='in_channel_scid'
            >
              {inbound.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colorChannelMap.get(entry.in_channel_scid)} 
                  stroke='#333'
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Pie
              data={outbound}
              dataKey='fee_msat'
              cx='50%'
              cy='50%'
              innerRadius='80%'
              outerRadius='98%'
              label={(props) => renderLabel({ ...props, data: outbound, isInner: false })}
              labelLine={true}
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1000}
            >
              {outbound.map((entry, index) => (
                <Cell 
                  key={`outbound-cell-${index}`} 
                  fill={colorChannelMap.get(entry.in_channel_scid)} 
                  stroke='#333'
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        ) : (<></>)}
      </ResponsiveContainer>
    </div>
  );
};

export default memo(VolumeGraph);
