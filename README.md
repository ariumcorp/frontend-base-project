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

### Alias de imports

Usa `@/*` para referirte a `src/*` (configurado en `tsconfig.app.json` y `vite-tsconfig-paths`). Evita rutas relativas largas (`../../../`) al cruzar de un feature a otro.

## Git hooks

El proyecto usa Husky con tres hooks:

| Hook         | Qué corre                                                                                                        | Cuándo                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `pre-commit` | `lint-staged` (`eslint --fix` + `prettier --write` sobre los archivos en stage) y `tsc -b` (type-check completo) | Antes de crear el commit   |
| `commit-msg` | `commitlint` contra el mensaje del commit                                                                        | Al escribir el mensaje     |
| `pre-push`   | `yarn test:run` (toda la suite de Vitest)                                                                        | Antes de subir a un remoto |

Si un hook falla, corrige lo que reporta antes de reintentar (`git commit`/`git push`). No se recomienda saltarlos con `--no-verify` salvo un caso excepcional acordado con el equipo.

### Mensajes de commit (Conventional Commits)

`commit-msg` exige el formato [Conventional Commits](https://www.conventionalcommits.org/): `<tipo>(<alcance opcional>): <descripción>`.

Tipos más usados: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`.

```
feat(auth): agregar refresh-token con cola de reintentos
fix(alerts): evitar duplicados en el snackbar
```

## Historial de modernización

Esta plantilla se actualizó tomando como referencia un proyecto hermano más maduro (`admin-center`) con el mismo stack. Resumen de lo agregado, para que quien retome el proyecto entienda el porqué de ciertas decisiones:

- **Testing**: Vitest + Testing Library + jsdom. Helper [`renderWithProviders`](src/test-utils/renderWithProviders.tsx) para testear componentes con Redux/MUI/Router. Los tests viven junto al código (`Xxx.test.ts(x)`), no en `__tests__/`.
- **Refresh-token**: [`src/lib/api/axios/Axios.ts`](src/lib/api/axios/Axios.ts) implementa cola de reintentos en 401 (patrón tomado de `admin-center`). Importante: el reintento de la petición original vive **fuera** del `try/catch` del refresh — si el reintento falla por una razón no relacionada con auth, no debe disparar `logOut()`.
- **`src/vite-env.d.ts`**: no existía. Sin este archivo, `import.meta.env.VITE_*` se tipaba como `any` en todo el proyecto y ocultaba errores reales de tipos en cascada.
- **ESLint**: config con `strictTypeChecked` + `stylisticTypeChecked` (type-aware), `eslint-plugin-react`, `jsx-a11y`, orden de imports automático (`simple-import-sort`), `unused-imports`, y reglas específicas de Vitest/Testing Library para archivos `*.test.*`. Es la config más estricta disponible en `typescript-eslint`; si se vuelve demasiado ruidosa para nuevas features, la alternativa más relajada es `recommendedTypeChecked` (sin las reglas puramente de estilo).
- **`tsconfig.app.json` / `tsconfig.node.json`**: `noUncheckedIndexedAccess: true` (accesos a arrays/objetos por índice devuelven `T | undefined`) y `composite: true` (requisito formal de `tsc -b` con project references).
- **Prettier + Husky + lint-staged + commitlint**: ver sección [Git hooks](#git-hooks) arriba.
- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): gates de `commitlint`, `format:check`, `lint`, `test:run` y `build` en cada PR/push a `main`/`dev`.
- **Convención de features**: se unificó `models/` (plural) en todos los features — existía una carpeta `access/model` (singular) que se renombró para no repetir esa inconsistencia.

Si algo de esto genera fricción real en el día a día (por ejemplo, `tsc -b` en el pre-commit se siente lento, o `strictTypeChecked` es muy ruidoso para cierto tipo de código), es válido relajarlo — pero hacerlo de forma consciente y documentada aquí, no revirtiéndolo en silencio.
