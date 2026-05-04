import { useEffect, useState } from "react";
import styled from 'styled-components';
import { supabase } from "../../lib/supabase";
import MaintenanceOverview from './Dashboard/MaintenanceOverview';
import StatCard from "../../components/admin/StatCard";
import UpcomingPaymentsWidget from "./components/UpcomingPaymentsWidget";


function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [, setAdmin] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
	  const { data } = await supabase
  .from("trips")
  .select("fare");

const total =
  data?.reduce((sum, t) => sum + Number(t.fare), 0) || 0;

setTotalEarnings(total);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      setAdmin(profile);

      const { data: driversData } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "driver");

      setDrivers(driversData || []);
    };

    loadData();
  }, []);

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
    value="2.382"
    icon="🚗"
    color="#9333ea"
  />

  <StatCard
  title="Toplam Kazanç"
  value={`₺${totalEarnings.toLocaleString()}`}
/>

  <MaintenanceOverview />
</Cards>

        <List>
          <h3>Sürücüler</h3>
          {drivers.map(d => (
            <p key={d.id}>
              {d.username} — {d.is_online ? "🟢 Online" : "🔴 Offline"}
            </p>
          ))}
        </List>
      </Content>
    </Layout>
  );
}

export default AdminDashboard;


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


