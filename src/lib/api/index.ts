import { IdentityAxiosApiClient } from "./axios/IdentityAxiosApiClient";
import { AxiosApiClient } from "./axios/AxiosApiClient";
import { makeAuthApi } from "@/features/auth";

export const identityApi = new IdentityAxiosApiClient();
export const api = new AxiosApiClient();

export const authApi = makeAuthApi(identityApi);
