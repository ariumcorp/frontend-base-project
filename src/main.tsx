import { TolgeeProvider } from "@tolgee/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import { reduxPersistor, reduxStore } from "./app/store.ts";
import { CiercularProgress } from "./components/CircularProgress.tsx";
import "./index.css";
import { tolgee } from "./lib/tolgee.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={reduxPersistor}>
        <TolgeeProvider tolgee={tolgee} fallback={<CiercularProgress />}>
          <App />
        </TolgeeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
