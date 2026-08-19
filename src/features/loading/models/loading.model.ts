import { z } from "zod";

export const loadingSchema = z.object({
  open: z.boolean(),
  message: z.string(),
});

export type Loading = z.infer<typeof loadingSchema>;

export const initialStateLoading: Loading = {
  open: false,
  message: "...",
};
