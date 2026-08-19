// Config de runtime (build once, deploy many): en producción, env.sh genera
// env-config.js con las variables reales del contenedor y lo expone en
// window._env_ ANTES de que cargue el bundle de la app (ver index.html).
// Así la misma imagen Docker sirve para dev/qa/prod sin recompilar — solo
// cambian las env vars con las que se levanta el contenedor.
//
// En desarrollo local (`yarn start`) window._env_ no existe, así que se cae
// a import.meta.env, que sí lee el .env local en build-time de Vite.
declare global {
  interface Window {
    _env_?: Record<string, string>;
  }
}

export const getEnv = (key: string): string => {
  const runtimeEnv = window._env_;
  if (runtimeEnv?.[key]) return runtimeEnv[key];

  const buildTimeEnv = import.meta.env as Record<string, string | undefined>;
  return buildTimeEnv[key] ?? "";
};
