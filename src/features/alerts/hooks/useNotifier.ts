import { useCallback, useMemo } from "react";
import axios from "axios";
import { useTranslate } from "@tolgee/react";
import type { TranslationParams } from "@/types/common.types";
import { useAppDispatch } from "@/app/";
import { Severity } from "@/utils";
import { alertSlice } from "../slice/alert.slice";

export type ApiErrorPayload = {
  errors: Array<{ code: string; params?: TranslationParams }>;
};

type TFn = ReturnType<typeof useTranslate>["t"];

export type MsgInput =
  | string
  | {
      key: string;
      params?: TranslationParams;
      defaultValue?: string;
      raw?: boolean;
    };

const hasMessage = (x: unknown): x is { message: string } =>
  typeof x === "object" &&
  x !== null &&
  "message" in x &&
  typeof (x as { message: unknown }).message === "string";

const isApiErrorPayload = (x: unknown): x is ApiErrorPayload =>
  typeof x === "object" &&
  x !== null &&
  "errors" in x &&
  Array.isArray((x as { errors: unknown }).errors);

// --- El Hook Principal ---

export function useNotifier(t?: TFn) {
  const dispatch = useAppDispatch();

  const renderMsg = useCallback(
    (m: MsgInput): string => {
      if (typeof m === "string") return t ? t(m) : m;

      if (m.raw) return m.key;

      const translated = t ? t(m.key, m.params) : m.key;

      if (translated === m.key && m.defaultValue) {
        return m.defaultValue;
      }
      return translated;
    },
    [t]
  );

  const notify = useCallback(
    (severity: Severity, messages: MsgInput | MsgInput[]) => {
      const list = Array.isArray(messages) ? messages : [messages];
      const translated = list.map(renderMsg).filter(Boolean);
      const unique = Array.from(new Set(translated));
      if (!unique.length) return;

      dispatch(
        alertSlice.actions.showAlerts(
          unique.map((message) => ({ message, severity }))
        )
      );
    },
    [dispatch, renderMsg]
  );

  // --- Funciones de Conveniencia ---
  const success = useCallback(
    (m: MsgInput | MsgInput[]) => notify(Severity.Success, m),
    [notify]
  );
  const info = useCallback(
    (m: MsgInput | MsgInput[]) => notify(Severity.Info, m),
    [notify]
  );
  const warn = useCallback(
    (m: MsgInput | MsgInput[]) => notify(Severity.Warning, m),
    [notify]
  );
  const error = useCallback(
    (m: MsgInput | MsgInput[]) => notify(Severity.Error, m),
    [notify]
  );

  // --- Manejador de Errores de API ---
  const errorFromApi = useMemo(() => {
    return (
      err: unknown,
      fallbackKey = "errors.unexpected",
      fallbackDefault = "Ha ocurrido un error inesperado."
    ) => {
      // 1. Payload de error de tu API
      if (isApiErrorPayload(err)) {
        const msgs: MsgInput[] = err.errors.map((e) => ({
          key: e.code,
          params: e.params,
        }));
        return error(
          msgs.length
            ? msgs
            : [{ key: fallbackKey, defaultValue: fallbackDefault }]
        );
      }

      // 2. Error de Axios
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (isApiErrorPayload(data)) {
          const msgs: MsgInput[] = data.errors.map((e) => ({
            key: e.code,
            params: e.params,
          }));
          return error(
            msgs.length
              ? msgs
              : [{ key: fallbackKey, defaultValue: fallbackDefault }]
          );
        }
        if (hasMessage(data)) return error({ key: data.message, raw: true });
      }

      // 3. String plano o un objeto con `message`
      if (typeof err === "string") return error({ key: err, raw: true });
      if (hasMessage(err)) return error({ key: err.message, raw: true });

      // 4. Fallback final
      return error({ key: fallbackKey, defaultValue: fallbackDefault });
    };
  }, [error]);

  return { notify, success, info, warn, error, errorFromApi };
}
