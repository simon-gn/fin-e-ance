import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategoryAction } from '../redux/actions/categoryActions';
import styles from "./AddCategoryModal.module.css";

const AddCategoryModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(addCategoryAction({ name, color }));
    onClose();
  };

  return (
    isOpen && (
      <form className={styles.addCategoryForm} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
          <label htmlFor="categoryColor">Color:</label>
          <input 
            id="categoryColor"
            name="categoryColor"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            />
        </div>
        <div className={styles.buttonLayout}>
          <button type="submit">Add Category</button>
          <button
            type="button"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </form>
      )
  );
};

export default AddCategoryModal;