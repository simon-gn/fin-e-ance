import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from './components/Sidebar';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  return (
    <div className={`${styles.app} ${!isAuthPage ? styles.withSidebar : ''}`}>
      {!isAuthPage && <Sidebar />}
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            }
          />
          <Route path="/transactions" element={
              <ProtectedRoute><TransactionsPage /></ProtectedRoute>
            }
          />
          <Route path="/categories" element={
              <ProtectedRoute><CategoriesPage /></ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
