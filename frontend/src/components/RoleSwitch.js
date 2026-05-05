import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";

export default function RoleSwitch({ roles }) {
  const navigate = useNavigate();

  const activeRole = localStorage.getItem("activeRole");

  const goToDriver = () => {
    localStorage.setItem("activeRole", "driver");
    navigate("/driver");
    window.location.reload();
  };

  const goToAdmin = () => {
    localStorage.setItem("activeRole", "admin");
    navigate("/admin/dashboard");
    window.location.reload();
  };

  // 🔥 DRIVER PANELDE → ADMIN GÖSTER
  if (activeRole === "driver" && roles.includes("admin")) {
    return (
      <ListItemButton
        onClick={goToAdmin}
        sx={{
          borderRadius: 2,
          color: "#f87171",
          "&:hover": { backgroundColor: "#1f2937" },
        }}
      >
        <ListItemIcon sx={{ color: "#f87171" }}>
          <AdminPanelSettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Admin Panel" />
      </ListItemButton>
    );
  }

  // 🔥 ADMIN PANELDE → DRIVER GÖSTER
  if (activeRole === "admin" && roles.includes("driver")) {
    return (
      <ListItemButton
        onClick={goToDriver}
        sx={{
          borderRadius: 2,
          color: "#60a5fa",
          "&:hover": { backgroundColor: "#1f2937" },
        }}
      >
        <ListItemIcon sx={{ color: "#60a5fa" }}>
          <DriveEtaIcon />
        </ListItemIcon>
        <ListItemText primary="Driver Panel" />
      </ListItemButton>
    );
  }

  return null;
}