import {
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";
import { isCognitoConfigured } from "./cognitoConfig";
import {
  getAuthUser,
  getDevAuthToken,
  hasDevAuthSession,
  saveDevAuthSession,
} from "./authStorage";

const isDevelopment = import.meta.env.DEV;

function ensureCognitoConfigured() {
  if (!isCognitoConfigured) {
    throw new Error("AWS Cognito is not configured. Add VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_USER_POOL_CLIENT_ID to your .env file.");
  }
}

export async function loginWithCognito({ email, password }) {
  if (!isCognitoConfigured && isDevelopment) {
    saveDevAuthSession({ name: email, email });
    return { isSignedIn: true, nextStep: { signInStep: "DONE" } };
  }

  ensureCognitoConfigured();
  return signIn({ username: email, password });
}

export async function registerWithCognito({ name, email, password }) {
  if (!isCognitoConfigured && isDevelopment) {
    saveDevAuthSession({ name, email });
    return { isSignUpComplete: true, nextStep: { signUpStep: "DONE" } };
  }

  ensureCognitoConfigured();

  return signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        name,
      },
    },
  });
}

export async function confirmCognitoRegistration({ email, code }) {
  if (!isCognitoConfigured && isDevelopment) {
    return { isSignUpComplete: true, nextStep: { signUpStep: "DONE" } };
  }

  ensureCognitoConfigured();
  return confirmSignUp({ username: email, confirmationCode: code });
}

export async function logoutFromCognito() {
  if (!isCognitoConfigured && isDevelopment) {
    return;
  }

  ensureCognitoConfigured();
  await signOut();
}

export async function getAuthenticatedUser() {
  if (!isCognitoConfigured && isDevelopment && hasDevAuthSession()) {
    const user = getAuthUser();
    return {
      username: user?.email ?? "local-dev-user",
      signInDetails: {
        loginId: user?.email ?? "local-dev-user",
      },
    };
  }

  ensureCognitoConfigured();
  return getCurrentUser();
}

export async function getJwtToken() {
  if (!isCognitoConfigured && isDevelopment) {
    return getDevAuthToken();
  }

  ensureCognitoConfigured();
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString() ?? null;
}

export function getAuthErrorMessage(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.name === "UserAlreadyAuthenticatedException") {
    return "You are already signed in.";
  }

  if (error.name === "UserAlreadyExistsException") {
    return "An account already exists with this email.";
  }

  if (error.name === "NotAuthorizedException") {
    return "Incorrect email or password.";
  }

  if (error.name === "UserNotConfirmedException") {
    return "Please verify your email before signing in.";
  }

  if (error.name === "InvalidPasswordException") {
    return error.message;
  }

  return error.message ?? "Authentication failed. Please try again.";
}
