import * as d3 from "d3";
import { format } from 'd3-format';
import { useRef, useEffect } from "react";
import './VolumeGraph.scss';
import { Forward, VolumeData } from "../../../../types/lightning-volume.type";

function VolumeGraph({ volumeData, width }: { volumeData: VolumeData, width: number }) {
  const d3Container = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (d3Container.current && volumeData.forwards.length > 0) {
      d3.select(d3Container.current).selectAll("*").remove();

      const outerWidth = width;
      const outerHeight = 500;
      const margin = { top: 10, right: 30, bottom: 30, left: 100 };
      const barWidth = width * 0.50;
      const barPadding = 5;
      const centerX = (outerWidth - (margin.left + margin.right + barWidth)) / 2;
      const centerY = margin.top;
      const customColors = ['#C47806', '#DFB316', '#038730'];
      const combinedColors = [...customColors, ...d3.schemeSet3.slice(customColors.length)];
      const colorScale = d3.scaleOrdinal(combinedColors);      const formatSats = format(',.3f');
      let cumulativeHeight = 10;

      const yScale = d3.scaleLinear()
        .domain([0, volumeData.totalOutboundSat])
        .range([0, outerHeight - margin.top - margin.bottom]);

      const tooltip = d3.select("body").selectAll(".volume-tooltip")
        .data([null])
        .join("div")
        .attr("class", "volume-tooltip");

      tooltipRef.current = tooltip.node() as HTMLDivElement;

      const svg = d3.select(d3Container.current)
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .style("overflow-y", "auto")
        .style("display", "block");

      const g = svg.append("g")
        .attr("transform", `translate(${centerX},${centerY})`);

      const maxInboundSCIDTextWidth = Math.max(
        ...volumeData.forwards.map(d => 
          Math.max(
            d3.select("body").append("svg").append("text").text(d.inboundChannelSCID).node()?.getBBox().width!
          )
        )
      );

      const maxOutboundSCIDTextWidth = Math.max(
        ...volumeData.forwards.map(d =>
          Math.max(
            d3.select("body").append("svg").append("text").text(d.outboundChannelSCID).node()?.getBBox().width!
          )
        )
      );

      //static labels
      g.append("text")
        .attr("class", "volume-text")
        .attr("x", maxInboundSCIDTextWidth / 2)
        .attr("y", 0)
        .text("Inbound");
      g.append("text")
        .attr("class", "volume-text")
        .attr("x", maxInboundSCIDTextWidth / 2 + barWidth + maxOutboundSCIDTextWidth  + 20)
        .attr("y", 0)
        .text("Outbound");

      const groups = g.selectAll<SVGGElement, [string, Map<string, number>]>("g")
        .data(volumeData.forwards)
        .enter()
        .append("g")
        .attr("class", (d: Forward) => `group-${d.inboundChannelSCID}-${d.outboundChannelSCID}`)
        .attr("transform", (d: Forward, i) => {
          const yPosition = cumulativeHeight;
          cumulativeHeight += yScale(d.outboundSat) + barPadding;
          return `translate(0, ${yPosition})`
        });

      groups.each(function (d: Forward) {
        const row = d3.select(this);

        const incomingSCIDText = row.append("text")
          .attr("class", "volume-header")
          .attr("x", 0)
          .attr("y", yScale(d.outboundSat) / 2)
          .attr("dy", ".35em")
          .text(d.inboundChannelSCID);

        const incomingTextWidth = incomingSCIDText.node()?.getBBox().width!;

        //volume bar
        row.append("rect")
          .attr("class", "bar")
          .attr("x", incomingTextWidth + 10)
          .attr("y", 0)
          .attr("width", barWidth)
          .attr("height", yScale(d.outboundSat))
          .attr("fill", colorScale(d.inboundChannelSCID + d.outboundChannelSCID))
          .on("mouseover", function (event) {
            d3.select(tooltipRef.current)
              .style("visibility", "visible")
              .text(
                `Inbound SCID: ${d.inboundChannelSCID}
                 Inbound PeerId: ${d.inboundPeerId}
                 Inbound PeerAlias: ${d.inboundPeerAlias}
                 Inbound Sats: ${formatSats(d.inboundSat)}
                 Outbound SCID: ${d.outboundChannelSCID}
                 Outbound PeerId: ${d.outboundPeerId}
                 Outbound PeerAlias: ${d.outboundPeerAlias}
                 Outbound Sats: ${formatSats(d.outboundSat)}
                 Routing Profit Sats: ${formatSats(d.feeSat)}`
              );
          })
          .on("mousemove", function (event) {
            d3.select(tooltipRef.current)
              .style("top", `${event.pageY}px`)
              .style("left", `${event.pageX + 10}px`)
          })
          .on("mouseout", function () {
            d3.select(tooltipRef.current)
              .style("visibility", "hidden")
          });

        //outgoingSCIDText
        row.append("text")
          .attr("class", "volume-header")
          .attr("x", incomingTextWidth + 10 + barWidth + 10)
          .attr("y", yScale(d.outboundSat) / 2)
          .attr("dy", ".35em")
          .text(d.outboundChannelSCID);
      });

    }
  }, [volumeData, width]);

  return (
    <div ref={d3Container} />
  );
};

export default VolumeGraph;
