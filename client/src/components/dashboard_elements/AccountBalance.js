import PropTypes from "prop-types";
import { ResponsiveLine } from "@nivo/line";
import styles from "./AccountBalance.module.css";

const AccountBalance = ({ accountBalances }) => {
  const hasData = accountBalances && accountBalances.length > 0;

  const chartData = hasData
    ? [
        {
          id: "AccountBalance",
          data: accountBalances
            .slice()
            .reverse()
            .map((balance, index) => ({
              x: index,
              y: balance.amount,
            })),
        },
      ]
    : [];

  return (
    <div className="card">
      <div className={styles.accountBalance}>
        <h3>Account Balance</h3>
        <span className={styles.amount}>
          ${hasData ? accountBalances[0].amount.toFixed(2) : null}
        </span>

        <div style={{ width: "100%", height: "80px" }}>
          {hasData && (
            <ResponsiveLine
              data={chartData}
              margin={{ top: 15, right: 0, bottom: 10, left: 0 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
              }}
              curve="natural"
              axisTop={null}
              axisRight={null}
              axisBottom={null}
              axisLeft={null}
              enableGridX={false}
              enableGridY={false}
              enablePoints={false}
              isInteractive={false}
              legends={[]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

AccountBalance.propTypes = {
  accountBalances: PropTypes.array.isRequired,
};

export default AccountBalance;
