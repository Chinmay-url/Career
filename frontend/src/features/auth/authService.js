import axios from "axios";
import {
  clearAuthSession,
  getAuthToken,
  getAuthUser,
  getDevAuthToken,
  hasDevAuthSession,
  saveBackendAuthSession,
  saveDevAuthSession,
} from "./authStorage";

const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export async function loginWithBackend({ email, password }) {
  try {
    const { data } = await authClient.post("/auth/login", { email, password });
    saveBackendAuthSession({
      token: data.access_token,
      user: data.user,
    });
    return data;
  } catch (error) {
    if (isDevelopment && !error.response) {
      saveDevAuthSession({ name: email, email });
      return { access_token: getDevAuthToken(), user: { name: email, email } };
    }
    throw error;
  }
}

export async function registerWithBackend({ name, email, password }) {
  try {
    const { data } = await authClient.post("/auth/register", { name, email, password });
    saveBackendAuthSession({
      token: data.access_token,
      user: data.user,
    });
    return { ...data, isSignUpComplete: true, nextStep: { signUpStep: "DONE" } };
  } catch (error) {
    if (isDevelopment && !error.response) {
      saveDevAuthSession({ name, email });
      return { isSignUpComplete: true, nextStep: { signUpStep: "DONE" } };
    }
    throw error;
  }
}

export async function logoutFromBackend() {
  clearAuthSession();
}

export async function getAuthenticatedUser() {
  const token = getAuthToken();

  if (token) {
    const { data } = await authClient.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  if (isDevelopment && hasDevAuthSession()) {
    const user = getAuthUser();
    return user ?? { name: "Local Developer", email: "local@example.com" };
  }

  throw new Error("No active session");
}

export async function getJwtToken() {
  return getAuthToken() ?? getDevAuthToken();
}

export function getAuthErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail) && detail[0]?.msg) {
    return detail[0].msg;
  }

  if (!error?.response && isDevelopment) {
    return "Backend is not reachable. Local development auth can be used only after retrying.";
  }

  return error?.message ?? "Authentication failed. Please try again.";
}
