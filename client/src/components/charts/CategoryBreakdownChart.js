import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { calculateExpensesByCategory } from "../../utils/transactionUtils";

const CategoryBreakdownChart = ({ transactions }) => {
  const expensesByCategory = calculateExpensesByCategory(transactions, 15);

  const data = expensesByCategory.map(({ category, total }) => ({
    id: category,
    label: category,
    value: total,
  }));

  return (
    <div style={{ height: 250 }}>
      <ResponsivePie
        data={data}
        margin={{ top: 30, right: 30, bottom: 30, left: -80 }}
        innerRadius={0.7}
        padAngle={0.5}
        cornerRadius={3}
        // colors={{ scheme: 'nivo' }}
        colors={["#37c3c8", "#ffc542", "#ff575f", "#ba68c8"]}
        enableArcLinkLabels={false}
        radialLabelsSkipAngle={10}
        enableSlicesLabels={false}
        animate={true}
        theme={{
          labels: { text: { fontWeight: "var(--text_color)" } },
        }}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: -40,
            translateY: 0,
            itemsSpacing: 18,
            itemWidth: 0,
            itemHeight: 18,
            itemTextColor: "var(--text_color)",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 14,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default CategoryBreakdownChart;
