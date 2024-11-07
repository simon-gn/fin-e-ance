import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useSelector } from 'react-redux';
import { processMonthlyIncomeExpense } from '../utils/transactionUtils';

const IncomeExpenseComparisonChart = () => {
  const { transactions } = useSelector((state) => state.transactions);
  
  const data = processMonthlyIncomeExpense(transactions);

  const chartData = Object.keys(data).map((monthKey) => {
    const [year, month] = monthKey.split('-');
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
    return {
      month: `${monthName} ${year}`,
      Income: data[monthKey].income,
      Expense: data[monthKey].expense,
    };
  });

  return (
    <div style={{ height: '500px' }}>
      <ResponsiveBar
        data={chartData}
        keys={['Income', 'Expense']}
        indexBy="month"
        margin={{ top: 20, right: 90, bottom: 70, left: 60 }}
        padding={0.3}
        // colors={{ scheme: 'pastel2' }}
        colors={({ id, data }) => (id === 'Income' ? '#76c7c0' : '#ff6b6b')}
        colorBy="id"
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 60,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Amount ($)',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default IncomeExpenseComparisonChart;
