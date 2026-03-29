import { useState } from "react";
import styled from "styled-components";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

/* --- STYLES --- */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #111827, #1f2937);
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
`;

const Error = styled.p`
  color: red;
  text-align: center;
`;

/* --- COMPONENT --- */
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Username → profile bul
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("username", username)
        .single();

      if (profileError || !profile) {
        setError("Kullanıcı bulunamadı");
        return;
      }

      // 2️⃣ Email + password login
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: profile.email, // 🔥 BURASI ÖNEMLİ
          password,
        });

      if (loginError) {
        setError("Şifre hatalı");
        return;
      }

      // 3️⃣ Role yönlendirme
      if (profile.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/driver");
      }

    } catch (err) {
      setError("Bir hata oluştu");
      console.error(err);
    }
  };



  return (
    <Page>
      <Card>
        <h2>🚕 Taxi App</h2>

        <Input
          placeholder="Kullanıcı Adı"
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Şifre"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin}>Giriş Yap</Button>

        {error && <Error>{error}</Error>}
      </Card>
    </Page>
  );
}

export default Login;
