import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDashboardStats } from '../../../features/dashboard/dashboard.api';

export default function MaintenanceStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <Grid>
      <Card>
        <Title>Bu Ay Bakım Gideri</Title>
        <Value>💸 {stats.monthlyCost.toLocaleString()} ₺</Value>
      </Card>

      <Card>
        <Title>Yaklaşan Bakımlar</Title>
        <Value>🔔 {stats.upcomingCount} araç</Value>
      </Card>

      <Card>
        <Title>En Çok Masraf Yapan</Title>
        <Value>🚗 {stats.topVehiclePlate}</Value>
      </Card>
    </Grid>
  );
}

/* styles */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;


const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;


const Title = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Value = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

