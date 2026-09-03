"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { api, isLoggedIn, clearToken } from "../../lib/api";

interface User {
  _id: string;
  nombre: string;
  correo: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [notificaciones, setNotificaciones] = useState(true);
  const [recordatorios, setRecordatorios] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    loadUser();
  }, [router]);

  async function loadUser() {
    try {
      const data = await api.get("/users/me");
      setUser(data);
      setNombre(data.nombre);
      setCorreo(data.correo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.patch(`/users/${user._id}`, { nombre, correo });
      setSuccess("Perfil actualizado correctamente");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el perfil",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Mi perfil
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 800 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                width: 96,
                height: 96,
                bgcolor: "secondary.main",
                fontSize: 32,
              }}
            >
              {nombre.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1">{nombre}</Typography>
          </Box>

          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
              />
              <TextField
                label="Correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                fullWidth
              />
            </Box>
            <Button
              variant="outlined"
              onClick={handleSave}
              disabled={saving}
              sx={{ alignSelf: "flex-start" }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificaciones}
                onChange={(e) => setNotificaciones(e.target.checked)}
              />
            }
            label="Notificaciones activadas"
          />
          <FormControlLabel
            control={
              <Switch
                checked={recordatorios}
                onChange={(e) => setRecordatorios(e.target.checked)}
              />
            }
            label="Recordatorios diarios"
          />
        </Box>

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Paper>
    </Box>
  );
}
