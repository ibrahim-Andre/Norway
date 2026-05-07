import { supabase } from "../../../lib/supabase";
import "./EarningsPage.css";
import { useEffect, useState, useCallback } from "react";

export default function DriversEarningsPage() {

  const [drivers, setDrivers] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [period, setPeriod] =
    useState("daily");

  const fetchData = useCallback(async () => {

    setLoading(true);

    try {

      const {
        data: driversData,
        error: driversError,
      } = await supabase
        .from("drivers")
        .select("*")
        .order("full_name");

      if (driversError)
        throw driversError;

      const {
        data: earningsData,
        error: earningsError,
      } = await supabase
        .from("driver_daily_summary")
        .select("*");

      if (earningsError)
        throw earningsError;

      setDrivers(driversData || []);
      setEarnings(earningsData || []);

    } catch (error) {

      console.error(
        "Veri alınamadı:",
        error.message
      );

    }

    setLoading(false);

  }, []);

  useEffect(() => {

    fetchData();

    const channel = supabase
      .channel("income-changes")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_daily_summary",
        },
        () => {
          fetchData();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [fetchData]);

  const calculateTotals = (driverId) => {

    let uber = 0;
    let uberTips = 0;
    let uberCash = 0;

    let bolt = 0;
    let boltTips = 0;

    let sumup = 0;
    let sumupTips = 0;

    const now = new Date();

    earnings.forEach((e) => {

      if (
        String(e.driver_id) !==
        String(driverId)
      ) return;

      const date = new Date(e.date);

      const diffDays = Math.floor(
        (now - date) /
        (1000 * 60 * 60 * 24)
      );

      let include = false;

      if (period === "daily")
        include = diffDays === 0;

      if (period === "weekly")
        include = diffDays <= 7;

      if (period === "monthly")
        include = diffDays <= 30;

      if (period === "yearly")
        include = diffDays <= 365;

      if (!include) return;

      uber += parseFloat(e.uber || 0);

      uberTips += parseFloat(
        e.uber_tips || 0
      );

      uberCash += parseFloat(
        e.uber_cash || 0
      );

      bolt += parseFloat(e.bolt || 0);

      boltTips += parseFloat(
        e.bolt_tips || 0
      );

      sumup += parseFloat(
        e.sumup || 0
      );

      sumupTips += parseFloat(
        e.sumup_tips || 0
      );
    });

    return {

      uber,
      uberTips,
      uberCash,

      bolt,
      boltTips,

      sumup,
      sumupTips,

      total:
        uber +
        uberTips +
        uberCash +
        bolt +
        boltTips +
        sumup +
        sumupTips,
    };
  };

  const handleDelete = async (driverId) => {

    if (!window.confirm("Şoför silinsin mi?"))
      return;

    try {

      await supabase
        .from("drivers")
        .delete()
        .eq("id", driverId);

      fetchData();

    } catch (error) {

      console.error(
        "Silme hatası:",
        error.message
      );
    }
  };

  const handleEdit = (driver) => {

    alert(
      `Düzenle: ${driver.full_name}`
    );
  };

  return (

    <div className="table-container">

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >

        <label
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#111827",
          }}
        >
          Periyot
        </label>

        <select
          value={period}
          onChange={(e) =>
            setPeriod(e.target.value)
          }

          style={{

            padding: "10px 16px",

            borderRadius: "12px",

            border:
              "1px solid #d1d5db",

            background: "#fff",

            fontSize: "14px",
            fontWeight: "500",

            cursor: "pointer",

            outline: "none",

            minWidth: "160px",

            boxShadow:
              "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >

          <option value="daily">
            Günlük
          </option>

          <option value="weekly">
            Haftalık
          </option>

          <option value="monthly">
            Aylık
          </option>

          <option value="yearly">
            Yıllık
          </option>

        </select>

      </div>

      <table className="modern-table">

        <thead>

          <tr>

            <th>Şoför</th>

            <th>Uber</th>

            <th>Uber Tips</th>

            <th>Uber Cash</th>

            <th>Bolt</th>

            <th>Bolt Tips</th>

            <th>SumUp</th>

            <th>SumUp Tips</th>

            <th>Toplam</th>

            <th>İşlemler</th>

          </tr>

        </thead>

        <tbody>

          {loading && (
            <tr>
              <td colSpan="10">
                Yükleniyor...
              </td>
            </tr>
          )}

          {!loading &&
            drivers.length === 0 && (
            <tr>
              <td colSpan="10">
                Kayıt bulunamadı
              </td>
            </tr>
          )}

          {drivers.map((driver) => {

            const totals =
              calculateTotals(driver.id);

            return (

              <tr key={driver.id}>

                <td className="driver-name">
                  {driver.full_name}
                </td>

                <td className="money">
                  {totals.uber} sek
                </td>

                <td className="money">
                  {totals.uberTips} sek
                </td>

                <td className="money">
                  {totals.uberCash} sek
                </td>

                <td className="money">
                  {totals.bolt} sek
                </td>

                <td className="money">
                  {totals.boltTips} sek
                </td>

                <td className="money">
                  {totals.sumup} sek
                </td>

                <td className="money">
                  {totals.sumupTips} sek
                </td>

                <td
                  className="money"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {totals.total} sek
                </td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(driver)
                    }
                  >
                    Düzenle
                  </button>

                  <button
                    className="delete-btn"
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