import { z } from "zod";

export const authStateSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type Auth = z.infer<typeof authStateSchema>;

export const initialStateAuth: Auth = {
  message: "",
  accessToken: "",
  refreshToken: "",
};

export const loginRequestSchema = z.object({
  username: z.string().min(1, "El nombre es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
