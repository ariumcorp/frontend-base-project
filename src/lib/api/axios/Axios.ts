import type { ReduxStore } from "@/app/index";
import { getUrlBackend, useAuth, ApiRoutes } from "@/utils";
import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { logOut, setCredentials } from "@/features/auth/slice/auth.slice";

const axiosInstance = axios.create({
  baseURL: getUrlBackend(),
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// Cola de peticiones que llegaron mientras se refrescaba el token,
// para reintentarlas todas con el token nuevo en cuanto esté disponible.
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  pendingRequests.push(callback);
}

function onTokenRefreshed(token: string) {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
}

async function refreshAccessToken(
  store: ReduxStore,
  refreshToken: string
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
    (error) => Promise.reject(error)
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

      if (!originalRequest.headers) {
        originalRequest.headers = new AxiosHeaders();
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refreshAccessToken(store, refreshToken);
        onTokenRefreshed(newAccessToken);
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        pendingRequests = [];
        store.dispatch(logOut());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

export default axiosInstance;
