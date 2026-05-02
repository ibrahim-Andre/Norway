import styled from "styled-components";

const Card = styled.div`
  background: white;
  padding: 22px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);

  display: flex;
  align-items: center;
  gap: 16px;

  transition: 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 26px rgba(0,0,0,0.08);
  }
`;

const Icon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ color }) => color || "#2563eb"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
`;

const Title = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const Value = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

function StatCard({ title, value, icon, color }) {
  return (
    <Card>
      <Icon color={color}>{icon}</Icon>

      <div>
        <Title>{title}</Title>
        <Value>{value}</Value>
      </div>
    </Card>
  );
}

export default StatCard;