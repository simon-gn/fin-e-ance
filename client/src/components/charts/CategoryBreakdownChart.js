import React from "react";
import { ResponsivePie } from "@nivo/pie";
import PropTypes from "prop-types";
import { calculateExpensesByCategory } from "../../utils/transactionUtils";
import styles from "./CategoryBreakdownChart.module.css"

const CategoryBreakdownChart = ({ transactions }) => {
  const expensesByCategory = calculateExpensesByCategory(transactions, 15);

  const data = expensesByCategory.map(({ category, total, color }) => ({
    id: category,
    label: category,
    value: total,
    color: color,
  }));

  const renderCustomLegend = () => (
    <div className={styles.legendWrapper}>
      {data.map((d) => (
        <div key={d.id} className={styles.legendItem}>
          <span
            className={styles.legendIcon}
            style={{ backgroundColor: d.color }}
          ></span>
          <span title={d.label}>{d.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper}>
        <ResponsivePie
          data={data}
          margin={{ right: 50, left: 10 }}
          innerRadius={0.7}
          padAngle={0.5}
          cornerRadius={3}
          colors={({ data }) => data.color}
          enableArcLinkLabels={false}
          arcLabelsSkipAngle={15}
          animate={true}
          theme={{
            labels: { text: { fontWeight: "var(--text_color)" } },
          }}
        />
      </div>
      {renderCustomLegend()}
    </div>
  );
};

CategoryBreakdownChart.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default CategoryBreakdownChart;
