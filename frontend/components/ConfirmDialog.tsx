"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface Props {
  open: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  colorConfirmar?: "error" | "primary" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  colorConfirmar = "error",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: "#1A1A1A" }}>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#1A1A1A" }}>
          {mensaje}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} sx={{ color: "#1A1A1A" }}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color={colorConfirmar}>
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
