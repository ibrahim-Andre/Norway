import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ButtonGroup, Button } from "@mui/material";
import { BarChart, Bar } from "recharts";
import { Select, MenuItem } from "@mui/material";
import { useCallback } from "react";
import { Skeleton } from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function EarningsChart() {

  const [data, setData] = useState([]);
  const [range, setRange] = useState("7");
  const [driver, setDriver] = useState("all");
  const [loading, setLoading] = useState(true);

 

  const load = useCallback(async () => {
	  setLoading(true);

    const { data: trips } =
      await supabase.from("trips")
        .select("fare, created_at");

    const { data: invoices } =
      await supabase.from("invoices")
        .select("amount, payment_date");

    const map = {};
    const today = new Date();

    trips?.forEach(t => {

      const d = t.created_at.slice(0,10);
      const date = new Date(d);

      if (range !== "all") {
        const days = Number(range);
        const diff = (today - date) / (1000 * 60 * 60 * 24);
        if (diff > days) return;
      }

      map[d] = map[d] || { date: d, income: 0, expense: 0 };
      map[d].income += Number(t.fare || 0);
    });

    invoices?.forEach(i => {

      const d = i.payment_date;
      const date = new Date(d);

      if (range !== "all") {
        const days = Number(range);
        const diff = (today - date) / (1000 * 60 * 60 * 24);
        if (diff > days) return;
      }

      map[d] = map[d] || { date: d, income: 0, expense: 0 };
      map[d].expense += Number(i.amount || 0);
    });

    const result = Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setData(result);
	setLoading(false);
  }, [range]);
  
  useEffect(() => {
  load();
}, [load]);
if (loading) {
  return (
    <Skeleton
      variant="rounded"
      height={400}
      animation="wave"
    />
  );
}
  return (

    <div style={{ width: "100%", height: 400 }}>

      {/* FILTER */}

      <ButtonGroup sx={{ mb: 2 }}>
        <Button onClick={() => setRange("7")}>7 Gün</Button>
        <Button onClick={() => setRange("30")}>30 Gün</Button>
        <Button onClick={() => setRange("all")}>Tüm</Button>
      </ButtonGroup>
	  <Select
  value={driver}
  onChange={(e) => setDriver(e.target.value)}
  sx={{ mb: 2, ml: 2 }}
>
  <MenuItem value="all">Tüm Driver</MenuItem>
  <MenuItem value="uber">Uber</MenuItem>
  <MenuItem value="bolt">Bolt</MenuItem>
</Select>

      <ResponsiveContainer>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
            name="Kazanç"
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            name="Gider"
          />

        </LineChart>
		<div style={{ width: "100%", height: 300, marginTop: 40 }}>
  <ResponsiveContainer>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />

      <Bar dataKey="income" fill="#22c55e" name="Kazanç" />
      <Bar dataKey="expense" fill="#ef4444" name="Gider" />
    </BarChart>
  </ResponsiveContainer>
</div>

      </ResponsiveContainer>

    </div>
  );
}