import axios from "axios";
import { getJwtToken } from "../features/auth/authService";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
  timeout: 60000,
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
    formData.append("file", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const careerApi = {
  recommendations: (payload) => api.post("/recommendations/", payload),
  skillGap: (payload) => api.post("/profile/skill-gap", payload),
  learningRoadmap: (payload) => api.post("/profile/learning-path", payload),
  dashboard: (payload) => api.post("/dashboard/", payload),
  marketTrends: (payload) => api.post("/trends/compare", payload),
  trendingSkills: (payload) => api.post("/trends/trending-skills", payload),
  careerAdvice: (payload) => api.post("/career-advice", payload),
};
