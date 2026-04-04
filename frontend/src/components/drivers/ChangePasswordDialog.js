import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ChangePasswordDialog({
  open,
  onClose,
}) {
  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChangePassword =
    async () => {
      if (
        !oldPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        alert("Tüm alanları doldurun");
        return;
      }

      if (
        newPassword !== confirmPassword
      ) {
        alert("Şifreler eşleşmiyor");
        return;
      }

      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const email = user.email;

        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email,
            password: oldPassword,
          });

        if (loginError) {
          alert("Eski şifre yanlış");
          return;
        }

        const { error } =
          await supabase.auth.updateUser({
            password: newPassword,
          });

        if (error) {
          alert(error.message);
          return;
        }

        alert("Şifre başarıyla değiştirildi");

        await supabase.auth.signOut();

        window.location = "/";

      } catch (err) {
        console.error(err);
        alert("Hata oluştu");
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

      <DialogTitle>
        Şifre Değiştir
      </DialogTitle>

      <DialogContent>

        <Box sx={{ mt: 1 }}>

          <TextField
            label="Eski Şifre"
            type="password"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(e.target.value)
            }
          />

          <TextField
            label="Yeni Şifre"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <TextField
            label="Yeni Şifre Tekrar"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

        </Box>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          İptal
        </Button>

        <Button
          variant="contained"
          onClick={handleChangePassword}
          disabled={loading}
        >
          Kaydet
        </Button>

      </DialogActions>

    </Dialog>
  );
}