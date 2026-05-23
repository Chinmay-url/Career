import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuthErrorMessage, loginWithBackend } from "./authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/dashboard";
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      await loginWithBackend({
        email,
        password: formData.get("password"),
      });

      navigate(redirectTo, { replace: true });
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-line bg-surface p-8 shadow-soft">
        <p className="text-sm font-semibold text-accent">CareerAI</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-3 text-sm text-slate-400">Sign in with the FastAPI backend account you created.</p>
        {error && (
          <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}
        <div className="mt-6 space-y-4">
          <input className="focus-ring w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" name="email" placeholder="Email" type="email" required />
          <input className="focus-ring w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" name="password" placeholder="Password" type="password" required />
        </div>
        <button className="focus-ring mt-6 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          New here? <Link className="font-semibold text-accent" to="/register">Create account</Link>
        </p>
      </form>
    </main>
  );
}
