import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesAction,
  deleteCategoryAction,
} from "../redux/actions/categoryActions";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import styles from "./CategoriesPage.module.css";

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleRemoveCategory = (categoryId) => {
    dispatch(deleteCategoryAction(categoryId));
  };

  const handleOpenAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
  };

  const handleCloseAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  return (
    <div className={styles.categoriesPage}>
      {!isAddCategoryModalOpen && (
        <div className={styles.addCategoryButton}>
          <button onClick={handleOpenAddCategoryModal}>New Category</button>
        </div>
      )}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={handleCloseAddCategoryModal}
      />

      <div className={styles.categoriesPageBox}>
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li
              key={category._id}
              className={`${styles.categoryCard} ${selectedCategory === category._id ? styles.selected : ""}`}
              onClick={() => handleCategoryClick(category._id)}
              style={{ backgroundColor: category.color }}
            >
              <div className={styles.categoryName}>{category.name}</div>
              {selectedCategory === category._id && (
                <button
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCategory(category._id);
                  }}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesPage;
