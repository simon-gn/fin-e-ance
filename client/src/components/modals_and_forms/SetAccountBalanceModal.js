import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAccountBalanceAction } from "../../redux/actions/accountBalanceActions";
import styles from "./SetAccountBalanceModal.module.css";

const SetAccountBalanceModal = () => {
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSave = () => {
    dispatch(setAccountBalanceAction({ amount }));
    navigate("/dashboard");
  };

  return (
    <div className={styles.modalOverlay}>
      <form
        className={styles.setAccountBalanceForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <h3>Welcome!</h3>
        <h3>Please set your account balance:</h3>
        <div className={styles.inputContainer}>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SetAccountBalanceModal;
