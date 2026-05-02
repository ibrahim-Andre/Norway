import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function DriverChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Şifre alanları boş olamaz");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Şifreler eşleşmiyor");
      return;
    }

    if (newPassword.length < 6) {
      alert("Şifre en az 6 karakter olmalı");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Şifre başarıyla değiştirildi");

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      <h5>Şifre Değiştir</h5>

      <input
        type="password"
        placeholder="Yeni Şifre"
        className="form-control mb-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Şifre Tekrar"
        className="form-control mb-3"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        className="btn btn-primary w-100"
        onClick={handleChangePassword}
        disabled={loading}
      >
        {loading ? "Güncelleniyor..." : "Şifreyi Değiştir"}
      </button>
    </div>
  );
}