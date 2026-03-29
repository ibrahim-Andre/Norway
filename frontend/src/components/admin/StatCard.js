import styled from "styled-components";

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
`;

const Value = styled.h2`
  margin-top: 10px;
`;

function StatCard({ title, value }) {
  return (
    <Card>
      <p>{title}</p>
      <Value>{value}</Value>
    </Card>
  );
}

export default StatCard;
