import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
} from "@mui/material";

export default function DriverPanel() {
  const [driver, setDriver] = useState(null);
  useEffect(() => {
  document.title = "Dashboard";
}, []);

  useEffect(() => {
    const loadDriver = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("drivers")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      setDriver(data);
	  

    };

    loadDriver();
  }, []);

  if (!driver) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {/* Welcome */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Welcome Back
          </Typography>
          <Typography variant="h4">
            {driver.full_name}
          </Typography>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Phone
              </Typography>
              <Typography variant="h6">
                {driver.phone}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Status
              </Typography>
              <Chip
                label={driver.status}
                color={driver.status === "active" ? "success" : "error"}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Earnings
              </Typography>
              <Typography variant="h6">
                0 SEK
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
