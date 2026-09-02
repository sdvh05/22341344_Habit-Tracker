"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ChecklistIcon from "@mui/icons-material/ChecklistOutlined";
import BarChartIcon from "@mui/icons-material/BarChartOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Mis hábitos", href: "/habitos", icon: <ChecklistIcon /> },
  { label: "Estadísticas", href: "/estadisticas", icon: <BarChartIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        bgcolor: "primary.main",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 3,
        flexShrink: 0,
      }}
    >
      <Typography variant="h2" sx={{ color: "#FFFFFF", px: 1, mb: 3 }}>
        Habit Tracker
      </Typography>

      <Link href="/habitos/nuevo" style={{ textDecoration: "none" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#FFFFFF",
            color: "primary.main",
            borderRadius: 3,
            px: 2,
            py: 1.5,
            mb: 3,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <AddIcon />
          <Typography variant="button">Nuevo hábito</Typography>
        </Box>
      </Link>

      <List sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <ListItemButton
                sx={{
                  borderRadius: 3,
                  mb: 1,
                  bgcolor: active ? "secondary.main" : "transparent",
                  "& .MuiListItemIcon-root": {
                    color: active ? "text.primary" : "#FFFFFF",
                  },
                  "&:hover": { bgcolor: "secondary.main", opacity: 0.9 },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: active ? "text.primary" : "#FFFFFF",
                    },
                  }}
                />
              </ListItemButton>
            </Link>
          );
        })}
      </List>

      <Link href="/perfil" style={{ textDecoration: "none" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1 }}>
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            <PersonIcon sx={{ color: "text.primary" }} />
          </Avatar>
          <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
            Mi perfil
          </Typography>
        </Box>
      </Link>
    </Box>
  );
}
