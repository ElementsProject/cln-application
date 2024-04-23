import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BalanceSheetGraph({ balanceSheetData }) {
  const d3Container = useRef(null);

  useEffect(() => {
    var balanceSheet = balanceSheetData.balanceSheet

    if (d3Container.current && balanceSheet) {
      d3.select(d3Container.current).selectAll('*').remove();

      const width2 = 5000;
      const height2 = 500;
      const minSegmentSize = 30;

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width2)
        .attr('height', height2);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      const totalBalance = balanceSheet.accounts.reduce((acc, account) => acc + account.balance, 0);
      console.log("totalBalance = " + JSON.stringify(totalBalance));

      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const yScale = d3.scaleLinear()
        .domain([0, totalBalance])
        .range([height, 0]); 

      const barWidth = width / 2;

      let yOffset = height;
      balanceSheet.accounts.forEach((account, index) => {
        const segmentValueHeight = height - yScale(account.balance);
        const segmentHeight = Math.max(segmentValueHeight, minSegmentSize);

        svg.append('rect')
          .attr('x', width / 2 - barWidth / 2)
          .attr('y', yOffset - segmentHeight)
          .attr('width', barWidth)
          .attr('height', segmentHeight)
          .attr('fill', colorScale(index));

        if (segmentHeight > 20) {
          svg.append('text')
            .attr('x', width / 2)
            .attr('y', yOffset - segmentHeight / 2)
            .attr('text-anchor', 'middle')
            .text(account.account.substring(0, 6));
        }

        yOffset -= segmentHeight;
      });
    }
  }, [balanceSheetData]);

  return (
    <div ref={d3Container} />
  );
};

export default BalanceSheetGraph;
