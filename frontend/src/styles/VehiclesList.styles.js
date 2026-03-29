import styled from 'styled-components';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const Left = styled.div``;

export const Plate = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

export const Meta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Btn = styled.button`
  background: ${({ $danger, theme }) =>
    $danger ? '#fee2e2' : '#e0e7ff'};
  color: ${({ $danger }) =>
    $danger ? '#991b1b' : '#1e3a8a'};

  border: none;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  font-size: 13px;
`;
