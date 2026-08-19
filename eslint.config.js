import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import vitest from "eslint-plugin-vitest";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "coverage",
    "android",
    "ios",
    "src-tauri",
    "*.config.js",
  ]),

  // Base: todo el código de la app (TS + TSX)
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // El unused-imports plugin reemplaza a la regla nativa (mejor autofix)
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^react", "^@?\\w"], // paquetes externos
            ["^@/"], // alias interno
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"], // ../
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"], // ./
          ],
        },
      ],
      "simple-import-sort/exports": "warn",
      // Redux Toolkit muta el estado dentro de los reducers vía Immer,
      // por eso se relaja esta regla en slices (ver override abajo).
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },

  // Slices de Redux: la mutación de `state` es el patrón esperado (Immer)
  {
    files: ["src/**/*.slice.ts", "src/**/slice/*.ts"],
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
    },
  },

  // Clientes HTTP: el genérico <B> de post/put es intencional — permite al
  // caller tipar el body en el call site (ej. apiClient.post<Res, Body>(...)),
  // aunque solo aparezca una vez en la firma del método.
  {
    files: ["src/lib/api/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
    },
  },

  // Tests: reglas de vitest + testing-library
  {
    files: ["src/**/*.test.{ts,tsx}"],
    extends: [vitest.configs.recommended, testingLibrary.configs["flat/react"]],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Config files fuera de src (vite.config.ts, etc.) — sin type-checking estricto
  {
    files: ["*.ts", "*.config.ts"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Prettier siempre al final para anular reglas de estilo
  eslintConfigPrettier,
]);
