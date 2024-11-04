import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategoryAction } from '../redux/actions/categoryActions';

const CategoryModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const dispatch = useDispatch();

  const handleSave = () => {
    const token = localStorage.getItem("accessToken");
    dispatch(addCategoryAction({ name, color }, token));
    onClose();
  };

  return (
    isOpen && (
      <div className="modal">
        <h2>Create Category</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <button onClick={handleSave}>Save</button>
      </div>
    )
  );
};

export default CategoryModal;