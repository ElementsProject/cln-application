import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { format } from 'd3-format';
import './BalanceSheetGraph.scss';
import { BALANCE_FORMAT } from '../../../../utilities/constants';

function BalanceSheetGraph({ balanceSheetData, width }) {
  const d3Container = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const formatBalance = useMemo(() => format(BALANCE_FORMAT), []);

  useEffect(() => {
    d3.select(d3Container.current).selectAll("*").remove();
    if (tooltipRef.current) {
      d3.select(tooltipRef.current).style('visibility', 'hidden');
    }

    if (d3Container.current && balanceSheetData.periods.length > 0) {
      const outerWidth = width;
      const outerHeight = 300;
      const margin = { top: 10, right: 30, bottom: 30, left: 100 };
      const innerWidth = outerWidth - margin.left - margin.right;
      const innerHeight = outerHeight - margin.top - margin.bottom;
      const minSegmentSize = 0;

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      const yAxisTickFormat = d => `${d3.format(",")(d)}`;

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
        .padding(0.5);

      const yScale = d3.scaleLinear()
        .domain([0, yDomainUpperBound])
        .range([innerHeight, 0]);

      const tooltip = d3.select("body").selectAll(".balance-sheet-tooltip")
      .data([null])
      .join("div")
      .attr("class", "balance-sheet-tooltip");

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
          .attr("class", "bar")
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
                       Balance: ${formatBalance(account.balance)}
                       Percentage: ${account.percentage}
                       Account: ${account.account}
                       Total Period Balance: ${formatBalance(period.totalBalanceAcrossAccounts)}`);
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
        .call(d3.axisLeft(yScale)
          .tickSizeInner(0)
          .tickSizeOuter(0)
          .tickFormat(yAxisTickFormat));

      function zoom(svg) {
        svg.call(d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [outerWidth, innerHeight]])
        .on("zoom", zoomed));

        function zoomed(event: d3.D3ZoomEvent<SVGGElement, unknown>) {
          const transform = event.transform;
          const tempXScale = xScale.copy().range([0, innerWidth].map(d => transform.applyX(d)));
          
          periodGroups.attr("transform", (d: any) => 
            `translate(${tempXScale(d.periodKey)}, 0)`);
          
          periodGroups.selectAll("rect")
            .attr("x", 0)
            .attr("width", tempXScale.bandwidth());
          
          svg.select(".x-axis").call(xAxis.scale(tempXScale));
        }
      }
    } else {
      d3.select(d3Container.current).append("text").text("No data");
    }
  }, [balanceSheetData, width]);

  return (
    <div ref={d3Container} />
  );
};

export default BalanceSheetGraph;
