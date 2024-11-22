import { useState } from "react";
import { Link } from "react-router-dom";
import { handleLogout } from "../../utils/authUtils";
import AddTransactionModal from "../modals/AddTransactionModal";
import styles from "./DesktopNav.module.css";

const DesktopNav = () => {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
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
        <li>
          <Link to="/transactions">Transactions</Link>
        </li>
        <li>
          <Link to="/categories">Categories</Link>
        </li>
      </ul>

      <button onClick={toggleAddTransactionModal}>New Transaction</button>
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={toggleAddTransactionModal}
      />

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
