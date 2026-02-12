import axios from "axios";
import { safeLocalStorage, safeSessionStorage } from "./storage";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000/api"
    : "https://sheshri.onrender.com/api",
});

API.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("token") || safeSessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if it's NOT a login or register attempt
    const isAuthEndpoint = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");

    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthEndpoint) {
      safeLocalStorage.removeItem("user");
      safeSessionStorage.removeItem("user");
      safeLocalStorage.removeItem("token");
      safeSessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
