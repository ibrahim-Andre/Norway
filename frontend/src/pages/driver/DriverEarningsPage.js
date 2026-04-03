import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";

export default function DriverEarningsPage() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalTips, setTotalTips] = useState(0);
  const [salary, setSalary] = useState(0);

  const safeNumber = (v) => Number(v) || 0;

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const getDaysInMonth = (m, y) => {
    return new Date(y, m, 0).getDate();
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // DRIVER ID

      const { data: driver } = await supabase
        .from("drivers")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (!driver) return;

      const startDate = `${year}-${month
        .toString()
        .padStart(2, "0")}-01`;

      const endDate = `${year}-${month
        .toString()
        .padStart(2, "0")}-${getDaysInMonth(
        month,
        year
      )}`;

      // DATA

      const { data } = await supabase
        .from("driver_daily_income")
        .select("*")
        .eq("driver_id", driver.id)
        .gte("date", startDate)
        .lte("date", endDate);

      const days = getDaysInMonth(month, year);

      let incomeSum = 0;
      let tipsSum = 0;

      const fullRows = [];

      for (let day = 1; day <= days; day++) {
        const date = `${year}-${month
          .toString()
          .padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;

        const record = data?.find(
          (d) => d.date === date
        );

        const uber = safeNumber(record?.uber);
        const bolt = safeNumber(record?.bolt);
        const sumup = safeNumber(record?.sumup);

        const uberTips = safeNumber(record?.uber_tips);
        const boltTips = safeNumber(record?.bolt_tips);
        const sumupTips = safeNumber(record?.sumup_tips);

        const total =
          uber +
          bolt +
          sumup +
          uberTips +
          boltTips +
          sumupTips;

        incomeSum += uber + bolt + sumup;
        tipsSum += uberTips + boltTips + sumupTips;

        fullRows.push({
          date,
          uber,
          bolt,
          sumup,
          uberTips,
          boltTips,
          sumupTips,
          total,
        });
      }

      setRows(fullRows);
      setTotalIncome(incomeSum);
      setTotalTips(tipsSum);

      // SETTINGS

      const { data: settings } = await supabase
        .from("settings")
        .select("admin_percentage, tax_percentage")
        .single();

      const adminPercent =
        safeNumber(settings?.admin_percentage) / 100;

      const taxPercent =
        safeNumber(settings?.tax_percentage) / 100;

      const salaryValue =
        (incomeSum - tipsSum) *
        adminPercent *
        taxPercent;

      setSalary(Math.round(salaryValue));

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        Kazançlarım
      </Typography>

      {/* AY YIL SECME */}

      <Grid container spacing={2} mb={3}>

        <Grid item>
          <Select
            value={month}
            onChange={(e) =>
              setMonth(e.target.value)
            }
          >
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}. Ay
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item>
          <Select
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </Grid>

      </Grid>

      {/* TOP CARDS */}

      <Grid container spacing={3} mb={3}>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#16a34a", color: "white" }}>
            <CardContent>

              <Typography>
                Toplam Kazanç
              </Typography>

              <Typography variant="h4">
                {totalIncome} SEK
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#2563eb", color: "white" }}>
            <CardContent>

              <Typography>
                Toplam Tips
              </Typography>

              <Typography variant="h4">
                {totalTips} SEK
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#f59e0b", color: "white" }}>
            <CardContent>

              <Typography>
                Aylık Maaş
              </Typography>

              <Typography variant="h4">
                {salary} SEK
              </Typography>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* TABLE */}

      <Card>
        <CardContent>

          <Table>

            <TableHead>
              <TableRow>

                <TableCell>
                  <b>Tarih</b>
                </TableCell>

                <TableCell>
                  <b>Uber</b>
                </TableCell>

                <TableCell>
                  <b>Uber Tips</b>
                </TableCell>

                <TableCell>
                  <b>Bolt</b>
                </TableCell>

                <TableCell>
                  <b>Bolt Tips</b>
                </TableCell>

                <TableCell>
                  <b>SumUp</b>
                </TableCell>

                <TableCell>
                  <b>SumUp Tips</b>
                </TableCell>

                <TableCell>
                  <b>Toplam</b>
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {rows.map((r, i) => (
                <TableRow key={i}>

                  <TableCell>
                    {r.date}
                  </TableCell>

                  <TableCell>
                    {r.uber} SEK
                  </TableCell>

                  <TableCell>
                    {r.uberTips} SEK
                  </TableCell>

                  <TableCell>
                    {r.bolt} SEK
                  </TableCell>

                  <TableCell>
                    {r.boltTips} SEK
                  </TableCell>

                  <TableCell>
                    {r.sumup} SEK
                  </TableCell>

                  <TableCell>
                    {r.sumupTips} SEK
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "green",
                    }}
                  >
                    {r.total} SEK
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

    </Box>
  );
}