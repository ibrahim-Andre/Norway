import styled from 'styled-components';

export default function VehicleMaintenanceTimeline({ items, onEditMaintenance, onDeleteMaintenance }) {
  if (!items.length) {
    return <Empty>Henüz bakım kaydı yok</Empty>;
  }

  return (
    <Timeline>
      {items.map((m, i) => (
        <Item key={m.id}>
          <Dot />
          {i !== items.length - 1 && <Line />}

          <Content>
  <DateText>{formatDate(m.maintenance_date)}</DateText>
  <Operations>{m.operations}{m.cost && (
  <Cost>💸 {m.cost.toLocaleString()} ₺</Cost>
)}
</Operations>
  

  {m.next_maintenance_date && (
    <Next>
      Sonraki bakım: {formatDate(m.next_maintenance_date)}
    </Next>
  )}

  <Actions>
    <ActionBtn onClick={() => onEditMaintenance(m)}>✏️ Düzenle</ActionBtn>
    <ActionBtn danger onClick={() => onDeleteMaintenance(m)}> 🗑 Sil </ActionBtn>
  </Actions>
</Content>

        </Item>
      ))}
    </Timeline>
  );
}

/* yardımcı */
function formatDate(value) {
  if (!value) return '-';
  return new window.Date(value).toLocaleDateString('tr-TR');
}


/* styles */

const Timeline = styled.div`
  margin-top: 16px;
`;

const Item = styled.div`
  position: relative;
  padding-left: 32px;
  margin-bottom: 20px;
`;

const Dot = styled.div`
  position: absolute;
  left: 6px;
  top: 6px;
  width: 10px;
  height: 10px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
`;

const Line = styled.div`
  position: absolute;
  left: 10px;
  top: 20px;
  width: 2px;
  height: calc(100% - 20px);
  background: #e5e7eb;
`;

const Content = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const DateText = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
`;


const Operations = styled.div`
  font-size: 14px;
  margin-bottom: 6px;
`;

const Next = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Empty = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionBtn = styled.button`
  background: ${({ danger }) => (danger ? '#fee2e2' : '#e0e7ff')};
  color: ${({ danger }) => (danger ? '#991b1b' : '#1e3a8a')};
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
`;
const Cost = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #065f46;
  margin-top: 4px;
`;
