import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DriversEarningsPage() {
  const [drivers, setDrivers] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      // Drivers çek
      const { data: driversData, error: driversError } = await supabase
        .from("drivers")
        .select("*")
        .order("name", { ascending: true });

      if (driversError) throw driversError;

      // Earnings çek
      let query = supabase
        .from("driver_daily_income")
        .select("*");

      if (startDate) {
        query = query.gte("date", startDate);
      }

      if (endDate) {
        query = query.lte("date", endDate);
      }

      const { data: earningsData, error: earningsError } = await query;

      if (earningsError) throw earningsError;

      setDrivers(driversData || []);
      setEarnings(earningsData || []);
    } catch (error) {
      console.error("Veri alınamadı:", error.message);
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

      if (diffDays === 0) daily += Number(e.amount);
      if (diffDays <= 7) weekly += Number(e.amount);
      if (diffDays <= 30) monthly += Number(e.amount);
      if (diffDays <= 365) yearly += Number(e.amount);
    });

    return { daily, weekly, monthly, yearly };
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
    alert(`Düzenle: ${driver.name}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Şoför Kazanç Listesi</h1>

      {/* Tarih Filtre */}
      <div style={{ marginBottom: 20 }}>
        <label>Başlangıç Tarihi:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label style={{ marginLeft: 10 }}>Bitiş Tarihi:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          onClick={fetchData}
          style={{ marginLeft: 10 }}
        >
          Filtrele
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
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
          {drivers.map((driver) => {
            const totals = calculateTotals(driver.id);

            return (
              <tr key={driver.id}>
                <td>{driver.name}</td>

                <td>{totals.daily} ₺</td>
                <td>{totals.weekly} ₺</td>
                <td>{totals.monthly} ₺</td>
                <td>{totals.yearly} ₺</td>

                <td>
                  <button
                    onClick={() => handleEdit(driver)}
                    style={{ marginRight: 5 }}
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={() => handleDelete(driver.id)}
                    style={{ backgroundColor: "red", color: "white" }}
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
