# frontend-base-project

Proyecto base de frontend multiplataforma (web, Android, iOS y desktop). Sirve como plantilla de arranque para nuevos proyectos del equipo.

## Stack

- **React 19** + **Vite 7** (`rolldown-vite`) + **TypeScript** (strict)
- **Redux Toolkit** (store, slices, RTK Query) + `redux-persist` (con cifrado) + `redux-logger`
- **Material UI** + **Emotion** + **Framer Motion**
- **React Router v7**
- **Axios** (con interceptores de auth y refresh-token)
- **Zod** para validación de esquemas
- **Tolgee** para i18n
- **Vitest** + **Testing Library** para tests
- **Capacitor** (Android/iOS) y **Tauri** (desktop) para empaquetado multiplataforma

## Scripts

| Script               | Descripción                             |
| -------------------- | --------------------------------------- |
| `yarn start`         | Servidor de desarrollo (Vite)           |
| `yarn build`         | Type-check + build de producción        |
| `yarn preview`       | Sirve el build de producción localmente |
| `yarn lint`          | Corre ESLint                            |
| `yarn format`        | Formatea el proyecto con Prettier       |
| `yarn format:check`  | Verifica formato sin escribir cambios   |
| `yarn test`          | Corre Vitest en modo watch              |
| `yarn test:run`      | Corre Vitest una vez (CI)               |
| `yarn test:coverage` | Corre Vitest con reporte de cobertura   |
| `yarn cap:sync`      | Build + sync de Capacitor               |
| `yarn tauri:dev`     | Corre la app en modo desktop (Tauri)    |

## Docker: build once, deploy many

El proyecto sigue el principio **"build once, deploy many"**: se compila **una sola imagen Docker genérica** (`Dockerfile`) y esa misma imagen se promueve tal cual a dev, qa y producción — nunca se recompila para "apuntar" a otro ambiente.

Esto funciona porque la configuración de ambiente (`VITE_URL_BACKEND`, etc.) **no se hornea en el build**, se inyecta en **runtime**:

1. Al arrancar el contenedor, `env.sh` lee las variables de entorno reales (prefijo `VITE_`) y genera `env-config.js`, que expone `window._env_`.
2. `index.html` carga `env-config.js` **antes** que el bundle de la app.
3. `src/lib/env/envService.ts` (`getEnv()`) lee primero `window._env_`; si no existe (desarrollo local con `yarn start`), cae a `import.meta.env` (el `.env` local de Vite).
4. Todo lo que antes leía `import.meta.env.VITE_*` directamente (`src/utils/index.ts`: `getKeyEncrypt`, `isProd`, `getUrlBackend`, `useAuth`) pasa por `getEnv()`.

**Importante para quien añada una variable de entorno nueva**: si se necesita en runtime (no solo en build-time), debe leerse vía `getEnv("VITE_...")`, nunca con `import.meta.env.VITE_...` directo — de lo contrario quedaría fija en el bundle compilado y el build-once dejaría de servir para esa variable.

### Pipeline (`.github/workflows/docker-publish.yml`)

**No se dispara directamente por push.** Está encadenado al workflow `CI` (`.github/workflows/ci.yml`) vía `workflow_run`: solo arranca cuando `CI` **terminó**, y además valida que haya terminado con `conclusion == 'success'` y que el push (no un PR) haya sido a `main`/`qa`/`dev`. Así nunca se construye ni publica una imagen de un commit que no pasó lint/test/build/format — antes ambos workflows corrían en paralelo y Docker podía publicar aunque CI fallara.

Aplica el patrón "build once":

- Hace checkout del commit exacto que `CI` validó (`github.event.workflow_run.head_sha`), no del HEAD actual de la rama
- Calcula un **hash del contenido relevante al build** (no del commit) — si dos commits distintos tienen los mismos archivos (ej. un merge sin cambios), el hash es idéntico
- Si ya existe una imagen para ese hash, **no recompila**: solo la promueve al tag de la rama (`docker buildx imagetools create`, un retag a nivel de registry, sin rebuild)
- Si es contenido nuevo: build → auditoría de dependencias → escaneo de vulnerabilidades (Trivy) → push con SBOM/provenance → firma (Cosign, atada al digest — se hereda en cada promoción sin re-firmar)
- Guard adicional: si el contenido es nuevo pero la versión de `package.json` ya fue usada por otro contenido, falla explícitamente en vez de sobrescribir el tag en silencio

La imagen se publica en Docker Hub como `ariumdev/frontend-base-project` (tags: `sha-<hash>`, versión de `package.json`, nombre de rama, y `latest` solo desde `main`). Requiere el secret `DOCKER_HUB_TOKEN` configurado en el repo.

**Nota sobre `workflow_run`**: GitHub lee la definición de este trigger desde la rama por defecto del repo (`main`), no desde la rama que dispara el push. Hasta que este archivo llegue a `main`, un push a `dev`/`qa` no encadenará correctamente — es una limitación de GitHub Actions, no un error de configuración.

## Arquitectura

El proyecto sigue una arquitectura **feature-based**: la lógica de negocio vive en `src/features/<nombre>/`, no en carpetas transversales por tipo de archivo. Cada feature es lo más autocontenida posible.

```
src/
  app/          # configuración de Redux (store, rootReducer, middleware, apiSlice)
  components/   # componentes compartidos entre features (design system básico)
  features/     # lógica de negocio, un directorio por feature (ver convención abajo)
  layouts/       # layouts de la aplicación (MainLayout, etc.)
  lib/          # infraestructura técnica (ApiClient, axios, i18n/tolgee)
  pages/        # páginas que no pertenecen a un feature específico
  router/       # AppRouter, ProtectedRoute/PublicRoute, routeRegistry (lazy loading)
  test-utils/   # helpers de testing (renderWithProviders, setupTests)
  utils/        # utilidades puras, enums, rutas de API
```

### Convención de un feature

Cada feature en `src/features/<nombre>/` usa esta estructura. **Todas las subcarpetas van en plural** (`models/`, no `model/`) — es la única fuente de verdad, no lo mezcles con singular:

```
<feature>/
  api/          # llamadas a servicios/RTK Query específicas del feature
  components/   # componentes de UI propios del feature
  hooks/        # hooks propios del feature
  models/       # tipos, esquemas de zod, estado inicial
  slice/        # slice de Redux (reducer + actions + selectors)
  index.ts      # barrel: reexporta lo que otros features/app pueden consumir
```

No todas las carpetas son obligatorias — un feature sin estado propio puede omitir `slice/`, uno sin llamadas HTTP puede omitir `api/`. Lo que sí es obligatorio es `index.ts` como barrel público del feature: el resto de la app debe importar desde `@/features/<nombre>`, nunca alcanzando archivos internos directamente.

### Testing

Los tests viven junto al código que prueban (`Xxx.test.ts(x)` al lado del archivo, no en una carpeta `__tests__/` separada). Usa `renderWithProviders` (`src/test-utils/renderWithProviders.tsx`) para testear componentes que dependen de Redux, MUI theme o React Router.

Los tests **no dependen del `.env` local** (que no está commiteado). Vite carga automáticamente `.env.test` en modo test, y ese archivo sí está commiteado con valores dummy — así los tests son herméticos y corren igual en tu máquina, en la de otro dev, o en CI. Si agregas una variable de entorno nueva a `.env`, agrégala también a `.env.test` con un valor seguro.

### Alias de imports

Usa `@/*` para referirte a `src/*` (configurado en `tsconfig.app.json` y `vite-tsconfig-paths`). Evita rutas relativas largas (`../../../`) al cruzar de un feature a otro.

## Git hooks

El proyecto usa Husky con tres hooks:

| Hook         | Qué corre                                                                                                               | Cuándo                     |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `pre-commit` | `lint-staged` (`eslint --fix` + `prettier --write` sobre los archivos en stage) y `tsc -b` (type-check completo)        | Antes de crear el commit   |
| `commit-msg` | `commitlint` contra el mensaje del commit                                                                               | Al escribir el mensaje     |
| `pre-push`   | `yarn test:run` + `yarn audit --groups dependencies` (solo si `package.json`/`yarn.lock` cambiaron en lo que se pushea) | Antes de subir a un remoto |

Si un hook falla, corrige lo que reporta antes de reintentar (`git commit`/`git push`). No se recomienda saltarlos con `--no-verify` salvo un caso excepcional acordado con el equipo.

El audit de `pre-push` solo bloquea el push si hay vulnerabilidades **alta o crítica** (moderadas/bajas solo generan una advertencia) — misma política que el gate de `docker-publish.yml` en CI. Es condicional a que `package.json`/`yarn.lock` cambien porque auditar contra una base de datos de CVEs que cambia con el tiempo no debería bloquear un commit/push que no toca dependencias.

### Mensajes de commit (Conventional Commits)

`commit-msg` exige el formato [Conventional Commits](https://www.conventionalcommits.org/): `<tipo>(<alcance opcional>): <descripción>`.

Tipos más usados: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`.

```
feat(auth): agregar refresh-token con cola de reintentos
fix(alerts): evitar duplicados en el snackbar
```

**Los PRs a `main`/`qa`/`dev` se mergean con squash merge** — GitHub colapsa todos los commits del PR en uno solo, usando el **título del PR** como mensaje final. Por eso:

- El **título del PR**, no cada commit individual, es lo que debe seguir Conventional Commits (ej. `feat: agregar refresh-token con cola de reintentos`)
- En CI, el paso `Lint del título del PR` en `ci.yml` valida `github.event.pull_request.title`, no el rango de commits del PR
- Los commits dentro del PR pueden ser informales ("wip", "fix typo") — de todas formas se descartan al mergear; el hook local `commit-msg` sigue siendo una buena práctica pero no es lo que se valida en CI

**Si falla el lint del título**: edítalo y espera a que CI corra de nuevo automáticamente (el trigger incluye `edited`, así que renombrar el título sí dispara un run nuevo con el título actualizado). Si no ves un run nuevo, dale un momento — GitHub a veces tarda unos segundos en encolarlo. **"Re-run jobs" sobre un run viejo no sirve**: reutiliza el payload congelado del evento original, con el título de ese momento, no el actual.

## Historial de modernización

Esta plantilla se actualizó tomando como referencia un proyecto hermano más maduro (`admin-center`) con el mismo stack. Resumen de lo agregado, para que quien retome el proyecto entienda el porqué de ciertas decisiones:

- **Testing**: Vitest + Testing Library + jsdom. Helper [`renderWithProviders`](src/test-utils/renderWithProviders.tsx) para testear componentes con Redux/MUI/Router. Los tests viven junto al código (`Xxx.test.ts(x)`), no en `__tests__/`.
- **Refresh-token**: [`src/lib/api/axios/Axios.ts`](src/lib/api/axios/Axios.ts) implementa cola de reintentos en 401 (patrón tomado de `admin-center`). Importante: el reintento de la petición original vive **fuera** del `try/catch` del refresh — si el reintento falla por una razón no relacionada con auth, no debe disparar `logOut()`.
- **`src/vite-env.d.ts`**: no existía. Sin este archivo, `import.meta.env.VITE_*` se tipaba como `any` en todo el proyecto y ocultaba errores reales de tipos en cascada.
- **ESLint**: config con `strictTypeChecked` + `stylisticTypeChecked` (type-aware), `eslint-plugin-react`, `jsx-a11y`, orden de imports automático (`simple-import-sort`), `unused-imports`, y reglas específicas de Vitest/Testing Library para archivos `*.test.*`. Es la config más estricta disponible en `typescript-eslint`; si se vuelve demasiado ruidosa para nuevas features, la alternativa más relajada es `recommendedTypeChecked` (sin las reglas puramente de estilo).
- **`tsconfig.app.json` / `tsconfig.node.json`**: `noUncheckedIndexedAccess: true` (accesos a arrays/objetos por índice devuelven `T | undefined`) y `composite: true` (requisito formal de `tsc -b` con project references).
- **Prettier + Husky + lint-staged + commitlint**: ver sección [Git hooks](#git-hooks) arriba.
- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): gates de `commitlint` (sobre el título del PR, no cada commit — se usa squash merge), `format:check`, `lint`, `test:run` y `build` en cada PR/push a `main`/`qa`/`dev`. `docker-publish.yml` está encadenado a que este workflow termine exitosamente.
- **Convención de features**: se unificó `models/` (plural) en todos los features — existía una carpeta `access/model` (singular) que se renombró para no repetir esa inconsistencia.

Si algo de esto genera fricción real en el día a día (por ejemplo, `tsc -b` en el pre-commit se siente lento, o `strictTypeChecked` es muy ruidoso para cierto tipo de código), es válido relajarlo — pero hacerlo de forma consciente y documentada aquí, no revirtiéndolo en silencio.
