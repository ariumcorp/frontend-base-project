import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { TolgeeProvider } from "@tolgee/react";
import { PersistGate } from "redux-persist/integration/react";

import { reduxPersistor, reduxStore } from "./app/store.ts";
import { CiercularProgress } from "./components/CircularProgress.tsx";
import { tolgee } from "./lib/tolgee.ts";
import App from "./App.tsx";

import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('No se encontró el elemento con id "root" en index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={reduxPersistor}>
        <TolgeeProvider tolgee={tolgee} fallback={<CiercularProgress />}>
          <App />
        </TolgeeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
