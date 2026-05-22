import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem("career_auth_token", "demo-token");
    navigate("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-line bg-surface p-8 shadow-soft">
        <p className="text-sm font-semibold text-accent">CareerAI</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Create your profile</h1>
        <div className="mt-6 space-y-4">
          <input className="focus-ring w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" placeholder="Full name" required />
          <input className="focus-ring w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" placeholder="Email" type="email" required />
          <input className="focus-ring w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none" placeholder="Password" type="password" required />
        </div>
        <button className="focus-ring mt-6 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-slate-950">Create account</button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already registered? <Link className="font-semibold text-accent" to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
