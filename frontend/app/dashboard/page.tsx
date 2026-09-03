"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
//import { api, isLoggedIn } from "../../lib/api";
import { api, isLoggedIn, todayLocal } from "../../lib/api";

interface Habit {
  _id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

interface Summary {
  activeHabits: number;
  completedToday: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

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
      setHabits(habitsData.filter((h: Habit) => h.activo));

      const today = todayLocal();
      const completedToday = recordsData
        .filter((r: any) => r.fecha.slice(0, 10) === today && r.completado)
        .map((r: any) => r.habito);
      setCompletedIds(new Set(completedToday));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleComplete(habitId: string) {
    const yaCompletado = completedIds.has(habitId);
    try {
      await api.post("/records", {
        habito: habitId,
        fecha: todayLocal(),
        completado: !yaCompletado,
      });
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (yaCompletado) next.delete(habitId);
        else next.add(habitId);
        return next;
      });

      const summaryData = await api.get("/statistics/summary");
      setSummary(summaryData);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <Typography>Cargando...</Typography>;

  const cards = [
    {
      label: "Hábitos activos",
      value: summary?.activeHabits ?? 0,
      bg: "secondary.main",
    },
    {
      label: "Completados hoy",
      value: summary?.completedToday ?? 0,
      bg: "success.main",
    },
    {
      label: "Racha actual",
      value: `${summary?.currentStreak ?? 0} días`,
      bg: "warning.main",
    },
  ];

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 1 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Resumen de tu progreso
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

      <Typography variant="h2" sx={{ mb: 2 }}>
        Hábitos de hoy
      </Typography>

      <Paper sx={{ borderRadius: 3 }}>
        <List>
          {habits.length === 0 && (
            <ListItem>
              <ListItemText primary="No tienes hábitos activos todavía." />
            </ListItem>
          )}
          {habits.map((habit) => (
            <ListItem
              key={habit._id}
              secondaryAction={
                <IconButton onClick={() => toggleComplete(habit._id)}>
                  {completedIds.has(habit._id) ? (
                    <CheckCircleIcon sx={{ color: "success.main" }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ color: "primary.main" }} />
                  )}
                </IconButton>
              }
            >
              <ListItemText
                primary={habit.nombre}
                secondary={habit.descripcion}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
