import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverEarningsPage() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const user = await supabase.auth.getUser();

      const driverId = user.data.user.id;

      const { data, error } = await supabase
        .from("driver_daily_income")
        .select("*")
        .eq("driver_id", driverId)
        .order("date", { ascending: false });

      if (error) throw error;

      setEarnings(data);

    } catch (err) {
      console.error("Kazanç çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: 20 }}>

      <h2>Kazançlarım</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Kazanç</th>
            <th>Açıklama</th>
          </tr>
        </thead>

        <tbody>
          {earnings.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.amount} ₺</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}