import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import theme from "../theme";
import Sidebar from "../components/Sidebar";

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

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Seguimiento de hábitos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
              <Sidebar />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  bgcolor: "background.default",
                  minHeight: "100vh",
                  p: 4,
                }}
              >
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
