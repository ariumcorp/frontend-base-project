import { useTolgee } from "@tolgee/react";
import { Button, ButtonGroup } from "@mui/material";
import { useAppSelector } from "@/app/"; // <-- Importa el hook de Redux

export const LanguageSwitcher = () => {
  const { getLanguage, changeLanguage } = useTolgee();
  const availableLanguages = useAppSelector(
    (state) => state.languageSlice.available
  );
  const currentLanguage = getLanguage();

  if (availableLanguages.length <= 1) {
    return null;
  }

  return (
    <ButtonGroup variant="outlined" size="small" sx={{ mr: 2 }}>
      {availableLanguages.map((lang) => (
        <Button
          key={lang}
          onClick={() => changeLanguage(lang)}
          variant={currentLanguage === lang ? "contained" : "outlined"}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </ButtonGroup>
  );
};
