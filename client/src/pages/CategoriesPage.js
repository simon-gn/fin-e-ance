import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesAction,
  deleteCategoryAction,
} from "../redux/actions/categoryActions";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import styles from "./CategoriesPage.module.css";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";

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
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={handleCloseAddCategoryModal}
      />

      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li
            key={category._id}
            className={`${styles.categoryCard} ${selectedCategory === category._id ? styles.selected : ""}`}
            onClick={() => handleCategoryClick(category._id)}
            style={{ backgroundColor: category.color }}
          >
            <div className={styles.categoryCardContent}>
              <div className={styles.categoryName}>{category.name}</div>
              {selectedCategory === category._id && (
                <div
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCategory(category._id);
                  }}
                >
                  <AiOutlineDelete size={20} />
                </div>
              )}
            </div>
          </li>
        ))}
        {!isAddCategoryModalOpen && (
          <li
            className={styles.addCategoryButton}
            onClick={handleOpenAddCategoryModal}
          >
            <AiOutlinePlusCircle size={42} />
          </li>
        )}
      </ul>
    </div>
  );
};

export default CategoriesPage;
