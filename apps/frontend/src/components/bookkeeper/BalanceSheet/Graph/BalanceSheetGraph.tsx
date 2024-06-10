import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BalanceSheetGraph({ balanceSheetData }) {
  const d3Container = useRef(null);

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

      const xScale = d3.scaleBand()
        .domain(balanceSheetData.periods.map(d => d.periodKey))
        .range([0, innerWidth])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, highestTotalBalanceAcrossPeriods])
        .range([innerHeight, 0]);

      const barWidth = xScale.bandwidth();

      balanceSheetData.periods.forEach((period, periodIndex) => {
        let yOffset = innerHeight;
        period.accounts.forEach((account, accountIndex) => {
          const segmentHeight = Math.max(innerHeight - yScale(account.balance), minSegmentSize);

          svg.append('rect')
            .attr('x', xScale(period.periodKey)!)
            .attr('y', yOffset - segmentHeight)
            .attr('width', barWidth)
            .attr('height', segmentHeight)
            .attr('fill', colorScale(accountIndex.toString()));

          yOffset -= segmentHeight;
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
