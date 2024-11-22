import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { validateTokenAPI } from "../services/authAPI";
import { useDispatch } from "react-redux";
import { fetchTransactionsAction } from "../redux/actions/transactionActions";
import { fetchCategoriesAction } from "../redux/actions/categoryActions";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await validateTokenAPI(token);
        setIsValid(response.data.valid);
      } catch (err) {
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isValid) {
      try {
        dispatch(fetchTransactionsAction());
        dispatch(fetchCategoriesAction());
      } catch (err) {
        console.error(err);
      }
    }
  }, [isValid, dispatch]);

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  return isValid ? children : <Navigate to="/" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
