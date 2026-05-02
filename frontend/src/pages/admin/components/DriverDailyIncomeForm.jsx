import {
  TextField,
  Button,
  Box,
  Typography
} from "@mui/material"
import { useState } from "react"
import { supabase } from "../../../lib/supabase"

export default function DriverDailyIncomeForm({ driverId }) {
  const [date, setDate] = useState("")
  const [cash, setCash] = useState("")
  const [card, setCard] = useState("")
  const [expense, setExpense] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const totalIncome =
    Number(cash || 0) + Number(card || 0)

  const netIncome =
    totalIncome - Number(expense || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from("driver_daily_income")
      .insert([
        {
          driver_id: driverId,
          date,
          cash_income: Number(cash),
          card_income: Number(card),
          expense: Number(expense),
          total_income: totalIncome,
          net_income: netIncome,
          note
        }
      ])

    setLoading(false)

    if (error) {
      alert("Hata: " + error.message)
      return
    }

    alert("Kazanç kaydedildi")

    setDate("")
    setCash("")
    setCard("")
    setExpense("")
    setNote("")
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1
      }}
    >
      <Typography variant="h6">
        Günlük Kazanç Girişi
      </Typography>

      <TextField
        type="date"
        label="Tarih"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        fullWidth
      />

      <TextField
        type="number"
        label="Nakit Kazanç"
        value={cash}
        onChange={(e) => setCash(e.target.value)}
        fullWidth
      />

      <TextField
        type="number"
        label="Kart Kazanç"
        value={card}
        onChange={(e) => setCard(e.target.value)}
        fullWidth
      />

      <TextField
        type="number"
        label="Gider"
        value={expense}
        onChange={(e) => setExpense(e.target.value)}
        fullWidth
      />

      <TextField
        label="Not"
        multiline
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        fullWidth
      />

      <Typography>
        Toplam: {totalIncome}
      </Typography>

      <Typography fontWeight="bold">
        Net: {netIncome}
      </Typography>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
      >
        {loading
          ? "Kaydediliyor..."
          : "Kaydet"}
      </Button>
    </Box>
  )
}