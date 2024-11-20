import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiFillHome,
  AiOutlineAppstore,
  AiOutlinePlus,
  AiOutlineLogout,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import AddTransactionModal from "./modals/AddTransactionModal";
import { handleLogout } from "../utils/authUtils";
import styles from "./MobileNav.module.css";

const MobileNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <div className={styles.mobileNav}>
        <Link to="/dashboard" className={styles.navIcon}>
          <AiFillHome size={24} />
          <span>Dashboard</span>
        </Link>
        <Link to="/transactions" className={styles.navIcon}>
          <AiOutlineUnorderedList size={24} />
          <span>Transactions</span>
        </Link>

        <button className={styles.addButton} onClick={toggleModal}>
          <AiOutlinePlus size={32} />
        </button>

        <Link to="/categories" className={styles.navIcon}>
          <AiOutlineAppstore size={24} />
          <span>Categories</span>
        </Link>
        <div className={styles.navIcon} onClick={handleLogout}>
          <AiOutlineLogout size={24} />
          <span>Logout</span>
        </div>
      </div>

      <AddTransactionModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

export default MobileNav;
