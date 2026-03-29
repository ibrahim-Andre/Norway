import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

const drawerWidth = 240;

export default function DriverLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: "auto" }}>
                    <List>
                        <ListItem button onClick={() => navigate("/driver")}>
                            <ListItemText primary="Dashboard" />
                        </ListItem>

                        <ListItem button onClick={() => navigate("/driver/vehicles")}>
                            <ListItemText primary="Vehicles" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1 }}>
                {/* Header */}
                <AppBar position="static">
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">Driver Panel</Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 4 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
