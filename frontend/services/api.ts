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
