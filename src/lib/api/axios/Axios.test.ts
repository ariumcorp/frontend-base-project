import { configureStore, combineReducers } from "@reduxjs/toolkit";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import authReducer from "@/features/auth/slice/auth.slice";
import type { ReduxStore } from "@/app/index";
import axiosInstance, { axiosAttachInterceptors } from "./Axios";

function createTestStore(preloadedState?: {
  authSlice?: { accessToken: string; refreshToken: string; message: string };
}) {
  return configureStore({
    reducer: combineReducers({ authSlice: authReducer }),
    preloadedState,
  });
}

describe("axiosAttachInterceptors — refresh token queue", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
    // axiosAttachInterceptors adds handlers on the shared singleton instance;
    // clear them so each test starts with a single, known interceptor pair.
    axiosInstance.interceptors.request.clear();
    axiosInstance.interceptors.response.clear();
  });

  it("adds the access token to outgoing requests", async () => {
    const store = createTestStore({
      authSlice: {
        accessToken: "token-abc",
        refreshToken: "refresh-abc",
        message: "",
      },
    }) as unknown as ReduxStore;
    axiosAttachInterceptors(store);

    mock.onGet("/ping").reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer token-abc");
      return [200, { ok: true }];
    });

    const response = await axiosInstance.get("/ping");
    expect(response.data).toEqual({ ok: true });
  });

  it("refreshes the token on a 401 and retries the original request once", async () => {
    const store = createTestStore({
      authSlice: {
        accessToken: "expired-token",
        refreshToken: "refresh-abc",
        message: "",
      },
    }) as unknown as ReduxStore;
    axiosAttachInterceptors(store);

    let callCount = 0;
    mock.onGet("/protected").reply((config) => {
      callCount += 1;
      if (config.headers?.Authorization === "Bearer expired-token") {
        return [401, { message: "expired" }];
      }
      return [200, { data: "secret" }];
    });

    const mockAxiosPost = new MockAdapter(axios);
    mockAxiosPost.onPost(/auth\/refresh/).reply(200, {
      accessToken: "new-token",
      refreshToken: "refresh-abc",
      message: "",
    });

    const response = await axiosInstance.get("/protected");

    expect(response.data).toEqual({ data: "secret" });
    expect(callCount).toBe(2);
    expect(store.getState().authSlice.accessToken).toBe("new-token");

    mockAxiosPost.restore();
  });

  it("logs out when the refresh token request fails", async () => {
    const store = createTestStore({
      authSlice: {
        accessToken: "expired-token",
        refreshToken: "refresh-abc",
        message: "",
      },
    }) as unknown as ReduxStore;
    axiosAttachInterceptors(store);

    mock.onGet("/protected").reply(401, { message: "expired" });

    const mockAxiosPost = new MockAdapter(axios);
    mockAxiosPost.onPost(/auth\/refresh/).reply(401, { message: "invalid" });

    await expect(axiosInstance.get("/protected")).rejects.toBeTruthy();
    expect(store.getState().authSlice.accessToken).toBe("");

    mockAxiosPost.restore();
  });
});
