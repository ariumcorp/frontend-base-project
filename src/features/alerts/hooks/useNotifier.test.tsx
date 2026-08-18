import type { PropsWithChildren } from "react";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Severity } from "@/utils";
import { alertSlice } from "../slice/alert.slice";
import { useNotifier } from "./useNotifier";

function createTestStore() {
  return configureStore({
    reducer: combineReducers({ alertSlice: alertSlice.reducer }),
  });
}

function wrapper(store: ReturnType<typeof createTestStore>) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  };
}

describe("useNotifier", () => {
  it("dispatches a success alert", () => {
    const store = createTestStore();
    const { result } = renderHook(() => useNotifier(), {
      wrapper: wrapper(store),
    });

    act(() => {
      result.current.success("Operación exitosa");
    });

    const { queue } = store.getState().alertSlice;
    expect(queue).toHaveLength(1);
    expect(queue[0]).toMatchObject({
      message: "Operación exitosa",
      severity: Severity.Success,
    });
  });

  it("deduplicates identical messages in a single call", () => {
    const store = createTestStore();
    const { result } = renderHook(() => useNotifier(), {
      wrapper: wrapper(store),
    });

    act(() => {
      result.current.error(["Error X", "Error X"]);
    });

    expect(store.getState().alertSlice.queue).toHaveLength(1);
  });

  it("errorFromApi extracts message from an API error payload", () => {
    const store = createTestStore();
    const { result } = renderHook(() => useNotifier(), {
      wrapper: wrapper(store),
    });

    act(() => {
      result.current.errorFromApi({
        errors: [{ code: "invalid_credentials" }],
      });
    });

    const { queue } = store.getState().alertSlice;
    expect(queue).toHaveLength(1);
    expect(queue[0].severity).toBe(Severity.Error);
  });
});
