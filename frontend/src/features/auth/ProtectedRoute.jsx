import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthenticatedUser } from "./authService";
import { saveAuthSession } from "./authStorage";

export default function ProtectedRoute() {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      try {
        const user = await getAuthenticatedUser();

        if (isMounted) {
          saveAuthSession({
            name: user.name ?? user.email ?? "CareerAI User",
            email: user.email ?? user.username ?? "user@example.com",
          });
          setStatus("authenticated");
        }
      } catch {
        if (isMounted) {
          setStatus("anonymous");
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas px-4 text-sm text-slate-300">
        Checking secure session...
      </main>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
