import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./SizeChart.scss";

function SizeChart(props) {
  const [table, setTable] = useState(props?.sizeChart);

  var colors = [];
  for (var i = 0; i < table?.length; i++) {
    colors.push({
      border_color: table[i]?.border_color,
      grid_bg_color: table[i]?.grid_bg_color,
      grid_header_color: table[i]?.grid_header_color,
      grid_text_color: table[i]?.grid_text_color,
      header_bg_color: table[i]?.header_bg_color,
    });
  }
  // console.log("Color Array", colors);
  // console.log("Table State", table);
  return (
    <div className="sizechart-container">
      {table.map((sizechart, key) => (
        <div key={key}>
          <h3 key={key}>{sizechart.title} </h3>
          <div>
            <table style={{ borderColor: colors[key].border_color }} key={key}>
              <tbody
                style={{
                  backgroundColor: colors[key].grid_bg_color,
                  color: colors[key].grid_text_color,
                }}
              >
                {sizechart.chart.map((tablerows, index) => (
                  // console.log("Table Rows", sizechart),

                  <tr key={index}>
                    {tablerows.values.map((tablecoloums, indexj) => (
                      // console.log("Table Coloumns", tablecoloums),
                      <td
                        className={
                          (indexj == 0 && sizechart.first_column_heading) ||
                          (index == 0 && sizechart.first_row_heading)
                            ? "bold"
                            : ""
                        }
                        style={
                          index == 0
                            ? {
                                backgroundColor: colors[key].header_bg_color,
                                color: colors[key].grid_header_color,
                              }
                            : null
                        }
                        key={indexj}
                      >
                        {tablecoloums.column}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SizeChart;
