import { useState } from "react";
import { Link } from "react-router-dom";
import { handleLogout } from "../../utils/authUtils";
import AddTransactionModal from "../modals_and_forms/AddTransactionModal";
import styles from "./DesktopNav.module.css";

const DesktopNav = () => {
  const [isTransactionsPageSelected, setIsTransactionsPageSelected] =
    useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);

  const toggleTransactionsPageSelection = () => {
    setIsTransactionsPageSelected((prev) => !prev);
  };
  const toggleAddTransactionModal = () => {
    setIsAddTransactionModalOpen((prev) => !prev);
  };

  return (
    <div className={styles.desktopNav}>
      <Link to="/dashboard" className={styles.desktopNavHeader}>
        fin(e)ance.
      </Link>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li onClick={toggleTransactionsPageSelection}>
          <Link to="/transactions">Transactions</Link>
          {isTransactionsPageSelected && (
            <div
              className={styles.desktopNavItem}
              onClick={toggleAddTransactionModal}
            >
              Add Transaction
            </div>
          )}
        </li>
        <li>
          <Link to="/categories">Categories</Link>
        </li>
      </ul>

      {isAddTransactionModalOpen && (
        <AddTransactionModal
          isOpen={isAddTransactionModalOpen}
          onClose={toggleAddTransactionModal}
        />
      )}

      <button
        className={styles.logoutButton}
        type="button"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default DesktopNav;
