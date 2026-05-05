import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useUserRoles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const getRoles = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("roles")
        .eq("id", user.id)
        .single();

      if (data?.roles) {
        setRoles(data.roles);
      }
    };

    getRoles();
  }, []);

  return roles;
}