import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  confirmCognitoRegistration,
  getAuthErrorMessage,
  loginWithCognito,
  registerWithCognito,
} from "./authService";
import { saveAuthSession } from "./authStorage";
import { isCognitoConfigured } from "./cognitoConfig";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [pendingUser, setPendingUser] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const user = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const result = await registerWithCognito(user);

      if (result.nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
        setPendingUser(user);
        return;
      }

      await loginWithCognito(user);
      saveAuthSession(user);
      navigate("/dashboard");
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirm(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await confirmCognitoRegistration({
        email: pendingUser.email,
        code: formData.get("code"),
      });

      await loginWithCognito(pendingUser);
      saveAuthSession(pendingUser);
      navigate("/dashboard");
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (pendingUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas px-4">
        <form onSubmit={handleConfirm} className="w-full max-w-md rounded-lg border border-line bg-surface p-8 shadow-soft">
          <p className="text-sm font-semibold text-accent">CareerAI</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Verify your email</h1>
          <p className="mt-3 text-sm text-slate-400">Enter the confirmation code sent to {pendingUser.email}.</p>
          {error && (
            <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
          <input className="focus-ring mt-6 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" name="code" placeholder="Confirmation code" required />
          <button className="focus-ring mt-6 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify and continue"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-line bg-surface p-8 shadow-soft">
        <p className="text-sm font-semibold text-accent">CareerAI</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Create your profile</h1>
        {!isCognitoConfigured && (
          <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-amber-100">
            Local development auth is active. Configure Cognito env values before production deployment.
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}
        <div className="mt-6 space-y-4">
          <input className="focus-ring w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" name="name" placeholder="Full name" required />
          <input className="focus-ring w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" name="email" placeholder="Email" type="email" required />
          <input className="focus-ring w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" name="password" placeholder="Password" type="password" required />
        </div>
        <button className="focus-ring mt-6 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already registered? <Link className="font-semibold text-accent" to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
