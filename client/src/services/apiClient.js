import axios from "axios";
import { handleLogout } from "../utils/authUtils";

const API_URL = "http://localhost:5000";
// const API_URL = "https://personal-finance-dashboard-x1fy.onrender.com";

export const apiClient = axios.create({ baseURL: API_URL });

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await apiClient.post("api/auth/refresh", { refreshToken });
  return {
    newAccessToken: response.data.accessToken,
    newRefreshToken: response.data.refreshToken,
  };
}

// Interceptor to handle expired token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to token expiration
    if (
      error.response.status === 401 &&
      error.response.data.message === "Token expired or invalid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { newAccessToken, newRefreshToken } = await refreshAccessToken();

        if (newAccessToken && newRefreshToken) {
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Set the Authorization header on the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return apiClient(originalRequest);
        }
      } catch (err) {
        // If refresh token has also expired or failed
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          handleLogout();
        }
      }
    }

    return Promise.reject(error);
  },
);
