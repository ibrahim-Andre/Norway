import {
  Box,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function InvoiceForm({ onClose }) {

  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    pay_to: "",
    payment_date: "",
    is_recurring: false,
    recurrence_type: "",
    reminder_days: 2,
    amount: "",
    description: "",
    document_url: "",
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

  };

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];

    setFile(selectedFile);

  };

  const uploadFile = async () => {

  if (!file) return null;

  const fileName =
    Date.now() + "_" + file.name;

  const { error } = await supabase
    .storage
    .from("documents")
    .upload(fileName, file);

  if (error) {
    alert(error.message);
    return null;
  }

  const { data } = supabase
    .storage
    .from("documents")
    .getPublicUrl(fileName);

  return data.publicUrl; // 🔥 KRİTİK
};

  const handleSubmit = async () => {

    if (!form.pay_to || !form.payment_date || !form.amount) {
      alert("Gerekli alanlar eksik");
      return;
    }

    let fileUrl = null;

    if (file) {

      fileUrl = await uploadFile();

    }

    const { error } = await supabase
      .from("invoices")
      .insert([
        {
          ...form,
          document_url: fileUrl,
        },
      ]);

    if (error) {

      alert(error.message);

      return;

    }

    alert("Ödeme kaydedildi");

    onClose();

  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
      }}
    >

      <TextField
        label="Kime ödeme yapılacak"
        name="pay_to"
        value={form.pay_to}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Ödeme tarihi"
        name="payment_date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={form.payment_date}
        onChange={handleChange}
        fullWidth
      />

      <FormControlLabel
        control={
          <Switch
            checked={form.is_recurring}
            onChange={(e) =>
              setForm({
                ...form,
                is_recurring: e.target.checked,
              })
            }
          />
        }
        label="Tekrarlanacak mı?"
      />

      {form.is_recurring && (
        <TextField
          select
          label="Tekrar tipi"
          name="recurrence_type"
          value={form.recurrence_type}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="monthly">
            Aylık
          </MenuItem>

          <MenuItem value="yearly">
            Yıllık
          </MenuItem>
        </TextField>
      )}

      <TextField
        label="Kaç gün önce hatırlat"
        name="reminder_days"
        type="number"
        value={form.reminder_days}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Tutar (Sek)"
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Açıklama"
        name="description"
        multiline
        rows={3}
        value={form.description}
        onChange={handleChange}
        fullWidth
      />

      {/* FILE UPLOAD */}

      <Button
        variant="outlined"
        component="label"
      >
        PDF / Resim Yükle

        <input
          type="file"
          hidden
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />

      </Button>

      {file && (
        <Box>

          Seçilen dosya:

          <strong>
            {file.name}
          </strong>

        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleSubmit}
      >
        Kaydet
      </Button>

    </Box>
  );
}