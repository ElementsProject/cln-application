import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './BalanceSheetGraph.scss'
import { Period } from '../../../../types/lightning-bookkeeper.type';

function BalanceSheetGraph({ balanceSheetData }) {
  const d3Container = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (d3Container.current && balanceSheetData.periods.length > 0) {
      d3.select(d3Container.current).selectAll('*').remove();

      const outerWidth = 960;
      const outerHeight = 500;
      const margin = { top: 10, right: 30, bottom: 30, left: 100 };
      const innerWidth = outerWidth - margin.left - margin.right;
      const innerHeight = outerHeight - margin.top - margin.bottom;
      const minSegmentSize = 0;//todo do i want a min size? 30

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      const formatTick = d => `${d} sats`;

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const highestTotalBalanceAcrossPeriods = Math.max(...balanceSheetData.periods.map(p => p.totalBalanceAcrossAccounts));
      const yDomainUpperBound = highestTotalBalanceAcrossPeriods + (highestTotalBalanceAcrossPeriods * 0.05); // Add 5% buffer

      const xScale = d3.scaleBand()
        .domain(balanceSheetData.periods.map(d => d.periodKey))
        .range([0, innerWidth])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, yDomainUpperBound])
        .range([innerHeight, 0]);

      const barWidth = xScale.bandwidth();

      const tooltip = d3.select('body').selectAll('.balance-sheet-tooltip')
      .data([null])
      .join('div')
      .attr('class', 'balance-sheet-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'white')
      .style('padding', '5px')
      .style('border', '1px solid black')
      .style('border-radius', '5px')
      .style('pointer-events', 'none');

      tooltipRef.current = tooltip.node() as HTMLDivElement;

      balanceSheetData.periods.forEach((period: Period, periodIndex) => {
        let yOffset = innerHeight;
        period.accounts.forEach((account, accountIndex) => {
          const segmentHeight = Math.max(innerHeight - yScale(account.balance), minSegmentSize);

          const segment = svg.append('rect')
            .attr('x', xScale(period.periodKey)!)
            .attr('y', yOffset - segmentHeight)
            .attr('width', barWidth)
            .attr('height', segmentHeight)
            .attr('fill', colorScale(accountIndex.toString()));

          yOffset -= segmentHeight;

          segment
            .on('mouseover', function (event, d: any) {
              d3.select(tooltipRef.current)
                .style('visibility', 'visible')
                .text(`Short Channel ID: ${account.short_channel_id}
                  Remote Alias: ${account.remote_alias}
                  Balance: ${account.balance}
                  Percentage: ${account.percentage}
                  Account: ${account.account}`);
            })
            .on('mousemove', function (event) {
              d3.select(tooltipRef.current)
                .style('top', `${event.pageY}px`)
                .style('left', `${event.pageX + 10}px`);
            })
            .on('mouseout', function () {
              d3.select(tooltipRef.current)
                .style('visibility', 'hidden');
            });

        });
      });

      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(formatTick));
    }
  }, [balanceSheetData, d3Container.current]);

  return (
    <div ref={d3Container} />
  );
};

export default BalanceSheetGraph;
