import * as d3 from 'd3';
import { useEffect, useRef } from "react";
import { Account } from "../../../../types/lightning-bookkeeper.type";

function BalanceSheetTable({ balanceSheetData }) {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current && balanceSheetData) {

      d3.select(d3Container.current).selectAll('*').remove();

      var balanceSheet = balanceSheetData.balanceSheet;

      if (balanceSheet && Array.isArray(balanceSheet.accounts)) {
        console.log("start balanceSheetData table: " + JSON.stringify(balanceSheet.accounts));

        const table = d3.select(d3Container.current).append('table')
          .style("border-collapse", "collapse")
          .style("border", "2px black solid");

        const headers = Object.keys(balanceSheet.accounts[0]);
        table.append("thead").append("tr")
          .selectAll("th")
          .data(headers)
          .enter().append("th")
          .text(function (d) { return d; })
          .style("border", "1px black solid")
          .style("padding", "5px")
          .style("background-color", "lightgray")
          .style("font-weight", "bold")
          .style("text-transform", "uppercase");

        const rows = table.append("tbody")
          .selectAll<HTMLElement, Account>("tr")
          .data(balanceSheet.accounts)
          .enter().append("tr");

          headers.forEach((header) => {
            rows.append("td")
              .text((account: any) => String(account[header]))
              .style("border", "1px black solid")
              .style("padding", "5px")
              .on("mouseover", function () {
                d3.select(this).style("background-color", "#EBEFF9");
              })
              .on("mouseout", function () {
               d3.select(this).style("background-color", "white");
              });
          });
      }
    }
  }, [balanceSheetData]);

  return (
    <div ref={d3Container} />
  );
};

export default BalanceSheetTable;
