import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

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

  const [roles, setRoles] = useState(["driver"]);

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

  // 🔥 TEK VE DOĞRU CREATE FLOW
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        // 1️⃣ AUTH USER
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password
        });

        console.log("SIGNUP:", data, error);

        if (error) throw error;
        if (!data.user) {
          throw new Error("User oluşturulamadı (email confirm açık olabilir)");
        }

        const userId = data.user.id;

        // 2️⃣ PROFILES
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            username: form.username,
            email: form.email,
            roles
          });

        if (profileError) throw profileError;

        // 3️⃣ DRIVERS
        const { error: driverError } = await supabase
          .from("drivers")
          .insert({
            id: userId,
            full_name: form.full_name,
            phone: form.phone,
            license_no: form.license_no,
            license_expiry: form.license_expiry
          });

        if (driverError) throw driverError;

        alert("Kullanıcı başarıyla oluşturuldu");
      } else {
        // UPDATE (basit)
        const { error } = await supabase
          .from("drivers")
          .update({
            full_name: form.full_name,
            phone: form.phone,
            license_no: form.license_no,
            license_expiry: form.license_expiry
          })
          .eq("id", initialData.id);

        if (error) throw error;

        alert("Güncellendi");
      }

      onSuccess?.();
      onClose();

    } catch (err) {
      console.error("ERROR:", err);
      alert(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {mode === "create" ? "Add Driver" : "Edit Driver"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>

          <TextField
            name="username"
            label="Username"
            fullWidth
            value={form.username}
            onChange={handleChange}
            disabled={mode === "edit"}
          />

          <TextField
            name="email"
            label="Email"
            fullWidth
            value={form.email}
            onChange={handleChange}
            disabled={mode === "edit"}
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

          {/* 🔥 ROLE SELECT */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rol Seç</InputLabel>

            <Select
              value={roles.join(",")}
              label="Rol Seç"
              onChange={(e) => {
                const value = e.target.value;

                if (value === "driver") setRoles(["driver"]);
                if (value === "admin") setRoles(["admin"]);
                if (value === "both") setRoles(["admin", "driver"]);
              }}
            >
              <MenuItem value="driver">🚗 Driver</MenuItem>
              <MenuItem value="admin" sx={{ color: "#f87171" }}>
                🛠 Admin
              </MenuItem>
              <MenuItem value="both" sx={{ color: "#22c55e" }}>
                🔥 Admin + Driver
              </MenuItem>
            </Select>
          </FormControl>

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