import React from "react";
import PropTypes from "prop-types";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ transactions }) => {
  // Group and sum transactions by category
  const data = transactions.reduce((acc, transaction) => {
    const existingCategory = acc.find(
      (item) => item.category === transaction.category,
    );
    if (existingCategory) {
      existingCategory.amount += transaction.amount;
    }
    // If the category doesn't exist yet, add a new entry
    else {
      acc.push({ category: transaction.category, amount: transaction.amount });
    }
    return acc;
  }, []);

  return (
    <ResponsiveBar
      data={data}
      keys={["amount"]}
      indexBy="category"
      margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "pastel1" }}
      colorBy="indexValue"
      borderRadius={4}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Amount",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Category",
        legendPosition: "middle",
        legendOffset: 40,
      }}
      enableGridY={false}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

BarChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default BarChart;
