import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SidebarWrapper = styled.div`
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: #111827;
  color: #fff;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;


export const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 32px;
`;

export const SidebarItem = styled(NavLink)`
  padding: 12px 16px;
  border-radius: 8px;
  color: #d1d5db;
  text-decoration: none;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;

  &.active {
    background: #1f2937;
    color: #fff;
  }

  &:hover {
    background: #1f2937;
    color: #fff;
  }
`;
