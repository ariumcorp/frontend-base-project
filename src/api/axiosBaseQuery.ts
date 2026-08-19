import { type BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";

import axiosInstance from "@/lib/api/axios/Axios";

export const axiosBaseQuery =
  (): BaseQueryFn<{
    url: string;
    method?: AxiosRequestConfig["method"];
    body?: unknown;
    params?: Record<string, unknown>;
  }> =>
  async ({ url, method = "get", body, params }) => {
    try {
      const result = await axiosInstance<unknown>({
        url,
        method,
        data: body,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };
