import styled, { keyframes } from 'styled-components';

const slide = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const Drawer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 360px;
  background: #fff;
  padding: 24px;
  animation: ${slide} .25s ease-out;
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
`;
