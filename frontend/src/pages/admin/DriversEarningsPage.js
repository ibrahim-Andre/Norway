import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DriversEarningsPage() {
  const [drivers, setDrivers] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [salarySettings, setSalarySettings] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const safeNumber = (v) => Number(v) || 0;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      // DRIVERS

      const { data: driversData } = await supabase
        .from("drivers")
        .select("*")
        .order("full_name", { ascending: true });

      // EARNINGS

      let query = supabase
        .from("driver_daily_income")
        .select("*");

      if (startDate) {
        query = query.gte("date", startDate);
      }

      if (endDate) {
        query = query.lte("date", endDate);
      }

      const { data: earningsData } = await query;

      // SALARY SETTINGS

      const { data: salaryData } = await supabase
        .from("driver_salary_settings")
        .select("*");

      setDrivers(driversData || []);
      setEarnings(earningsData || []);
      setSalarySettings(salaryData || []);

    } catch (error) {
      console.error(error);
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

      const amount =
        safeNumber(e.uber) +
        safeNumber(e.bolt) +
        safeNumber(e.sumup);

      if (diffDays === 0) daily += amount;
      if (diffDays <= 7) weekly += amount;
      if (diffDays <= 30) monthly += amount;
      if (diffDays <= 365) yearly += amount;
    });

    return { daily, weekly, monthly, yearly };
  };

  const calculateSalary = (driverId) => {
    const settings = salarySettings.find(
      (s) => s.driver_id === driverId
    );

    if (!settings) return 0;

    let income = 0;
    let tips = 0;

    earnings.forEach((e) => {
      if (e.driver_id !== driverId) return;

      income +=
        safeNumber(e.uber) +
        safeNumber(e.bolt) +
        safeNumber(e.sumup);

      tips +=
        safeNumber(e.uber_tips) +
        safeNumber(e.bolt_tips) +
        safeNumber(e.sumup_tips);
    });

    const baseIncome = income - tips;

    const threshold =
      safeNumber(settings.threshold);

    const percentAbove =
      safeNumber(settings.percent_above) / 100;

    const percentBelow =
      safeNumber(settings.percent_below) / 100;

    const taxPercent =
      safeNumber(settings.tax_percent) / 100;

    let salary = 0;

    if (income > threshold) {
      salary =
        baseIncome *
        percentAbove *
        taxPercent;
    } else {
      salary =
        baseIncome *
        percentBelow *
        taxPercent;
    }

    return Math.round(salary);
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm("Şoför silinsin mi?"))
      return;

    await supabase
      .from("drivers")
      .delete()
      .eq("id", driverId);

    fetchData();
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>Şoför Kazanç Listesi</h1>

      {/* Tarih Filtre */}

      <div style={{ marginBottom: 20 }}>
        <label>Başlangıç:</label>

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(e.target.value)
          }
        />

        <label style={{ marginLeft: 10 }}>
          Bitiş:
        </label>

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(e.target.value)
          }
        />

        <button
          onClick={fetchData}
          style={{ marginLeft: 10 }}
        >
          Filtrele
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>Şoför</th>
            <th>Günlük</th>
            <th>Haftalık</th>
            <th>Aylık</th>
            <th>Yıllık</th>
            <th>Maaş</th>
            <th>İşlemler</th>
          </tr>
        </thead>

        <tbody>

          {drivers.map((driver) => {
            const totals =
              calculateTotals(driver.id);

            const salary =
              calculateSalary(driver.id);

            return (
              <tr key={driver.id}>

                <td>
                  {driver.full_name}
                </td>

                <td>
                  {totals.daily} SEK
                </td>

                <td>
                  {totals.weekly} SEK
                </td>

                <td>
                  {totals.monthly} SEK
                </td>

                <td>
                  {totals.yearly} SEK
                </td>

                <td
                  style={{
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  {salary} SEK
                </td>

                <td>

                  <button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                    }}
                    onClick={() =>
                      handleDelete(driver.id)
                    }
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