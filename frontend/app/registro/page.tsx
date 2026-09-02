"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import { api, saveToken } from "../../lib/api";

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/register", {
        nombre,
        correo,
        contraseña,
      });
      saveToken(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        bgcolor: "background.paper",
        borderRadius: 3,
        p: 4,
      }}
    >
      <Typography variant="h1" sx={{ mb: 3 }}>
        Crear cuenta
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Contraseña"
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
          fullWidth
          helperText="Mínimo 6 caracteres"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
      </Typography>
    </Box>
  );
}
