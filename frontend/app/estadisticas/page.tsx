"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Popover from "@mui/material/Popover";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from "recharts";
import { api, isLoggedIn } from "../../lib/api";

interface Summary {
  activeHabits: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  totalCompletions: number;
  mostConsistentHabit: { nombre: string; percent: number } | null;
}

interface Habit {
  _id: string;
  nombre: string;
}

interface Record {
  _id: string;
  habito: string;
  fecha: string;
  completado: boolean;
}

const nombresMes = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const nombresDiaCorto = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function EstadisticasPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  const hoy = new Date();
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [yearPicker, setYearPicker] = useState(year);

  function abrirSelector(e: React.MouseEvent<HTMLElement>) {
    setYearPicker(year);
    setAnchorEl(e.currentTarget);
  }

  function seleccionarMes(m: number) {
    setMonth(m);
    setYear(yearPicker);
    setAnchorEl(null);
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    loadData();
  }, [router]);

  async function loadData() {
    try {
      const [summaryData, habitsData, recordsData] = await Promise.all([
        api.get("/statistics/summary"),
        api.get("/habits"),
        api.get("/records"),
      ]);
      setSummary(summaryData);
      setHabits(habitsData);
      setRecords(recordsData.filter((r: Record) => r.completado));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function cambiarMes(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  if (loading) return <Typography>Cargando...</Typography>;

  const habitNameMap = new Map(habits.map((h) => [h._id, h.nombre]));

  const recordsByDate = new Map<string, string[]>();
  for (const r of records) {
    const fecha = r.fecha.slice(0, 10);
    const nombre = habitNameMap.get(r.habito) ?? "Hábito eliminado";
    if (!recordsByDate.has(fecha)) recordsByDate.set(fecha, []);
    recordsByDate.get(fecha)!.push(nombre);
  }

  const primerDia = new Date(year, month - 1, 1);
  const diasEnMes = new Date(year, month, 0).getDate();
  const offset = (primerDia.getDay() + 6) % 7;

  const celdas: (string | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => {
      const dia = i + 1;
      return `${year}-${String(month).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    }),
  ];

  const chartData = Array.from({ length: diasEnMes }, (_, i) => {
    const dia = i + 1;
    const fecha = `${year}-${String(month).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return {
      dia: String(dia),
      completados: recordsByDate.get(fecha)?.length ?? 0,
    };
  });

  const cards = [
    {
      label: "Racha actual",
      value: `${summary?.currentStreak ?? 0} días`,
      bg: "warning.main",
    },
    {
      label: "Total completados",
      value: summary?.totalCompletions ?? 0,
      bg: "secondary.main",
    },
    {
      label: "% Cumplimiento",
      value: `${summary?.completionRate ?? 0}%`,
      bg: "success.main",
    },
  ];

  const habitosDelDiaSeleccionado = diaSeleccionado
    ? (recordsByDate.get(diaSeleccionado) ?? [])
    : [];

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3, color: "#1A1A1A" }}>
        Estadísticas
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                bgcolor: card.bg,
                p: 3,
                borderRadius: 3,
                color:
                  card.bg === "secondary.main" ? "text.primary" : "#FFFFFF",
              }}
            >
              <Typography variant="body2">{card.label}</Typography>
              <Typography variant="h1" sx={{ mt: 1 }}>
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/*
      {summary?.mostConsistentHabit && (
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            bgcolor: "primary.main",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Tu hábito más consistente
            </Typography>
            <Typography variant="h1" sx={{ color: "#FFFFFF" }}>
              {summary.mostConsistentHabit.nombre} — {summary.mostConsistentHabit.percent}%
            </Typography>
          </Box>
        </Paper>
      )}
      */}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <IconButton onClick={() => cambiarMes(-1)}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography
              variant="h2"
              onClick={abrirSelector}
              sx={{
                color: "#1A1A1A",
                cursor: "pointer",
                "&:hover": { opacity: 0.7 },
              }}
            >
              {nombresMes[month - 1]} {year}
            </Typography>
            <IconButton onClick={() => cambiarMes(1)}>
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Popover
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Box sx={{ p: 2, width: 260 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setYearPicker((y) => y - 1)}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <Typography sx={{ color: "#1A1A1A", fontWeight: 600 }}>
                  {yearPicker}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setYearPicker((y) => y + 1)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1,
                }}
              >
                {nombresMes.map((nombre, i) => {
                  const esActual = i + 1 === month && yearPicker === year;
                  return (
                    <Box
                      key={nombre}
                      onClick={() => seleccionarMes(i + 1)}
                      sx={{
                        textAlign: "center",
                        py: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        bgcolor: esActual ? "primary.main" : "transparent",
                        color: esActual ? "#FFFFFF" : "#1A1A1A",
                        fontSize: 13,
                        "&:hover": {
                          bgcolor: esActual ? "primary.main" : "secondary.main",
                        },
                      }}
                    >
                      {nombre.slice(0, 3)}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Popover>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
              mb: 1,
            }}
          >
            {nombresDiaCorto.map((d) => (
              <Typography
                key={d}
                variant="caption"
                align="center"
                sx={{ color: "text.secondary" }}
              >
                {d}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {celdas.map((fecha, idx) => {
              if (!fecha) return <Box key={`empty-${idx}`} />;
              const completado = recordsByDate.has(fecha);
              const dia = parseInt(fecha.split("-")[2], 10);
              return (
                <Tooltip
                  key={fecha}
                  title={
                    completado
                      ? "Ver hábitos completados"
                      : "Sin hábitos completados"
                  }
                >
                  <Box
                    onClick={() => setDiaSeleccionado(fecha)}
                    sx={{
                      aspectRatio: "1",
                      borderRadius: 1.5,
                      bgcolor: completado ? "success.main" : "background.paper",
                      border: completado ? "none" : "1px solid #DDD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: completado ? "#FFFFFF" : "text.secondary" }}
                    >
                      {dia}
                    </Typography>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h2" sx={{ mb: 2, color: "#1A1A1A" }}>
            Completados por día — {nombresMes[month - 1]}
          </Typography>
          <Paper sx={{ p: 2, borderRadius: 3, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="dia" interval={2} />
                <YAxis allowDecimals={false} />
                <ChartTooltip />
                <Bar
                  dataKey="completados"
                  fill="#236364"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={!!diaSeleccionado}
        onClose={() => setDiaSeleccionado(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{diaSeleccionado}</DialogTitle>
        <DialogContent>
          {habitosDelDiaSeleccionado.length === 0 ? (
            <Typography color="text.secondary">
              No completaste ningún hábito este día.
            </Typography>
          ) : (
            <List>
              {habitosDelDiaSeleccionado.map((nombre, i) => (
                <ListItem key={i}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: "success.main" }} />
                  </ListItemIcon>
                  <ListItemText primary={nombre} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
