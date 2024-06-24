import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './BalanceSheetGraph.scss'

function BalanceSheetGraph({ balanceSheetData }) {
  const d3Container = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (d3Container.current && balanceSheetData.periods.length > 0) {
      d3.select(d3Container.current).selectAll("*").remove();

      const outerWidth = 960;
      const outerHeight = 500;
      const margin = { top: 10, right: 30, bottom: 30, left: 100 };
      const innerWidth = outerWidth - margin.left - margin.right;
      const innerHeight = outerHeight - margin.top - margin.bottom;
      const minSegmentSize = 0;

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      const formatTick = d => `${d} sats`;

      const svg = d3.select(d3Container.current)
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      d3.select(d3Container.current).call(zoom);

      const highestTotalBalanceAcrossPeriods = Math.max(...balanceSheetData.periods.map(p => p.totalBalanceAcrossAccounts));
      const yDomainUpperBound = highestTotalBalanceAcrossPeriods + (highestTotalBalanceAcrossPeriods * 0.05); // Add 5% buffer

      const xScale = d3.scaleBand()
        .domain(balanceSheetData.periods.map(d => d.periodKey))
        .range([0, innerWidth])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, yDomainUpperBound])
        .range([innerHeight, 0]);

      const tooltip = d3.select("body").selectAll(".balance-sheet-tooltip")
      .data([null])
      .join("div")
      .attr("class", "balance-sheet-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("padding", "5px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("pointer-events", "none");

      tooltipRef.current = tooltip.node() as HTMLDivElement;

      const barsGroup = svg.append("g")
        .attr("class", "bars");

      const periodGroups = barsGroup.selectAll(".bar-group")
        .data(balanceSheetData.periods)
        .enter()
        .append("g")
          .attr("class", "bar-group")
          .attr("transform", (d: any) => `translate(${xScale(d.periodKey)}, 0)`)

      periodGroups.each(function(period: any) {
        let yOffset = innerHeight;

        const rects = d3.select(this).selectAll("rect")
          .data(period.accounts)
          .enter()
          .append("rect")
            .attr("x", 0)
            .attr("y", (d: any) => {
              yOffset -= Math.max(innerHeight - yScale(d.balance), minSegmentSize);
              return yOffset;
            })
            .attr("width", xScale.bandwidth())
            .attr("height", (d: any) => Math.max(innerHeight - yScale(d.balance), minSegmentSize))
            .attr("fill", (d, i) => colorScale(i.toString()));

            rects.on("mouseover", function(event, account: any) {
              d3.select(tooltipRef.current)
                .style("visibility", "visible")
                .text(`Short Channel ID: ${account.short_channel_id}
                       Remote Alias: ${account.remote_alias}
                       Balance: ${account.balance}
                       Percentage: ${account.percentage}
                       Account: ${account.account}`);
            })
            .on("mousemove", function(event) {
              d3.select(tooltipRef.current)
                .style("top", `${event.pageY}px`)
                .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", function() {
              d3.select(tooltipRef.current)
                .style("visibility", "hidden");
            });
      });

      const xAxis = d3.axisBottom(xScale);

      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .attr("clip-path", "url(#chart-area-clip")
        .call(xAxis.tickSizeOuter(0));

      svg.append("defs").append("clipPath")
        .attr("id", "chart-area-clip")
        .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", innerWidth)
          .attr("height", innerHeight);
      
      barsGroup.attr("clip-path", "url(#chart-area-clip");

      svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(formatTick));

      function zoom(svg) {
        svg.call(d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [outerWidth, innerHeight]])
        .on("zoom", zoomed));

        function zoomed(event: d3.D3ZoomEvent<SVGGElement, unknown>) {
          const transform = event.transform;
          
          periodGroups.attr("transform", (d: any) => 
            `translate(${transform.applyX(xScale(d.periodKey)! + xScale.bandwidth() / 2)}, 0)`);
          
          periodGroups.selectAll("rect")
            .attr("x", -xScale.bandwidth() / (2 * transform.k))
            .attr("width", xScale.bandwidth() / transform.k);
          
          const tempXScale = xScale.copy().range([0, innerWidth].map(d => transform.applyX(d)));
          svg.select(".x-axis").call(xAxis.scale(tempXScale));
        }
      }
    }
  }, [balanceSheetData]);

  return (
    <div ref={d3Container} />
  );
};

export default BalanceSheetGraph;
