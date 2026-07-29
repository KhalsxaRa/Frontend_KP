import axios from "axios";

const getBaseUrl = () => {
  const url = "https://backendkp-production-660e.up.railway.app/api";
    return url;
  
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

