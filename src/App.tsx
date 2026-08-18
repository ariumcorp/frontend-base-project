import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useAppSelector } from "./app/hooks";
import { GlobalAlert } from "./features/alerts/components/GlobalAlert";
import { GlobalLoading } from "./features/loading/components/GlobalLoading";
import { AppRouter } from "./router/AppRouter";

function App() {
  const themeMode = useAppSelector((state) => state.themeSlice.mode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
      <GlobalAlert />
      <GlobalLoading />
    </ThemeProvider>
  );
}

export default App;
