import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function AuthGuard({ allowedRoles, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/", { replace: true });
        return;
      }

      const activeRole = localStorage.getItem("activeRole");

      if (!allowedRoles.includes(activeRole)) {
        navigate("/", { replace: true });
        return;
      }
    };

    checkAuth();
  }, [allowedRoles, navigate]);

  return children;
}

export default AuthGuard;