import { getEnv } from "@/lib/env/envService";

export const getKeyEncrypt = (): string => {
  return getEnv("VITE_REDUX_PERSIST_ENCRYPT");
};

export const isProd = (): boolean => {
  return getEnv("VITE_IS_PROD").toLowerCase() === "true";
};

export const getUrlBackend = (): string => {
  return getEnv("VITE_URL_BACKEND");
};

export const hasInvisible = (s: string) => /\p{Cf}/u.test(s);

export const sanitize = (s: string) =>
  s.normalize("NFC").replace(/\p{Cf}+/gu, "");

export const equalsClean = (a: string, b: string) =>
  sanitize(a) === sanitize(b);

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useAuth = (): boolean => {
  return getEnv("VITE_USE_AUTH").toLowerCase() === "true";
};

export * from "./access-transform";
export * from "./api-routes";
export * from "./enum";
