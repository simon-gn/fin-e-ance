import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useSelector } from 'react-redux';

const CategoryBreakdownChart = () => {
  const { transactions } = useSelector((state) => state.transactions);

  const expenses = transactions.filter(transaction => transaction.type === 'Expense');

  // Calculate total per category
  const categoryTotals = expenses.reduce((acc, transaction) => {
    const category = transaction.category.name;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([category, amount]) => ({
    id: category,
    label: category,
    value: amount,
  }));

  return (
    <div style={{ height: '500px' }}>
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={3}
        colors={{ scheme: 'pastel1' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        radialLabel={(d) => `${d.id} (${d.value})`}
        sliceLabel={(d) => `${d.value}`}
        slicesLabelsSkipAngle={10}
        radialLabelsLinkColor={{ from: 'color' }}
        radialLabelsTextColor="#333333"
      />
    </div>
  );
};

export default CategoryBreakdownChart;
