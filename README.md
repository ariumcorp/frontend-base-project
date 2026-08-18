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

El proyecto usa Husky + lint-staged: en cada commit se corre `eslint --fix` y `prettier --write` sobre los archivos en stage. Si el hook falla, corrige el error reportado antes de reintentar el commit.
