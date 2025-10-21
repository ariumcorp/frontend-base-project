import { ThemeCode } from "@/utils";
import { z } from "zod";

export const themeSchema = z.object({
  mode: z.enum(ThemeCode),
});

export type Theme = z.infer<typeof themeSchema>;

export const initialStateTheme: Theme = {
  mode: ThemeCode.Dark,
};
