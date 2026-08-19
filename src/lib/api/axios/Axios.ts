import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import type { ReduxStore } from "@/app/index";
import { logOut, setCredentials } from "@/features/auth/slice/auth.slice";
import { ApiRoutes, getUrlBackend, useAuth } from "@/utils";

const axiosInstance = axios.create({
  baseURL: getUrlBackend(),
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// Cola de peticiones que llegaron mientras se refrescaba el token,
// para reintentarlas todas con el token nuevo en cuanto esté disponible.
let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  pendingRequests.push(callback);
}

function onTokenRefreshed(token: string) {
  pendingRequests.forEach((callback) => {
    callback(token);
  });
  pendingRequests = [];
}

async function refreshAccessToken(
  store: ReduxStore,
  refreshToken: string,
): Promise<string> {
  const response = await axios.post<{
    accessToken: string;
    refreshToken: string;
    message: string;
  }>(`${getUrlBackend()}/${ApiRoutes.Security.RefreshToken}`, {
    refreshToken,
  });

  store.dispatch(setCredentials(response.data));
  return response.data.accessToken;
}

export function axiosAttachInterceptors(store: ReduxStore) {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = store.getState().authSlice;

      if (accessToken && useAuth()) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      const { refreshToken } = store.getState().authSlice;
      if (!refreshToken) {
        store.dispatch(logOut());
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        const token = await new Promise<string>((resolve) => {
          subscribeTokenRefresh(resolve);
        });
        originalRequest.headers.set("Authorization", `Bearer ${token}`);
        return axiosInstance(originalRequest);
      }

      isRefreshing = true;
      let newAccessToken: string;
      try {
        newAccessToken = await refreshAccessToken(store, refreshToken);
      } catch (refreshError) {
        pendingRequests = [];
        store.dispatch(logOut());
        return await Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error(String(refreshError)),
        );
      } finally {
        isRefreshing = false;
      }

      onTokenRefreshed(newAccessToken);
      originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
      return axiosInstance(originalRequest);
    },
  );
}

export default axiosInstance;
