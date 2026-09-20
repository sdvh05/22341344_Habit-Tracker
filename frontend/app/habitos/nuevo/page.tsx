"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";
import { api, todayLocal } from "../../../lib/api";
import { habitoSchema } from "../../../lib/schemas";

const categorias = [
  "Salud",
  "Productividad",
  "Aprendizaje",
  "Bienestar",
  "Otro",
];

type Errores = Partial<
  Record<"nombre" | "categoria" | "fechaInicio" | "fechaFin", string>
>;

export default function NuevoHabitoPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Salud");
  const [frecuencia, setFrecuencia] = useState("diaria");
  const [fechaInicio, setFechaInicio] = useState(todayLocal());
  const [fechaFin, setFechaFin] = useState("");
  const [activo, setActivo] = useState(true);
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const resultado = habitoSchema.safeParse({
      nombre,
      descripcion,
      categoria,
      frecuencia,
      fechaInicio,
      fechaFin,
      activo,
    });
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
      await api.post("/habits", {
        ...resultado.data,
        descripcion: resultado.data.descripcion || undefined,
        fechaFin: resultado.data.fechaFin || undefined,
      });
      router.push("/habitos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el hábito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Typography variant="h1" sx={{ mb: 3, color: "#1A1A1A" }}>
        Nuevo hábito
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
              error={!!errores.nombre}
              helperText={errores.nombre}
              fullWidth
            />
            <TextField
              select
              label="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              error={!!errores.categoria}
              helperText={errores.categoria}
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
            <Typography variant="body2" sx={{ mb: 1, color: "#1A1A1A" }}>
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

          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              label="Fecha inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errores.fechaInicio}
              helperText={errores.fechaInicio}
              fullWidth
            />
            <TextField
              label="Fecha fin (opcional)"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errores.fechaFin}
              helperText={errores.fechaFin}
              fullWidth
            />
            <Box sx={{ pt: 1 }}>
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
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="warning"
            disabled={loading}
            sx={{ alignSelf: "flex-end", px: 4 }}
          >
            {loading ? "Guardando..." : "Guardar hábito"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
