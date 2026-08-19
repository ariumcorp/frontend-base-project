import type { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";

import { reducer as rootReducerMap } from "@/app/rootReducer";

const rootReducer = combineReducers(rootReducerMap);
type RootState = ReturnType<typeof rootReducer>;

function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

type TestStore = ReturnType<typeof createTestStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: TestStore;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    route = "/",
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const theme = createTheme();

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
