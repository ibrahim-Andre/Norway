import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Grid } from "@mui/material";
import StatCard from "../../../components/admin/StatCard";

export default function Analytics() {

  const [daily, setDaily] = useState(0);
  const [weekly, setWeekly] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {

    const { data } =
      await supabase.from("trips")
        .select("fare, created_at");

    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    let d = 0;
    let w = 0;

    data?.forEach(t => {

      const date = new Date(t.created_at);

      if (date.toDateString() === today.toDateString()) {
        d += Number(t.fare);
      }

      if (date >= weekAgo) {
        w += Number(t.fare);
      }

    });

    setDaily(d);
    setWeekly(w);
  };

  // ✅ RETURN MUTLAKA FUNCTION İÇİNDE

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} md={6}>
        <StatCard
          title="Günlük Kazanç"
          value={`₺${daily}`}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <StatCard
          title="Haftalık Kazanç"
          value={`₺${weekly}`}
        />
      </Grid>

    </Grid>
  );
}