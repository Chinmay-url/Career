import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthenticatedUser } from "./authService";

export default function PublicOnlyRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      try {
        await getAuthenticatedUser();

        if (isMounted) {
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

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
