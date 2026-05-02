import styled from 'styled-components';

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;

  padding: 12px 18px;
  border-radius: 14px;
  border: none;

  font-weight: 600;
  cursor: pointer;

  box-shadow: 0 10px 20px rgba(37,99,235,.35);
  transition: all .2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(37,99,235,.45);
  }
`;

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;

  width: 56px;
  height: 56px;
  border-radius: 50%;

  background: #2563eb;
  color: white;

  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 12px 30px rgba(37,99,235,.45);
  transition: transform .2s ease;

  &:hover {
    transform: scale(1.08);
  }
`;
