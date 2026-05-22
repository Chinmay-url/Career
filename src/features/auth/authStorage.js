const AUTH_USER_KEY = "career_auth_user";
const DEV_AUTH_TOKEN_KEY = "career_dev_auth_token";

export function getAuthUser() {
  const user = localStorage.getItem(AUTH_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function getDevAuthToken() {
  return localStorage.getItem(DEV_AUTH_TOKEN_KEY);
}

export function hasDevAuthSession() {
  return Boolean(getDevAuthToken());
}

export function saveAuthSession(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function saveDevAuthSession(user) {
  localStorage.setItem(DEV_AUTH_TOKEN_KEY, "local-development-token");
  saveAuthSession(user);
}

export function clearAuthSession() {
  localStorage.removeItem(DEV_AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}
