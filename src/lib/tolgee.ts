import { Tolgee, FormatSimple } from "@tolgee/react";

// const loadTranslations = async (language: string) => {
//   const response = await fetch(`/api/translations/${language}.json`);
//   const data = await response.json();
//   return data;
// };

export const tolgee = Tolgee()
  .use(FormatSimple())
  .init({
    staticData: {
      en: () => import("../i18n/en-US.json"),
    },
    defaultLanguage: "en",
    availableLanguages: ["en"],
  });
