import { Box, Tabs, Tab, Grid, ButtonGroup, Button, Skeleton } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

import EarningsChart from "./Stats/EarningsChart";
import Analytics from "./Stats/Analytics";
import CalendarView from "./Stats/CalendarView";
import StatCard from "../../components/admin/StatCard";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function StatsPage() {

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7");

  const [kpi, setKpi] = useState({
    income: 0,
    expense: 0,
    profit: 0,
    trips: 0,
    growth: 0,
  });

  // 🔥 KPI (SQL)
  const loadKPI = useCallback(async () => {

    setLoading(true);

    const { data, error } = await supabase
      .rpc("get_kpi", { range });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setKpi(data);
    setLoading(false);

  }, [range]);

  useEffect(() => {
    loadKPI();
  }, [loadKPI]);

  // 📄 PDF EXPORT
  const handleExport = async () => {

    const canvas = await html2canvas(document.body);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);

    const blob = pdf.output("blob");

    await sendToTelegram(blob);

    pdf.save("report.pdf");
  };

  const sendToTelegram = async (file) => {

    const formData = new FormData();
    formData.append("chat_id", "-5180174270");
    formData.append("document", file, "report.pdf");

    await fetch(
      "https://api.telegram.org/bot8642072983:AAH97rYmmRQfOBFZXEROixv_E6WTPbDTeAA/sendDocument",
      {
        method: "POST",
        body: formData,
      }
    );
  };

  return (
    <Box p={3}>

      {/* FILTER */}
      <ButtonGroup sx={{ mb: 2 }}>
        <Button onClick={() => setRange("7")}>7 Gün</Button>
        <Button onClick={() => setRange("30")}>30 Gün</Button>
        <Button onClick={() => setRange("month")}>Bu Ay</Button>
      </ButtonGroup>

      {/* KPI */}
      <Grid container spacing={2}>

        <Grid item xs={12} md={3}>
          {loading ? <Skeleton height={80} /> : (
            <StatCard title="Toplam Kazanç" value={`₺${kpi.income}`} color="#22c55e" />
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          {loading ? <Skeleton height={80} /> : (
            <StatCard title="Toplam Gider" value={`₺${kpi.expense}`} color="#ef4444" />
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          {loading ? <Skeleton height={80} /> : (
            <StatCard title="Net Kâr" value={`₺${kpi.profit}`} color="#2563eb" />
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          {loading ? <Skeleton height={80} /> : (
            <StatCard title="Yolculuk" value={kpi.trips} color="#9333ea" />
          )}
        </Grid>

      </Grid>

      {/* TABS */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mt: 3 }}>
        <Tab label="Grafik" />
        <Tab label="Analiz" />
        <Tab label="Takvim" />
      </Tabs>

      <Button sx={{ mt: 2 }} variant="contained" onClick={handleExport}>
        📄 PDF + Telegram Gönder
      </Button>

      <Box mt={3}>
        {tab === 0 && <EarningsChart />}
        {tab === 1 && <Analytics />}
        {tab === 2 && <CalendarView />}
      </Box>

    </Box>
  );
}