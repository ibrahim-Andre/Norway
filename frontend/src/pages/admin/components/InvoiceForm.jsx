import {
  Box,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";

import { useState, useEffect  } from "react";
import { supabase } from "../../../lib/supabase";

export default function InvoiceForm({ onClose, editData  }) {

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
  
  
  
  
  useEffect(() => {
  if (editData) {
    setForm({
      pay_to: editData.pay_to || "",
      amount: editData.amount || "",
      payment_date: editData.payment_date || "",
      description: editData.description || "",
    });
  }
}, [editData]);
 

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

  const sanitizeFileName = (name) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");
};

const uploadFile = async () => {

  if (!file) return null;

  const cleanName = sanitizeFileName(file.name);

  const fileName = Date.now() + "_" + cleanName;

  const { error } = await supabase
  .storage
  .from("documents")
  .upload(fileName, file);

if (error) {
  console.log("UPLOAD ERROR:", error); // 🔥 bunu ekle
  alert(error.message);
  return null;
}

  const { data } = supabase
    .storage
    .from("documents")
    .getPublicUrl(fileName);

  return data.publicUrl;
};

  const handleSubmit = async () => {

  let fileUrl = editData?.document_url || null;

  // yeni dosya varsa upload
  if (file) {
    fileUrl = await uploadFile();
  }

  const dataToSave = {
    ...form,
    amount: Number(form.amount),
    document_url: fileUrl,
  };

  let response;

  if (editData) {
    // UPDATE
    response = await supabase
      .from("invoices")
      .update(dataToSave)
      .eq("id", editData.id);
  } else {
    // INSERT
    response = await supabase
      .from("invoices")
      .insert([dataToSave]);
  }

  if (response.error) {
    alert(response.error.message);
    return;
  }

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
  type="button"
  onClick={handleSubmit}
>
        Kaydet
      </Button>

    </Box>
  );
}