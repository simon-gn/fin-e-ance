import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getDateRange } from "../../utils/miscUtils";
import { AiFillCalendar } from "react-icons/ai";
import styles from "./DateFilterBar.module.css";

const DateFilterBar = ({ setDateRange }) => {
  const [filterOption, setFilterOption] = useState("1m");
  const [customDateRange, setCustomDateRange] = useState({
    start: null,
    end: null,
  });

  const handleFilterChange = useCallback(
    (option) => {
      setFilterOption(option);
      const { startDate, endDate } = getDateRange(
        option,
        customDateRange.start,
        customDateRange.end,
      );
      setDateRange({ startDate, endDate });
    },
    [customDateRange, setDateRange],
  );

  const handleCustomDateChange = (start, end) => {
    setCustomDateRange({ start, end });
  };

  useEffect(() => {
    handleFilterChange(filterOption);
  }, [customDateRange, filterOption, handleFilterChange]);

  return (
    <div>
      <div className={styles.dateFilterBarOptions}>
        <div
          onClick={() => handleFilterChange("1m")}
          className={filterOption === "1m" ? styles.active : ""}
        >
          1m
        </div>
        <div
          onClick={() => handleFilterChange("3m")}
          className={filterOption === "3m" ? styles.active : ""}
        >
          3m
        </div>
        <div
          onClick={() => handleFilterChange("6m")}
          className={filterOption === "6m" ? styles.active : ""}
        >
          6m
        </div>
        <div
          onClick={() => handleFilterChange("1y")}
          className={filterOption === "1y" ? styles.active : ""}
        >
          1y
        </div>
        <div
          onClick={() => handleFilterChange("all")}
          className={filterOption === "all" ? styles.active : ""}
        >
          All
        </div>
        <div
          onClick={() => setFilterOption("custom")}
          className={filterOption === "custom" ? styles.active : ""}
        >
          <AiFillCalendar />
        </div>
      </div>

      {filterOption === "custom" && (
        <div className={styles.customDateInputs}>
          <div className={styles.dateInputGroup}>
            <label htmlFor="custom-start-date">Start Date</label>
            <input
              type="date"
              value={customDateRange.start || ""}
              onChange={(e) =>
                handleCustomDateChange(e.target.value, customDateRange.end)
              }
            />
          </div>
          <div className={styles.dateInputGroup}>
            <label htmlFor="custom-end-date">End Date</label>
            <input
              type="date"
              value={customDateRange.end || ""}
              onChange={(e) =>
                handleCustomDateChange(customDateRange.start, e.target.value)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

DateFilterBar.propTypes = {
  setDateRange: PropTypes.func.isRequired,
};

export default DateFilterBar;
