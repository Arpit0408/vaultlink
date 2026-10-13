import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:2300";
  }
  return "https://vaultlink-1b13.onrender.com";
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vaultlink-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
