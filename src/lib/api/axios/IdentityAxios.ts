import type { ReduxStore } from "@/app/index";
import { getUrlBackend } from "@/utils";
import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
//import type { ReduxStore } from "../../../app/store";

const urlBackend = getUrlBackend();
const httpOption = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
const identityAxios = axios.create({
  baseURL: urlBackend,
  headers: httpOption,
});

export function identityAxiosAttachInterceptors(store: ReduxStore) {
  identityAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { authSlice } = store.getState();
      const accessToken = authSlice.accessToken;

      if (accessToken) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        } else if (!config.headers.set) {
          config.headers = new AxiosHeaders(config.headers);
        }
        (config.headers as AxiosHeaders).set(
          "Content-Type",
          "application/json"
        );
        (config.headers as AxiosHeaders).set(
          "Authorization",
          `Bearer ${accessToken}`
        );
      }
      return config;
    }
  );

  identityAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
}

export default identityAxios;
