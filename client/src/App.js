import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DesktopNav from "./components/navigation_bars/DesktopNav";
import MobileNav from "./components/navigation_bars/MobileNav";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SetAccountBalanceModal from "./components/modals_and_forms/SetAccountBalanceModal";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  document.documentElement.setAttribute("data-theme", "dark");
  window.isMobile = window.innerWidth <= 480;

  return (
    <div className={`${styles.app} ${!isAuthPage ? styles.withNav : ""}`}>
      {!isAuthPage && (window.isMobile ? <MobileNav /> : <DesktopNav />)}
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/setAccountBalance"
            element={
              <ProtectedRoute>
                <SetAccountBalanceModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
