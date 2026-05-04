import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMonthlyReport } from '../../../features/expenses/expenses.api';

export default function MonthlyReport() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [report, setReport] = useState(null);

  useEffect(() => {
    getMonthlyReport(month + '-01').then(setReport);
  }, [month]);

  if (!report) return null;

  return (
    <Card>
      <Header>
        <h3>📊 Aylık Rapor</h3>

        <MonthInput
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </Header>

      <Total>
        💰 Toplam: {report.total.toLocaleString()} ₺
      </Total>

      <Section>
        <h4>Kategori Bazlı</h4>
        {Object.entries(report.byType).map(([k, v]) => (
          <Row key={k}>
            <span>{k}</span>
            <strong>{v.toLocaleString()} ₺</strong>
          </Row>
        ))}
      </Section>

      <Section>
        <h4>Araç Bazlı</h4>
        {Object.entries(report.byVehicle).map(([k, v]) => (
          <Row key={k}>
            <span>{k}</span>
            <strong>{v.toLocaleString()} ₺</strong>
          </Row>
        ))}
      </Section>
    </Card>
  );
}

/* styles */

const Card = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MonthInput = styled.input`
  padding: 6px;
`;

const Total = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin: 10px 0;
`;

const Section = styled.div`
  margin-top: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
`;