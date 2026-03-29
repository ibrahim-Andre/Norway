import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const DriverHeader = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">Welcome back</p>
        <h1 className="text-xl font-semibold text-gray-800">
          {profile?.full_name}
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </header>
  );
};

export default DriverHeader;
