import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function AuthGuard({ allowedRole, children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {

      // 1️⃣ Session al
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        navigate("/", { replace: true });
        return;
      }

      const user = data.user;

      // 2️⃣ Profile'den role al
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        navigate("/", { replace: true });
        return;
      }

      if (profile.role === allowedRole) {
        setAllowed(true);
      } else {
        navigate("/", { replace: true });
      }

      setLoading(false);
    };

    checkAuth();
  }, [allowedRole, navigate]);

  if (loading) return <p>Checking permissions...</p>;

  return allowed ? children : null;
}

export default AuthGuard;
