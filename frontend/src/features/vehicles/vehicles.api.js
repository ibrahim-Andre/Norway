import { supabase } from '../../lib/supabase';

export async function getVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
  console.error('SUPABASE ERROR:', error);
  throw new Error(error.message);
}
  return data;
}

export async function createVehicle(vehicle) {
  const { error } = await supabase
    .from('vehicles')
    .insert([vehicle]);

  if (error) throw error;
}

export async function updateVehicle(id, vehicle) {
  const { error } = await supabase
    .from('vehicles')
    .update(vehicle)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteVehicle(id) {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getVehiclesWithMaintenance() {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      vehicle_maintenances (
        next_maintenance_date
      )
    `);

  if (error) {
  console.error('SUPABASE ERROR:', error);
  throw new Error(error.message);
}
  return data;
}
