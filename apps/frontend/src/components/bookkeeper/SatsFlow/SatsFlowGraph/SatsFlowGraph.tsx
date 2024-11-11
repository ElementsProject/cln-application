import * as d3 from "d3";
import { format } from 'd3-format';
import { useRef, useEffect } from "react";
import './SatsFlowGraph.scss';
import { SatsFlow, SatsFlowPeriod, TagGroup } from "../../../../types/lightning-satsflow.type";

function SatsFlowGraph({ satsFlowData, width }: { satsFlowData: SatsFlow, width: number }) {
  const d3Container = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (d3Container.current && satsFlowData.periods.length > 0) {
      d3.select(d3Container.current).selectAll("*").remove();

      const outerWidth = width;
      const outerHeight = 300;
      const margin = { top: 10, right: 30, bottom: 30, left: 100 };
      const innerWidth = outerWidth - margin.left - margin.right;
      const innerHeight = outerHeight - margin.top - margin.bottom;
      const formatSats = format(',.3f');

      const { maxInflowSat, maxOutflowSat } = findMaxInflowAndOutflow(satsFlowData);

      const negativeColorScale = d3.scaleLinear<string>()
        .domain([0, -maxOutflowSat])
        .range(["#ff474c", "#8b0000"]);

      const positiveColorScale = d3.scaleLinear<string>()
        .domain([0, maxInflowSat])
        .range(["#90ee90", "#008000"]);

      function getColor(netInflow: number) {
        if (netInflow >= 0) {
          return positiveColorScale(netInflow);
        } else {
          return negativeColorScale(netInflow);
        }
      }

      const svg = d3.select(d3Container.current)
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      d3.select(d3Container.current).call(zoom);

      const yDomainUpperBound = maxInflowSat;
      const yDomainLowerBound = -maxOutflowSat;

      const xScale = d3.scaleBand()
        .domain(satsFlowData.periods.map(d => d.periodKey))
        .range([0, innerWidth])
        .padding(0.5);

      const yScalePadding = Math.max(yDomainUpperBound, Math.abs(yDomainLowerBound)) * 0.05;

      const yScale = d3.scaleLinear()
        .domain([yDomainLowerBound - yScalePadding, yDomainUpperBound + yScalePadding])
        .range([innerHeight, 0]);

      const tooltip = d3.select("body").selectAll(".sats-flow-tooltip")
        .data([null])
        .join("div")
        .attr("class", "sats-flow-tooltip");

      tooltipRef.current = tooltip.node() as HTMLDivElement;

      const barsGroup = svg.append("g")
        .attr("class", "bars");

      const periodGroups = barsGroup.selectAll(".bar-group")
        .data(satsFlowData.periods)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", (d: any) => `translate(${xScale(d.periodKey)}, 0)`)

      periodGroups.each(function (period: SatsFlowPeriod) {
        let yOffsetPositive = yScale(0);
        let yOffsetNegative = yScale(0);

        const rects = d3.select(this).selectAll("rect")
          .data(period.tagGroups)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", (d: TagGroup) => {
            let barHeight = Math.abs(yScale(d.netInflowSat) - yScale(0));
            console.log("barHeight = " + barHeight + " " + d.netInflowSat);
            //min barHeight should be 1.
            if (d.netInflowSat < 0) {
              //For negative values start at yOffsetNegative and move down
              const y = yOffsetNegative;
              yOffsetNegative += barHeight;
              return y;
            } else {
              //For positive values subtract the bar height from yOffsetPositive to move up
              yOffsetPositive -= barHeight;
              return yOffsetPositive;
            }
          })
          .attr("width", xScale.bandwidth())
          .attr("height", (d: TagGroup) => Math.abs(yScale(0) - yScale(d.netInflowSat)))
          .attr("fill", (d, i) => getColor(d.netInflowSat));

        rects.on("mouseover", function (event, tagGroup: TagGroup) {
          d3.select(tooltipRef.current)
            .style("visibility", "visible")
            .text(
              `Event Tag: ${tagGroup.tag}
               Net Inflow: ${formatSats(tagGroup.netInflowSat)}
               Credits: ${formatSats(tagGroup.creditSat)}
               Debits: ${formatSats(tagGroup.debitSat)}
               Volume: ${formatSats(tagGroup.volumeSat)}`
            );
        })
          .on("mousemove", function (event) {
            d3.select(tooltipRef.current)
              .style("top", `${event.pageY}px`)
              .style("left", `${event.pageX + 10}px`);
          })
          .on("mouseout", function () {
            d3.select(tooltipRef.current)
              .style("visibility", "hidden");
          });
      });

      const xAxis = d3.axisBottom(xScale);
      const xAxisYPosition = yScale(0);

      const xAxisGroup = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${xAxisYPosition})`)
        .call(
          d3.axisBottom(xScale)
            .tickSizeOuter(0)
            .tickSizeInner(0)
            .tickFormat(() => '')
        );

      //labels are rendered on a separate x axis at the bottom of the chart
      const xAxisLabelsGroup = svg.append("g")
        .attr("class", "x-axis-labels")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(
          d3.axisBottom(xScale)
            .tickSizeOuter(0)
            .tickSize(0)
        );

      svg.selectAll(".x-axis-labels .domain").remove();

      //set up y axis
      const yAxisTickFormat = d => `${d3.format(",")(d)}`;
      svg.append("g")
        .call(d3.axisLeft(yScale)
          .tickSizeInner(0)
          .tickSizeOuter(0)
          .tickFormat(yAxisTickFormat)
        );

      const lineGenerator = d3.line<SatsFlowPeriod>()
        .x((d: SatsFlowPeriod) => xScale(d.periodKey)! + xScale.bandwidth() / 2)
        .y((d: SatsFlowPeriod) => yScale(d.netInflowSat))
        .curve(d3.curveMonotoneX);

      const lineSvg = svg.append("path")
        .datum(satsFlowData.periods)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#E1BA2D")
        .attr("stroke-width", 5)
        .attr("stroke-linecap", "round")
        .attr("d", lineGenerator)
        .attr("clip-path", "url(#chart-area-clip");

      //define clip area
      svg.append("defs").append("clipPath")
        .attr("id", "chart-area-clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", innerWidth)
        .attr("height", innerHeight);

      barsGroup.attr("clip-path", "url(#chart-area-clip");
      xAxisGroup.attr("clip-path", "url(#chart-area-clip")
      xAxisLabelsGroup.attr("clip-path", "url(#chart-area-clip")
      lineSvg.attr("clip-path", "url(#chart-area-clip");

      function zoom(svg) {
        svg.call(d3.zoom()
          .scaleExtent([1, 8])
          .translateExtent([[0, 0], [outerWidth, innerHeight]])
          .on("zoom", zoomed));

        function zoomed(event: d3.D3ZoomEvent<SVGGElement, unknown>) {
          const transform = event.transform;
          const tempXScale = xScale.copy().range([0, innerWidth].map(d => transform.applyX(d)));

          periodGroups.attr("transform", (d: SatsFlowPeriod) =>
            `translate(${tempXScale(d.periodKey)}, 0)`);

          periodGroups.selectAll("rect")
            .attr("x", 0)
            .attr("width", tempXScale.bandwidth());

          xAxisGroup
            .call(
              xAxis.scale(tempXScale)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickFormat(() => '')
            );

          xAxisLabelsGroup
            .call(
              xAxis.scale(tempXScale)
                .tickSizeOuter(0)
                .tickSize(0)
                .tickFormat((d) => d)
            );

          svg.selectAll(".x-axis-labels .domain").remove();

          const lineGenerator = d3.line<SatsFlowPeriod>()
            .x(d => tempXScale(d.periodKey)! + tempXScale.bandwidth() / 2)
            .y(d => yScale(d.netInflowSat))
            .curve(d3.curveMonotoneX);

          //rerender the line
          svg.select(".line")
            .attr("d", lineGenerator(satsFlowData.periods));
        }
      }
    }
  }, [satsFlowData, width]);
  return (
    <div ref={d3Container} />
  );
};

/**
 * Return the max inflow and outflow across all time periods.
 * 
 * @param satsFlowData - The dataset to check.
 * @returns Returns an object with the max inflow and outflow found.
 */
function findMaxInflowAndOutflow(satsFlowData) {
  let maxInflowSat = 0;
  let maxOutflowSat = 0;

  satsFlowData.periods.forEach(period => {
    if (period.inflowSat > maxInflowSat) {
      maxInflowSat = period.inflowSat;
    }

    if (period.outflowSat > maxOutflowSat) {
      maxOutflowSat = period.outflowSat;
    }
  });

  return { maxInflowSat, maxOutflowSat };
}

export default SatsFlowGraph;
