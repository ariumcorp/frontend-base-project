import type { ReduxStore } from "@/app/index";
import { useAuth } from "@/utils";
import axios, { AxiosError } from "axios";
const axiosInstance = axios.create();

export function axiosAttachInterceptors(store: ReduxStore) {
  axiosInstance.interceptors.request.use(
    async (config) => {
      // 1. Importamos la store dinámicamente para evitar dependencias circulares.

      const { accessToken } = store.getState().authSlice;
      const backendUrl = "";
      // 2. Si no hay una URL de backend (ej: el usuario no ha iniciado sesión),
      // la petición no puede continuar. Rechazamos la promesa con un error.
      if (!backendUrl) {
        return Promise.reject(
          new Error("No se ha definido la URL del backend. Inicia sesión.")
        );
      }

      // 3. Si hay un token, lo añadimos a la cabecera de autorización.
      if (accessToken && useAuth()) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // 4. Construimos la URL completa para esta petición específica.
      // Esto combina la URL base del estado de Redux con el endpoint de la petición.
      // ej: 'https://mi-backend.com/api' + '/products'
      config.url = backendUrl + config.url;

      return config;
    },
    (error) => {
      // Para errores en la configuración de la petición
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
