import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "production" || process.env.REACT_APP_VERCEL === "true"
    ? "" 
    : (process.env.REACT_APP_API_URL ?? "http://localhost:4000"),
  withCredentials: true,
});

// Request interceptor: Add JWT to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh on login/register calls
    if (error.response?.status === 401 && !originalRequest.url?.includes("/auth/")) {
      try {
        const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:4000";
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;