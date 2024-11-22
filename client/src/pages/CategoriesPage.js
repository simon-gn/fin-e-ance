import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategoryAction } from "../redux/actions/categoryActions";
import AddCategoryForm from "../components/modals_and_forms/AddCategoryForm";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import styles from "./CategoriesPage.module.css";

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] = useState(false);

  const { categories } = useSelector((state) => state.categories);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const dispatch = useDispatch();
  const handleRemoveCategory = (categoryId) => {
    dispatch(deleteCategoryAction(categoryId));
  };

  const handleOpenAddCategoryForm = () => {
    setIsAddCategoryFormOpen(true);
  };

  const handleCloseAddCategoryForm = () => {
    setIsAddCategoryFormOpen(false);
  };

  return (
    <div className={styles.categoriesPage}>
      <AddCategoryForm
        isOpen={isAddCategoryFormOpen}
        onClose={handleCloseAddCategoryForm}
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
        {!isAddCategoryFormOpen && (
          <li
            className={styles.addCategoryButton}
            onClick={handleOpenAddCategoryForm}
          >
            <AiOutlinePlusCircle size={42} />
          </li>
        )}
      </ul>
    </div>
  );
};

export default CategoriesPage;
