import { makeAuthApi } from "@/features/auth";

import { AxiosApiClient } from "./axios/AxiosApiClient";
import { IdentityAxiosApiClient } from "./axios/IdentityAxiosApiClient";

export const identityApi = new IdentityAxiosApiClient();
export const api = new AxiosApiClient();

export const authApi = makeAuthApi(identityApi);
