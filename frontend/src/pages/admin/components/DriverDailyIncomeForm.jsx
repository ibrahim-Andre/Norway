import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

export default function DriverDailyIncomeForm({ driverId }) {
  const [date, setDate] = useState("");
  const [cash, setCash] = useState("");
  const [card, setCard] = useState("");
  const [expense, setExpense] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const totalIncome = Number(cash || 0) + Number(card || 0);
  const netIncome = totalIncome - Number(expense || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("driver_daily_income").insert([
      {
        driver_id: driverId,
        date: date,
        cash_income: Number(cash),
        card_income: Number(card),
        expense: Number(expense),
        total_income: totalIncome,
        net_income: netIncome,
        note: note,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Hata oluştu: " + error.message);
    } else {
      alert("Günlük kazanç başarıyla kaydedildi");
      setDate("");
      setCash("");
      setCard("");
      setExpense("");
      setNote("");
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Şoför Günlük Kazanç Girişi</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tarih</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Nakit Kazanç</Label>
                <Input
                  type="number"
                  placeholder="Örn: 2500"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                />
              </div>

              <div>
                <Label>Kart Kazanç</Label>
                <Input
                  type="number"
                  placeholder="Örn: 1800"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                />
              </div>

              <div>
                <Label>Gider (Yakıt vb.)</Label>
                <Input
                  type="number"
                  placeholder="Örn: 600"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                />
              </div>

              <div>
                <Label>Not</Label>
                <Textarea
                  placeholder="Açıklama yazabilirsiniz"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="bg-gray-100 p-4 rounded-xl">
                <p>Toplam Kazanç: {totalIncome} kr</p>
                <p className="font-bold">Net Kazanç: {netIncome} kr</p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
