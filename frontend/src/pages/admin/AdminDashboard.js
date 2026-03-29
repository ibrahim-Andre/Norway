import { useEffect, useState } from "react";
import styled from 'styled-components';
import { supabase } from "../../lib/supabase";
import MaintenanceOverview from './Dashboard/MaintenanceOverview';
import Header from "../../components/admin/Header";
import StatCard from "../../components/admin/StatCard";



function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

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
        <Header username={admin?.username} />
		

        <Cards>
          <StatCard title="Toplam Sürücü" value={drivers.length} />
          <StatCard
            title="Online Sürücü"
            value={drivers.filter(d => d.is_online).length}
          />
          <StatCard title="Toplam Yolculuk" value="2.382" />
          <StatCard title="Kazanç" value="₺21.300" />
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


