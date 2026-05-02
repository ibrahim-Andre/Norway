import styled from 'styled-components';

export const MaintenanceBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;

  background: ${({ $urgent }) =>
    $urgent ? '#fee2e2' : '#ffedd5'};

  color: ${({ $urgent }) =>
    $urgent ? '#991b1b' : '#9a3412'};
`;
