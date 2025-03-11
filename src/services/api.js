import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    console.log("Token attached to request:", token);
    req.headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("⚠ No token found in localStorage! API request might fail.");
  }

  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;
