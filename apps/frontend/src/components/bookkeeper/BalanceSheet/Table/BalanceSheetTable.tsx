import * as d3 from 'd3';
import { useEffect, useRef } from "react";
import { BalanceSheetAccount } from "../../../../types/lightning-balancesheet.type";
import { format } from 'd3-format';
import './BalanceSheetTable.scss';

function BalanceSheetTable({ balanceSheetData }) {
  const d3Container = useRef(null);
  const formatBalance = format(',.3f');

  useEffect(() => {
    d3.select(d3Container.current).selectAll("*").remove();
    if (d3Container.current && balanceSheetData.periods.length > 0) {
      const tableBodyDiv = d3.select(d3Container.current).append("div")
      .style("height", "300px")
      .style("overflow-y", "auto");

      const table = tableBodyDiv.append('table')

      const headers = Object.keys(balanceSheetData.periods[balanceSheetData.periods.length - 1].accounts[0]);
      table.append("thead").append("tr")
        .selectAll("th")
        .data(headers)
        .enter().append("th")
        .text(function (d) { return d; })
        .style("padding", "5px")
        .style("text-transform", "uppercase");

      const rows = table.append("tbody")
        .selectAll<HTMLElement, BalanceSheetAccount>("tr")
        .data(balanceSheetData.periods[balanceSheetData.periods.length - 1].accounts) // display the last period aka the most current balances.
        .enter()
        .append("tr");

      headers.forEach((header) => {
        rows.append("td")
          .text((row: any) => {
            if (header === 'balance') {
              return `${formatBalance(row[header])} sats`; //format so msats are .000
            } else {
              return String(row[header])
            }
          })
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
