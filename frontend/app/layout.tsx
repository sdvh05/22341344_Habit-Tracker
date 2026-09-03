"use client";

import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import theme from "../theme";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const rutasSinNav = ["/login", "/registro"];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const mostrarNav = !rutasSinNav.includes(pathname);

  return (
    <html lang="es" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
              {mostrarNav && (
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <Sidebar />
                </Box>
              )}
              <Box
                component="main"
                sx={{
                  flex: 1,
                  bgcolor: "background.default",
                  minHeight: "100vh",
                  p: mostrarNav ? { xs: 2, md: 4 } : 0,
                  pb: mostrarNav ? { xs: 9, md: 4 } : 0,
                }}
              >
                {children}
              </Box>
              {mostrarNav && (
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <BottomNav />
                </Box>
              )}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
