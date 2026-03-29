import { SidebarWrapper, SidebarItem, Logo } from "./Sidebar.styles";

const Sidebar = () => {

  return (
    <SidebarWrapper>
      <Logo>🚕 Taxi Admin</Logo>

      <SidebarItem to="/admin/dashboard">📊 Dashboard</SidebarItem>
      <SidebarItem to="/admin/drivers">👤 Driver</SidebarItem>
      <SidebarItem to="/admin/vehicles">🚗 Araçlar</SidebarItem>
      <SidebarItem to="/admin/settings">⚙️ Ayarlar</SidebarItem>
    </SidebarWrapper>
  );
};

export default Sidebar;
