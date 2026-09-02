"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
}

interface DayCount {
  fecha: string;
  completados: number;
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
  const [monthly, setMonthly] = useState<DayCount[]>([]);
  const [loading, setLoading] = useState(true);

  const hoy = new Date();
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1); // 1-12

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    loadData();
  }, [router, year, month]);

  async function loadData() {
    setLoading(true);
    try {
      const [summaryData, monthlyData] = await Promise.all([
        api.get("/statistics/summary"),
        api.get(`/statistics/monthly?year=${year}&month=${month}`),
      ]);
      setSummary(summaryData);
      setMonthly(monthlyData);
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

  if (loading && monthly.length === 0)
    return <Typography>Cargando...</Typography>;

  const completedMap = new Map(monthly.map((d) => [d.fecha, d.completados]));

  // Construir grilla del calendario: días vacíos al inicio para alinear con el día de la semana
  const primerDia = new Date(year, month - 1, 1);
  const diasEnMes = new Date(year, month, 0).getDate();
  const offset = (primerDia.getDay() + 6) % 7; // lunes=0

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
    return { dia: String(dia), completados: completedMap.get(fecha) ?? 0 };
  });

  const cards = [
    {
      label: "Racha actual",
      value: `${summary?.currentStreak ?? 0} días`,
      bg: "warning.main",
    },
    {
      label: "Mejor racha",
      value: `${summary?.bestStreak ?? 0} días`,
      bg: "secondary.main",
    },
    {
      label: "% Cumplimiento",
      value: `${summary?.completionRate ?? 0}%`,
      bg: "success.main",
    },
  ];

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Estadísticas
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
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
            <Typography variant="h2" sx={{ color: "#1A1A1A" }}>
              {nombresMes[month - 1]} {year}
            </Typography>
            <IconButton onClick={() => cambiarMes(1)}>
              <ChevronRightIcon />
            </IconButton>
          </Box>

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
              const completado = completedMap.has(fecha);
              const dia = parseInt(fecha.split("-")[2], 10);
              return (
                <Tooltip key={fecha} title={fecha}>
                  <Box
                    sx={{
                      aspectRatio: "1",
                      borderRadius: 1.5,
                      bgcolor: completado ? "success.main" : "background.paper",
                      border: completado ? "none" : "1px solid #DDD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
          <Typography variant="h2" sx={{ mb: 2 }}>
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
    </Box>
  );
}
