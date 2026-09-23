"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const dominios = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function EmailDomainChips({ value, onChange }: Props) {
  if (!value) return null;

  const local = value.split("@")[0];
  if (!local) return null;

  const dominioActual = value.includes("@") ? value.split("@")[1] : null;

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: -1 }}>
      {dominios.map((dominio) => (
        <Chip
          key={dominio}
          label={`@${dominio}`}
          size="small"
          onClick={() => onChange(`${local}@${dominio}`)}
          sx={{
            bgcolor:
              dominioActual === dominio ? "primary.main" : "secondary.main",
            color: dominioActual === dominio ? "#FFFFFF" : "text.primary",
            cursor: "pointer",
          }}
        />
      ))}
    </Box>
  );
}
