"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/EditOutlined";
import Link from "next/link";
import { api, isLoggedIn } from "../../lib/api";

interface Habit {
  _id: string;
  nombre: string;
  categoria?: string;
  frecuencia: string;
  activo: boolean;
}

type Filtro = "todos" | "activos" | "inactivos";

export default function ListaHabitosPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    loadHabits();
  }, [router]);

  async function loadHabits() {
    try {
      const data = await api.get("/habits");
      setHabits(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActivo(habit: Habit) {
    try {
      await api.patch(`/habits/${habit._id}`, { activo: !habit.activo });
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habit._id ? { ...h, activo: !h.activo } : h,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function eliminarHabito(id: string) {
    if (!confirm("¿Eliminar este hábito? Esta acción no se puede deshacer."))
      return;
    try {
      await api.delete(`/habits/${id}`);
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = habits.filter((h) => {
    if (filtro === "activos") return h.activo;
    if (filtro === "inactivos") return !h.activo;
    return true;
  });

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3, color: "#1A1A1A" }}>
        Mis hábitos
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <ToggleButtonGroup
          value={filtro}
          exclusive
          onChange={(_, val) => val && setFiltro(val)}
        >
          <ToggleButton value="todos">Todos</ToggleButton>
          <ToggleButton value="activos">Activos</ToggleButton>
          <ToggleButton value="inactivos">Inactivos</ToggleButton>
        </ToggleButtonGroup>

        <Link href="/habitos/nuevo" style={{ textDecoration: "none" }}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nuevo
          </Button>
        </Link>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Frecuencia</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography color="text.secondary">
                    No hay hábitos en este filtro.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((habit) => (
              <TableRow key={habit._id}>
                <TableCell>{habit.nombre}</TableCell>
                <TableCell>
                  <Chip
                    label={habit.frecuencia}
                    sx={{ bgcolor: "secondary.main" }}
                  />
                </TableCell>
                <TableCell>
                  {habit.categoria && (
                    <Chip
                      label={habit.categoria}
                      sx={{ bgcolor: "warning.main", color: "#FFFFFF" }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Link href={`/habitos/${habit._id}/editar`}>
                    <IconButton title="Editar">
                      <EditIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                  </Link>
                  <IconButton
                    onClick={() => toggleActivo(habit)}
                    title={habit.activo ? "Desactivar" : "Activar"}
                  >
                    {habit.activo ? (
                      <PauseIcon sx={{ color: "primary.main" }} />
                    ) : (
                      <PlayArrowIcon sx={{ color: "primary.main" }} />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={() => eliminarHabito(habit._id)}
                    title="Eliminar"
                  >
                    <CloseIcon sx={{ color: "error.main" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
