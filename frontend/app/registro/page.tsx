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
import { registroSchema } from "../../lib/schemas";
import EmailDomainChips from "../../components/EmailDomainChips";

type Errores = Partial<Record<"nombre" | "correo" | "contraseña", string>>;

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const resultado = registroSchema.safeParse({ nombre, correo, contraseña });
    if (!resultado.success) {
      const nuevosErrores: Errores = {};
      for (const issue of resultado.error.issues) {
        const campo = issue.path[0] as keyof Errores;
        nuevosErrores[campo] = issue.message;
      }
      setErrores(nuevosErrores);
      return;
    }
    setErrores({});

    setLoading(true);
    try {
      const data = await api.post("/auth/register", resultado.data);
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
      <Typography variant="h1" sx={{ mb: 3, color: "#1A1A1A" }}>
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
          error={!!errores.nombre}
          helperText={errores.nombre}
          fullWidth
        />
        <TextField
          label="Correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          error={!!errores.correo}
          helperText={errores.correo}
          fullWidth
        />
        <EmailDomainChips value={correo} onChange={setCorreo} />

        <TextField
          label="Contraseña"
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          error={!!errores.contraseña}
          helperText={errores.contraseña}
          fullWidth
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

      <Typography variant="body2" sx={{ mt: 2, color: "#1A1A1A" }}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" style={{ color: "#236364", fontWeight: 600 }}>
          Inicia sesión
        </Link>
      </Typography>
    </Box>
  );
}
