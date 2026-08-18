import type { ReduxStore } from "@/app/index";

import { type ApiClient } from "../ApiClient";

import axiosInstance, { axiosAttachInterceptors } from "./Axios";

export class AxiosApiClient implements ApiClient {
  private client = axiosInstance;

  async get<T>(url: string): Promise<T> {
    const { data } = await this.client.get<T>(url);
    return data;
  }

  async post<T, B = unknown>(url: string, body?: B): Promise<T> {
    const { data } = await this.client.post<T>(url, body);
    return data;
  }

  async put<T, B = unknown>(url: string, body?: B): Promise<T> {
    const { data } = await this.client.put<T>(url, body);
    return data;
  }

  async delete<T>(url: string): Promise<T> {
    const { data } = await this.client.delete<T>(url);
    return data;
  }

  attachInterceptors(store: ReduxStore): void {
    axiosAttachInterceptors(store);
  }
}
