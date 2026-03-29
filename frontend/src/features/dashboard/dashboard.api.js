import { supabase } from '../../lib/supabase';

export async function getDashboardStats() {
  // Bakım verileri
  const { data: maintenances, error } = await supabase
    .from('vehicle_maintenances')
    .select('cost, next_maintenance_date, vehicle_id');

  if (error) throw error;

  // 1️⃣ Bu ay toplam bakım maliyeti
  const monthlyCost = maintenances.reduce((sum, m) => {
    if (!m.cost) return sum;
    return sum + Number(m.cost);
  }, 0);

  // 2️⃣ Bakımı yaklaşan araç sayısı (30 gün)
  const today = new Date();
  const upcomingCount = maintenances.filter(m => {
    if (!m.next_maintenance_date) return false;
    const d = new Date(m.next_maintenance_date);
    return (d - today) / (1000 * 60 * 60 * 24) <= 30;
  }).length;

  // 3️⃣ Araç bazlı toplam gider
  const byVehicle = {};
  maintenances.forEach(m => {
    if (!m.cost) return;
    byVehicle[m.vehicle_id] =
      (byVehicle[m.vehicle_id] || 0) + Number(m.cost);
  });

  const topVehicleId = Object.keys(byVehicle).sort(
    (a, b) => byVehicle[b] - byVehicle[a]
  )[0];

  // Eğer hiç bakım yoksa
  if (!topVehicleId) {
    return {
      monthlyCost,
      upcomingCount,
      topVehiclePlate: '-'
    };
  }

  // 🔥 PLAKAYI ÇEK
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('plate')
    .eq('id', topVehicleId)
    .single();

  if (vehicleError) {
    return {
      monthlyCost,
      upcomingCount,
      topVehiclePlate: '-'
    };
  }

  return {
    monthlyCost,
    upcomingCount,
    topVehiclePlate: vehicle?.plate || '-'
  };
}
