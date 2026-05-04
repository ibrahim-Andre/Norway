import { supabase } from '../../lib/supabase';

export async function addExpense(data) {
  const { error } = await supabase
    .from('vehicle_expenses')
    .insert([data]);

  if (error) throw error;
}

export async function getExpenses(vehicleId) {
  const { data, error } = await supabase
    .from('vehicle_expenses')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}


export async function getMonthlyReport(month) {
  const start = new Date(month);
  start.setDate(1);

  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const { data, error } = await supabase
    .from('vehicle_expenses')
    .select('amount, type, vehicle_id, created_at')
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString());

  if (error) throw error;

  // 🔹 toplam
  const total = data.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // 🔹 kategori
  const byType = {};
  data.forEach(e => {
    byType[e.type] =
      (byType[e.type] || 0) + Number(e.amount);
  });

  // 🔹 araç bazlı (ID)
  const byVehicleRaw = {};
  data.forEach(e => {
    byVehicleRaw[e.vehicle_id] =
      (byVehicleRaw[e.vehicle_id] || 0) + Number(e.amount);
  });

  // 🔥 plakaları çek
  const vehicleIds = Object.keys(byVehicleRaw);

  let vehicleMap = {};

  if (vehicleIds.length > 0) {
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('id, plate')
      .in('id', vehicleIds);

    vehicles.forEach(v => {
      vehicleMap[v.id] = v.plate;
    });
  }

  // 🔥 plate map
  const byVehicle = {};
  Object.entries(byVehicleRaw).forEach(([id, amount]) => {
    const plate = vehicleMap[id] || id;
    byVehicle[plate] = amount;
  });

  // ✅ RETURN MUTLAKA FONKSİYON İÇİNDE
  return {
    total,
    byType,
    byVehicle,
  };
}