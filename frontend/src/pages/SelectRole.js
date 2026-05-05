import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function SelectRole() {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRoles = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("roles")
        .eq("id", user.id)
        .single();

      setRoles(profile.roles);
    };

    getRoles();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Panel Seç</h2>

      {roles.includes("admin") && (
        <button onClick={() => navigate("/admin")}>
          Admin Panel
        </button>
      )}

      {roles.includes("driver") && (
        <button onClick={() => navigate("/driver")}>
          Driver Panel
        </button>
      )}
    </div>
  );
}

export default SelectRole;