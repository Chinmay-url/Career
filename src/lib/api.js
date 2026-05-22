import axios from "axios";
import { getJwtToken } from "../features/auth/authService";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getJwtToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
};

export const resumeApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  parsedSkills: () => api.get("/resume/skills"),
};

export const careerApi = {
  recommendations: () => api.get("/recommendations"),
  skillGap: () => api.get("/skill-gap"),
  marketTrends: () => api.get("/market-trends"),
  learningRoadmap: () => api.get("/learning-roadmap"),
  dashboard: () => api.get("/dashboard"),
};
