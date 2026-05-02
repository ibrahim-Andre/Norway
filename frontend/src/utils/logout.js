import { supabase } from "../lib/supabase";

const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};

export default logout;
