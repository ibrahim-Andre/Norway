import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";

export default function DriverForm({
  open,
  onClose,
  mode = "create",
  initialData,
  onSuccess
}) {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    phone: "",
    email: "",
    license_no: "",
    license_expiry: "",
    password: ""
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ...initialData,
        password: ""
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

    const endpoint =
      mode === "create"
        ? "create-driver"
        : "update-driver";

    const payload =
  mode === "create"
    ? form
    : {
        id: initialData.id,
        full_name: form.full_name,
        phone: form.phone,
        license_no: form.license_no,
        license_expiry: form.license_expiry,
        password: form.password || null
      };

    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      alert("İşlem başarısız");
      return;
    }

    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth disableRestoreFocus>
      <DialogTitle>
        {mode === "create" ? "Add Driver" : "Edit Driver"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="username"
            label="Username"
            fullWidth
            disabled={mode === "edit"}
            value={form.username}
            onChange={handleChange}
          />

          <TextField
            name="email"
            label="Email"
            fullWidth
            disabled={mode === "edit"}
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            name="full_name"
            label="Full Name"
            fullWidth
            value={form.full_name}
            onChange={handleChange}
          />

          <TextField
            name="phone"
            label="Phone"
            fullWidth
            value={form.phone}
            onChange={handleChange}
          />

          <TextField
            name="license_no"
            label="License No"
            fullWidth
            value={form.license_no}
            onChange={handleChange}
          />

          <TextField
            name="license_expiry"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.license_expiry || ""}
            onChange={handleChange}
          />
		  
		  <TextField
  name="password"
  label={
    mode === "create"
      ? "Password"
      : "Yeni Şifre (boş bırakılırsa değişmez)"
  }
  type="password"
  fullWidth
  required={mode === "create"}
  value={form.password}
  onChange={handleChange}
/>

          {/* SADECE CREATE */}
          {mode === "create" && (
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              value={form.password}
              onChange={handleChange}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
