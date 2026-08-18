/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_PROD: string;
  readonly VITE_URL_BACKEND: string;
  readonly VITE_REDUX_PERSIST_ENCRYPT: string;
  readonly VITE_USE_AUTH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
