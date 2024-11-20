import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { addCategoryAction } from "../../redux/actions/categoryActions";
import { COLORS_CATEGORIES } from "../../styles/theme";
import styles from "./AddCategoryModal.module.css";

const AddCategoryModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(addCategoryAction({ name, color }));
    onClose();
  };

  return (
    isOpen && (
      <form
        className={styles.addCategoryForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <label htmlFor="categoryName">Name:</label>
          <input
            id="categoryName"
            name="categoryName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Color:</label>
          <div className={styles.colorOptions}>
            {COLORS_CATEGORIES.map((col) => (
              <div
                key={col}
                className={`${styles.colorOption} ${color === col ? styles.selected : ""}`}
                style={{ backgroundColor: col }}
                onClick={() => setColor(col)}
              />
            ))}
            <div>
              <input 
                type="color"
                label="hiddenColorPicker"
                id="hiddenColorPicker"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className={styles.hiddenColorPicker}
              />
              <div
                className={styles.colorOption}
                style={{ backgroundColor: color }}
                onClick={() => document.getElementById('hiddenColorPicker').click()}
              />
            </div>
          </div>
        </div>
        <div className={styles.buttonLayout}>
          <button type="submit">Add</button>
          <button type="button" onClick={() => onClose()}>
            Cancel
          </button>
        </div>
      </form>
    )
  );
};

AddCategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddCategoryModal;
