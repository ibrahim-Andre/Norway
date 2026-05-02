import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDashboardStats } from '../../../features/dashboard/dashboard.api';

export default function MaintenanceOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <Card>
      <Header>
        <Title>🛠 Bakım Özeti</Title>
      </Header>

      <Grid>
        <Item>
          <Label>Bu Ay Bakım Gideri</Label>
          <Value>💸 {stats.monthlyCost.toLocaleString()} ₺</Value>
        </Item>

        <Item>
          <Label>Yaklaşan Bakımlar</Label>
          <Value>🔔 {stats.upcomingCount} araç</Value>
        </Item>

        <Item>
          <Label>En Çok Masraf Yapan</Label>
          <Value>🚗 {stats.topVehiclePlate}</Value>
        </Item>
      </Grid>
    </Card>
  );
}

/* styles */

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  max-width: 900px;
`;

const Header = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const Item = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Label = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 6px;
`;

const Value = styled.div`
  font-size: 20px;
  font-weight: 700;
`;
