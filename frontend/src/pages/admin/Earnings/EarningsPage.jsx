import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"
import "./EarningsPage.css";

export default function DriversEarningsPage() {
  const [drivers, setDrivers] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

  fetchData();

  const channel = supabase
    .channel("income-changes")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "driver_daily_income",
      },
      (payload) => {

        console.log("Yeni kazanç geldi");

        fetchData();

      }
    )

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, []);

  const fetchData = async () => {
  setLoading(true);

  try {

    const { data: driversData, error: driversError } =
      await supabase
        .from("drivers")
        .select("*")
        .order("full_name", { ascending: true });

    if (driversError) throw driversError;

    let query = supabase
      .from("driver_daily_income")
      .select("*");

    if (startDate) {
      query = query.gte("date", startDate);
    }

    if (endDate) {
      query = query.lte("date", endDate);
    }

    const { data: earningsData, error: earningsError } =
      await query;

    if (earningsError) throw earningsError;
    setDrivers(driversData || []);
    setEarnings(earningsData || []);

  } catch (error) {

    console.error(
      "Veri alınamadı:",
      error.message
    );

  }

  setLoading(false);
};

  const calculateTotals = (driverId) => {
  const now = new Date();

  let daily = 0;
  let weekly = 0;
  let monthly = 0;
  let yearly = 0;

  earnings.forEach((e) => {

    if (e.driver_id !== driverId) return;

    const date = new Date(e.date);

    const diffDays = Math.floor(
      (now - date) / (1000 * 60 * 60 * 24)
    );

    const income = Number(e.net_income || 0);

    if (diffDays === 0) daily += income;

    if (diffDays <= 7) weekly += income;

    if (diffDays <= 30) monthly += income;

    if (diffDays <= 365) yearly += income;

  });

  return {
    daily,
    weekly,
    monthly,
    yearly
  };
};

  const handleDelete = async (driverId) => {
    if (!window.confirm("Şoför silinsin mi?")) return;

    try {
      await supabase
        .from("drivers")
        .delete()
        .eq("id", driverId);

      fetchData();
    } catch (error) {
      console.error("Silme hatası:", error.message);
    }
  };

  const handleEdit = (driver) => {
    alert(`Düzenle: ${driver.full_name}`);
  };

  return (
    <div className="table-container">

  <table className="modern-table">

    <thead>
      <tr>
        <th>Şoför</th>
        <th>Günlük</th>
        <th>Haftalık</th>
        <th>Aylık</th>
        <th>Yıllık</th>
        <th>İşlemler</th>
      </tr>
    </thead>

    <tbody>

      {loading && (
        <tr>
          <td colSpan="6">
            Yükleniyor...
          </td>
        </tr>
      )}

      {!loading && drivers.length === 0 && (
        <tr>
          <td colSpan="6">
            Kayıt bulunamadı
          </td>
        </tr>
      )}

      {drivers.map((driver) => {

        const totals = calculateTotals(driver.id);

        return (
          <tr key={driver.id}>

            <td className="driver-name">
              {driver.full_name}
            </td>

            <td className="money">
              {totals.daily} ₺
            </td>

            <td className="money">
              {totals.weekly} ₺
            </td>

            <td className="money">
              {totals.monthly} ₺
            </td>

            <td className="money">
              {totals.yearly} ₺
            </td>

            <td>

              <button
                className="edit-btn"
                onClick={() => handleEdit(driver)}
              >
                Düzenle
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(driver.id)}
              >
                Sil
              </button>

            </td>

          </tr>
        );

      })}

    </tbody>

  </table>

</div>
  );
}
