const reduxPersistEncrypt = import.meta.env.VITE_REDUX_PERSIST_ENCRYPT;
const valueIsProd = import.meta.env.VITE_IS_PROD;
const urlBackend = import.meta.env.VITE_URL_BACKEND;
const valueUseAuth = import.meta.env.VITE_USE_AUTH;

export const getKeyEncrypt = (): string => {
  return reduxPersistEncrypt;
};

export const isProd = (): boolean => {
  return valueIsProd.toLowerCase() === "true";
};

export const getUrlBackend = (): string => {
  return urlBackend;
};

export const hasInvisible = (s: string) => /\p{Cf}/u.test(s);

export const sanitize = (s: string) =>
  s.normalize("NFC").replace(/\p{Cf}+/gu, "");

export const equalsClean = (a: string, b: string) =>
  sanitize(a) === sanitize(b);

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useAuth = (): boolean => {
  return valueUseAuth.toLowerCase() === "true";
};

export * from "./access-transform";
export * from "./api-routes";
export * from "./enum";
