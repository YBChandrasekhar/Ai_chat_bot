import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sendMessage = (content: string, sessionId?: string) =>
  API.post("/chat/message", { content, sessionId });

export const getChatHistory = () => API.get("/chat/history");

export const register = (name: string, email: string, password: string) =>
  API.post("/auth/register", { name, email, password });

export const login = (email: string, password: string) =>
  API.post("/auth/login", { email, password });

export const getPreferences = () => API.get("/preferences");

export const updatePreferences = (data: { theme: string; chatbotName: string; category: string }) =>
  API.put("/preferences", data);

export const rateMessage = (messageId: string, rating: "like" | "dislike") =>
  API.put(`/preferences/rate/${messageId}`, { rating });

export const getAdminAnalytics = () => API.get("/admin/analytics");
export const getAdminUsers = () => API.get("/admin/users");
export const toggleUserStatus = (userId: string) => API.put(`/admin/users/${userId}/toggle`);
export const makeAdmin = (userId: string) => API.put(`/admin/users/${userId}/make-admin`);
