import * as d3 from 'd3';
import { useEffect, useRef } from "react";
import { BalanceSheetAccount } from "../../../../types/lightning-balancesheet.type";

function BalanceSheetTable({ balanceSheetData }) {
  const d3Container = useRef(null);

  useEffect(() => {
    d3.select(d3Container.current).selectAll("*").remove();
    if (d3Container.current && balanceSheetData.periods.length > 0) {
      const tableBodyDiv = d3.select(d3Container.current).append("div")
      .style("height", "300px")
      .style("overflow-y", "auto");

      const table = tableBodyDiv.append('table')
        .style("border-collapse", "collapse")
        .style("border", "1px black solid");

      const headers = Object.keys(balanceSheetData.periods[balanceSheetData.periods.length - 1].accounts[0]);
      table.append("thead").append("tr")
        .selectAll("th")
        .data(headers)
        .enter().append("th")
        .text(function (d) { return d; })
        .style("border", "1px black solid")
        .style("padding", "5px")
        .style("background-color", "#CCA103")
        .style("font-weight", "bold")
        .style("text-transform", "uppercase");

      const rows = table.append("tbody")
        .selectAll<HTMLElement, BalanceSheetAccount>("tr")
        .data(balanceSheetData.periods[balanceSheetData.periods.length - 1].accounts) // display the last period aka the most current balances.
        .enter()
        .append("tr")
        .on("mouseover", function () {
          d3.select(this).style("background-color", "#EBEFF9");
        })
        .on("mouseout", function () {
          d3.select(this).style("background-color", "white");
        });

      headers.forEach((header) => {
        rows.append("td")
          .text((row: any) => {
            if (header === 'balance') {
              return `${row[header].toFixed(3)} sats`; //format so msats are .000
            } else {
              return String(row[header])
            }
          })
          .style("border", "1px black solid")
          .style("padding", "5px");
      });
    } else {
      //no data, leave table blank.
    }
  }, [balanceSheetData]);

  return (
    <div ref={d3Container} />
  );
};

export default BalanceSheetTable;
