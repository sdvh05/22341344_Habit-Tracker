"use client";

import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ChecklistIcon from "@mui/icons-material/ChecklistOutlined";
import BarChartIcon from "@mui/icons-material/BarChartOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Hábitos", href: "/habitos", icon: <ChecklistIcon /> },
  { label: "Estadísticas", href: "/estadisticas", icon: <BarChartIcon /> },
  { label: "Perfil", href: "/perfil", icon: <PersonIcon /> },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const currentIndex = navItems.findIndex((item) => item.href === pathname);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentIndex === -1 ? false : currentIndex}
        onChange={(_, newValue) => router.push(navItems[newValue].href)}
        sx={{ bgcolor: "primary.main" }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.href}
            label={item.label}
            icon={item.icon}
            sx={{
              color: "#FFFFFF",
              "&.Mui-selected": { color: "#FFFFFF", bgcolor: "secondary.main" },
              "& .MuiBottomNavigationAction-label": { color: "inherit" },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
