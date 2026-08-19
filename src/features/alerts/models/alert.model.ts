import { z } from "zod";

import { Severity } from "@/utils";

const alertItemSchema = z.object({
  id: z.string(),
  show: z.boolean().optional(),
  severity: z.enum(Severity),
  message: z.string(),
  duration: z.number().optional(),
});

export type AlertItem = z.infer<typeof alertItemSchema>;

export function createEmptyAlertModel(): AlertItem {
  return {
    id: "",
    show: false,
    severity: Severity.Info,
    message: "",
    duration: 0,
  };
}

export const alertsSchema = z.object({
  queue: z.array(alertItemSchema),
});

export type Alerts = z.infer<typeof alertsSchema>;

export const initialStateAlerts: Alerts = {
  queue: [],
};
