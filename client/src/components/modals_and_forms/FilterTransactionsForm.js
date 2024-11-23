import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDateRange } from "../../utils/miscUtils";
import PropTypes from "prop-types";
import styles from "./FilterTransactionsForm.module.css";

const FilterTransactionsForm = ({ setDateRange, setType, setCategory }) => {
  const [dateFilterOption, setDateFilterOption] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    start: null,
    end: null,
  });

  const { categories } = useSelector((state) => state.categories);

  const handleFilterChange = useCallback(
    (option) => {
      setDateFilterOption(option);
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
    handleFilterChange(dateFilterOption);
  }, [customDateRange, dateFilterOption, handleFilterChange]);

  return (
    <form>
      <div className={styles.filterForm}>
        <div>
          <label htmlFor="filter-date-range">Date</label>
          <select
            id="filter-date-range"
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7d">Last 7 Days</option>
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Month</option>
            <option value="6m">Last 6 Month</option>
            <option value="1y">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            name="filterCategory"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-type">Type</label>
          <select
            id="filter-type"
            name="filterType"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
      </div>

      {dateFilterOption === "custom" && (
        <div className={styles.dateInputsContainer}>
          <div>
            <label htmlFor="custom-start-date">Start Date</label>
            <input
              type="date"
              id="custom-start-date"
              value={customDateRange.start || ""}
              onChange={(e) =>
                handleCustomDateChange(e.target.value, customDateRange.end)
              }
            />
          </div>
          <div>
            <label htmlFor="custom-end-date">End Date</label>
            <input
              type="date"
              id="custom-end-date"
              value={customDateRange.end || ""}
              onChange={(e) =>
                handleCustomDateChange(customDateRange.start, e.target.value)
              }
            />
          </div>
        </div>
      )}
    </form>
  );
};

FilterTransactionsForm.propTypes = {
  setDateRange: PropTypes.func.isRequired,
  setType: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default FilterTransactionsForm;
