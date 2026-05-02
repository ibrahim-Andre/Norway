import styled from 'styled-components';

export const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  margin-top: 20px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const FormTitle = styled.h4`
  margin-bottom: 16px;
  font-size: 16px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
`;

export const Label = styled.label`
  font-size: 13px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Input = styled.input`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid #e5e7eb;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid #e5e7eb;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SaveButton = styled.button`
  width: 100%;
  margin-top: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;
