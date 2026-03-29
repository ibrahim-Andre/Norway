import { supabase } from "./supabase";

export async function getAllDrivers() {
  const { data, error } = await supabase
    .from("drivers")
    .select("id, full_name");

  if (error) throw error;

  return data;
}
