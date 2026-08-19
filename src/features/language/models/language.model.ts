import { z } from "zod";

import { LanguageCode } from "@/utils";

export const languageSchema = z.object({
  available: z.array(z.string()),
});

export type Language = z.infer<typeof languageSchema>;

export const initialStateLanguage: Language = {
  available: [LanguageCode.Default],
};
