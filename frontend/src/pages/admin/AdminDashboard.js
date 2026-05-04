import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../../lib/supabase";
import MaintenanceOverview from "./Dashboard/MaintenanceOverview";
import StatCard from "../../components/admin/StatCard";
import MonthlyReport from './Vehicles/MonthlyReport';

function AdminDashboard() {

  const [drivers, setDrivers] = useState([]);
  const [, setAdmin] = useState(null);

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [tripCount, setTripCount] = useState(0);

  const [invoiceStats, setInvoiceStats] = useState({
    total: 0,
    paid: 0,
    overdue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const { data: { user } } =
      await supabase.auth.getUser();

    // 👤 ADMIN

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    setAdmin(profile);

    // 🚕 DRIVERS

    const { data: driversData } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "driver");

    setDrivers(driversData || []);

    // 🚗 TRIPS (BOLT + UBER)

    const { data: trips } = await supabase
      .from("trips")
      .select("fare, platform");

    let total = 0;

    trips?.forEach((t) => {
      total += Number(t.fare || 0);
    });

    setTotalEarnings(total);

    // toplam trip sayısı
    setTripCount(trips?.length || 0);

    // 💸 INVOICES (GİDERLER)

    const { data: invoices } = await supabase
      .from("invoices")
      .select("*");

    let totalInv = 0;
    let paid = 0;
    let overdue = 0;

    const today = new Date();

    invoices?.forEach((inv) => {

      const amount = Number(inv.amount || 0);

      totalInv += amount;

      if (inv.status === "paid") {
        paid += amount;
      }

      if (
        inv.status !== "paid" &&
        new Date(inv.payment_date) < today
      ) {
        overdue += amount;
      }

    });

    setInvoiceStats({
      total: totalInv,
      paid,
      overdue,
    });

  };

  return (

    <Layout>

      <Content>

        <Cards>

          <StatCard
            title="Toplam Sürücü"
            value={drivers.length}
            icon="👤"
            color="#2563eb"
          />

          <StatCard
            title="Online Sürücü"
            value={drivers.filter(d => d.is_online).length}
            icon="🚕"
            color="#16a34a"
          />

          <StatCard
            title="Toplam Yolculuk"
            value={tripCount}
            icon="🚗"
            color="#9333ea"
          />

          <StatCard
            title="Toplam Kazanç"
            value={`₺${totalEarnings.toLocaleString()}`}
            icon="💰"
            color="#f59e0b"
          />

          {/* GİDERLER */}

          <StatCard
            title="Toplam Gider"
            value={`₺${invoiceStats.total.toLocaleString()}`}
            icon="💸"
            color="#ef4444"
          />

          <StatCard
            title="Ödenen Gider"
            value={`₺${invoiceStats.paid.toLocaleString()}`}
            icon="✅"
            color="#22c55e"
          />

          <StatCard
            title="Geciken Ödeme"
            value={`₺${invoiceStats.overdue.toLocaleString()}`}
            icon="⚠️"
            color="#dc2626"
          />

          <MaintenanceOverview />

        </Cards>

        {/* DRIVER LIST */}

        <List>

          <h3>Sürücüler</h3>

          {drivers.map((d) => (

            <p key={d.id}>

              {d.username} —{" "}
              {d.is_online
                ? "🟢 Online"
                : "🔴 Offline"}

            </p>

          ))}

        </List>

      </Content>
	  <MonthlyReport />

    </Layout>

  );

}

export default AdminDashboard;

// STYLE

const Layout = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
  background: #f3f4f6;
  min-height: 100vh;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const List = styled.div`
  background: white;
  border-radius: 14px;
  padding: 20px;
`;