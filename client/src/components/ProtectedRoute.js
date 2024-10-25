import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { validateTokenAPI } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('accessToken');

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

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  return isValid ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
