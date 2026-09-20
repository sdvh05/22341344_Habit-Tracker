import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const registroSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  correo: z.string().email("Correo inválido"),
  contraseña: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .regex(
      passwordRegex,
      "Debe tener 6+ caracteres, mayúscula, minúscula y número",
    ),
});

export type RegistroInput = z.infer<typeof registroSchema>;

export const loginSchema = z.object({
  correo: z.string().email("Correo inválido"),
  contraseña: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const habitoSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().optional(),
    categoria: z.string().min(1, "Selecciona una categoría"),
    frecuencia: z.enum(["diaria", "semanal", "personalizada"]),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fechaFin: z.string().optional(),
    activo: z.boolean(),
  })
  .refine((data) => !data.fechaFin || data.fechaFin >= data.fechaInicio, {
    message: "La fecha fin no puede ser anterior a la fecha inicio",
    path: ["fechaFin"],
  });

export type HabitoInput = z.infer<typeof habitoSchema>;
