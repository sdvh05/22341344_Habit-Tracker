"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import { api } from "../../../../lib/api";

const categorias = [
  "Salud",
  "Productividad",
  "Aprendizaje",
  "Bienestar",
  "Otro",
];

export default function EditarHabitoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Salud");
  const [frecuencia, setFrecuencia] = useState("diaria");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [activo, setActivo] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHabit();
  }, [id]);

  async function loadHabit() {
    try {
      const habit = await api.get(`/habits/${id}`);
      setNombre(habit.nombre);
      setDescripcion(habit.descripcion || "");
      setCategoria(habit.categoria || "Salud");
      setFrecuencia(habit.frecuencia);
      setFechaInicio(habit.fechaInicio?.slice(0, 10) || "");
      setFechaFin(habit.fechaFin?.slice(0, 10) || "");
      setActivo(habit.activo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el hábito",
      );
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.patch(`/habits/${id}`, {
        nombre,
        descripcion: descripcion || undefined,
        categoria,
        frecuencia,
        fechaInicio,
        fechaFin: fechaFin || undefined,
        activo,
      });
      router.push("/habitos");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar los cambios",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Editar hábito
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              fullWidth
            />
            <TextField
              select
              label="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              {categorias.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Frecuencia
            </Typography>
            <ToggleButtonGroup
              value={frecuencia}
              exclusive
              onChange={(_, val) => val && setFrecuencia(val)}
              fullWidth
            >
              <ToggleButton value="diaria">Diaria</ToggleButton>
              <ToggleButton value="semanal">Semanal</ToggleButton>
              <ToggleButton value="personalizada">Personalizada</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Fecha inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              required
              fullWidth
            />
            <TextField
              label="Fecha fin (opcional)"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                />
              }
              label="Activo"
              sx={{ whiteSpace: "nowrap" }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="warning"
            disabled={saving}
            sx={{ alignSelf: "flex-end", px: 4 }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
