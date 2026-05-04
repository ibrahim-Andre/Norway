import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PaymentsIcon from "@mui/icons-material/Payments";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, useTheme, useMediaQuery } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

const drawerWidth = 260;

export default function AdminLayout() {
	const getTitle = (pathname) => {
  switch (pathname) {
    case "/admin":
      return "Dashboard";
    case "/admin/drivers":
      return "Şoförler";
    case "/admin/vehicles":
      return "Araçlar";
    case "/admin/earnings":
      return "Kazançlar";
    case "/admin/invoices":
      return "Faturalar";
	case "/admin/stats":
	  return "İstatistik";
    default:
      return "Admin Panel";
  }
};
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [admin, setAdmin] = useState(null);
  
  

  useEffect(() => {
    const loadAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("admins")
        .select("full_name, role")
        .eq("auth_user_id", user.id)
        .single();

      setAdmin(data);
    };

    loadAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin",
    },
    {
      text: "Şoförler",
      icon: <PeopleIcon />,
      path: "/admin/drivers",
    },
    {
      text: "Araçlar",
      icon: <DirectionsCarIcon />,
      path: "/admin/vehicles",
    },
    {
      text: "Kazançlar",
      icon: <PaymentsIcon />,
      path: "/admin/earnings",
    },
	{
	  text: "Faturalar",
	  icon: <PaymentsIcon />,
	  path: "/admin/invoices",
},
{
  text: "İstatistik",
  icon: <DashboardIcon />,
  path: "/admin/stats",
},
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* SIDEBAR */}

      <Drawer
  variant={isMobile ? "temporary" : "permanent"}
  open={isMobile ? mobileOpen : true}
  onClose={() => setMobileOpen(false)}
  sx={{
    width: drawerWidth,
    flexShrink: 0,

    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      background: "#111827",
      color: "white",
    },
  }}
>
        {/* USER INFO */}

        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #374151",
          }}
        >
          <Typography fontWeight="bold" fontSize={18}>
            👤 {admin?.full_name || "Admin"}
          </Typography>

          <Typography fontSize={13} sx={{ opacity: 0.7 }}>
            {admin?.role || "Admin Panel"}
          </Typography>
        </Box>

        {/* MENU */}

        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 1,

                "&.Mui-selected": {
                  backgroundColor: "#2563eb",
                },

                "&:hover": {
                  backgroundColor: "#1f2937",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 2, background: "#374151" }} />

        {/* LOGOUT */}

        <Box sx={{ px: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: "#f87171",

              "&:hover": {
                backgroundColor: "#1f2937",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#f87171" }}>
              <LogoutIcon />
            </ListItemIcon>

            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* MAIN */}

      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            background: "white",
            color: "black",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Toolbar>

  {isMobile && (
    <IconButton
      edge="start"
      onClick={() => setMobileOpen(true)}
      sx={{ mr: 2 }}
    >
      <MenuIcon />
    </IconButton>
  )}

  <Typography variant="h6" fontWeight="bold">
  {getTitle(location.pathname)}
</Typography>

</Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}