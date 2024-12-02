import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountBalancesAction } from "../../redux/actions/accountBalanceActions";
import { ResponsiveLine } from "@nivo/line";
import styles from "./AccountBalance.module.css";

const AccountBalance = () => {
  const { accountBalances } = useSelector((state) => state.accountBalances);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAccountBalancesAction());
  }, [dispatch]);

  const chartData = [
    {
      id: "AccountBalance",
      data: accountBalances.map((balance) => ({
        x: balance.date,
        y: balance.amount,
      })),
    },
  ];

  return (
    <div className="card">
      <div className={styles.accountBalance}>
        <h3>Account Balance</h3>
        <span className={styles.amount}>
          ${accountBalances[0] ? accountBalances[0].amount.toFixed(2) : null}
        </span>

        <div style={{ width: "100%", height: "80px" }}>
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
        </div>
      </div>
    </div>
  );
};

export default AccountBalance;