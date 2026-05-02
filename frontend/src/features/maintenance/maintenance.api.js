import { supabase } from '../../lib/supabase';

export async function getMaintenances(vehicleId) {
  const { data, error } = await supabase
    .from('vehicle_maintenances')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('maintenance_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addMaintenance(data) {
  const { error } = await supabase
    .from('vehicle_maintenances')
    .insert([data]);

  if (error) {
    console.error('ADD MAINTENANCE ERROR:', error);
    throw error;
  }
}

export async function updateMaintenance(id, data) {
  const { error } = await supabase
    .from('vehicle_maintenances')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('UPDATE MAINTENANCE ERROR:', error);
    throw error;
  }
}

export async function deleteMaintenance(id) {
  const { error } = await supabase
    .from('vehicle_maintenances')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

