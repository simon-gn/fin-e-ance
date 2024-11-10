// import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { handleLogout } from "../utils/authUtils";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  // const [showTransactionsSubmenu, setShowTransactionsSubmenu] = useState(false);
  // const [showCategoriesSubmenu, setShowCategoriesSubmenu] = useState(false);

  // const toggleTransactionsSubmenu = () => {
  //   setShowTransactionsSubmenu(!showTransactionsSubmenu);
  // };

  // const toggleCategoriesSubmenu = () => {
  //   setShowCategoriesSubmenu(!showCategoriesSubmenu);
  // };

  return (
    <div className={styles.sidebar}>
      <Link to="/dashboard" className={styles.sidebarHeader}>
        fin(e)ance.
      </Link>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        {/* <li>
          <div onClick={toggleTransactionsSubmenu} className="sidebar-item">
            Transactions
          </div>
          {showTransactionsSubmenu && (
            <ul className="submenu"> */}
        <li>
          <Link to="/transactions">Transactions</Link>
        </li>
        {/* </ul>
          )}
        </li>
        <li>
          <div onClick={toggleCategoriesSubmenu} className="sidebar-item">
            Categories
          </div>
          {showCategoriesSubmenu && (
            <ul className="submenu"> */}
        <li>
          <Link to="/categories">Categories</Link>
        </li>
        {/* </ul>
          )}
        </li> */}
      </ul>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Sidebar;
