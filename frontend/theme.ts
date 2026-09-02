"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#236364", contrastText: "#FFFFFF" },
    secondary: { main: "#BAD3D4", contrastText: "#1A1A1A" },
    background: { default: "#F1EDED", paper: "#FFFFFF" },
    text: { primary: "#1A1A1A" },
    success: { main: "#4CAF7D" },
    warning: { main: "#E8A33D" },
    error: { main: "#D9534F" },
  },
  typography: {
    fontFamily: "var(--font-inter), Inter, sans-serif",
    h1: {
      fontFamily: "var(--font-poppins), Poppins, sans-serif",
      fontWeight: 500,
      fontSize: "26px",
    },
    h2: {
      fontFamily: "var(--font-poppins), Poppins, sans-serif",
      fontWeight: 500,
      fontSize: "20px",
    },
    body1: {
      fontFamily: "var(--font-inter), Inter, sans-serif",
      fontWeight: 400,
      fontSize: "16px",
    },
    caption: {
      fontFamily: "var(--font-inter), Inter, sans-serif",
      fontWeight: 400,
      fontSize: "13px",
    },
    button: {
      fontFamily: "var(--font-inter), Inter, sans-serif",
      fontWeight: 500,
      fontSize: "14px",
      textTransform: "none",
    },
  },
  shape: { borderRadius: 12 },
});

export default theme;
