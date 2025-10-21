import type { ReduxStore } from "@/app/index";

export interface ApiClient {
  get<T>(url: string, config?: RequestInit): Promise<T>;
  post<T, B = unknown>(url: string, body?: B, config?: RequestInit): Promise<T>;
  put<T, B = unknown>(url: string, body?: B, config?: RequestInit): Promise<T>;
  delete<T>(url: string, config?: RequestInit): Promise<T>;
  attachInterceptors(store: ReduxStore): void;
}
