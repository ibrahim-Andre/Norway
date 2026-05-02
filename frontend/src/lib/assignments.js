import { supabase } from "./supabase";

// Araç ata
export async function assignVehicle(driverId, vehicleId) {
  const { data, error } = await supabase
    .from("driver_vehicle_assignments")
    .insert({
      driver_id: driverId,
      vehicle_id: vehicleId,
      is_active: true
    });

  if (error) throw error;
  return data;
}

// Araç kaldır
export async function unassignVehicle(driverId, vehicleId) {
  const { data, error } = await supabase
    .from("driver_vehicle_assignments")
    .update({
      is_active: false,
      unassigned_at: new Date()
    })
    .eq("driver_id", driverId)
    .eq("vehicle_id", vehicleId)
    .eq("is_active", true);

  if (error) throw error;
  return data;
}

// Driver'ın aktif araçları
export async function getDriverVehicles(driverId) {
  const { data, error } = await supabase
    .from("driver_vehicle_assignments")
    .select("vehicles(*)")
    .eq("driver_id", driverId)
    .eq("is_active", true);

  if (error) throw error;
  return data;
}
