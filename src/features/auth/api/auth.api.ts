import type { ApiClient } from "@/lib/api/ApiClient";
import type { ResponseApi } from "@/models";
import { ApiRoutes } from "@/utils";

import {
  type Auth,
  authStateSchema,
  type LoginRequest,
} from "../models/auth.model";

export const makeAuthApi = (apiClient: ApiClient) => {
  return {
    async login(payload: LoginRequest): Promise<Auth> {
      const response = await apiClient.post<ResponseApi<Auth>, LoginRequest>(
        ApiRoutes.Security.AuthenticateUser,
        payload,
      );
      const validatedData = authStateSchema.parse(response.resource);

      return validatedData;
    },
  };
};
