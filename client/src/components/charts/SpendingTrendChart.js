import { ResponsiveLine } from "@nivo/line";
import { useSelector } from "react-redux";
import { processMonthlySpendingData } from "../../utils/transactionUtils";

const SpendingTrendChart = () => {
  const { transactions } = useSelector((state) => state.transactions);

  const data = processMonthlySpendingData(transactions);

  const chartData = [
    {
      id: "Spending",
      color: "hsl(220, 70%, 50%)",
      data: data.map((d) => ({ x: d.month, y: d.spending })),
    },
  ];

  return (
    <div className="card">
      <h3>Spending Trend</h3>
      <div style={{ height: "500px" }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 70, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Month",
            legendOffset: 60,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            legend: "Spending ($)",
            legendOffset: -50,
            legendPosition: "middle",
          }}
          colors={{ datum: "color" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          theme={{
            grid: {
              line: {
                stroke: "var(--text_color)",
              },
            },
            axis: {
              ticks: {
                text: {
                  fill: "var(--text_color)",
                },
              },
              legend: {
                text: {
                  fill: "var(--text_color)",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SpendingTrendChart;
