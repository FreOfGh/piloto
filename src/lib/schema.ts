import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(7, "Número de teléfono inválido"),
  diocesis: z.string().min(2, "La Diócesis es obligatoria"),
  entidadSalud: z.string().min(2, "La entidad de salud es obligatoria"),
  segmentacion: z.enum(["sacerdote", "seminarista", "laico"], {
    errorMap: () => ({ message: "Selecciona una opción válida" }),
  }),
  hospedaje: z.enum(["si", "no"], {
    errorMap: () => ({ message: "Selecciona una opción" }),
  }),
  imagen: z
    .any()
    .refine((files) => files?.length == 1, "La imagen de la consignación es obligatoria")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Máximo 5MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Solo .jpg, .png o .webp"
    ),
});

export type ContactFormData = z.infer<typeof contactSchema>;