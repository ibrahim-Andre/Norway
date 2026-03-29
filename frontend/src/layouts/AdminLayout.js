import Sidebar from "../components/admin/Sidebar";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: 32px;
  background: #f5f6fa;
  overflow-y: auto;
`;

const AdminLayout = ({ children }) => {
  return (
    <Layout>
      <Sidebar />
      <Main>
        <Content><Outlet /></Content>
      </Main>
    </Layout>
  );
};

export default AdminLayout;
