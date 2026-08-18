import { describe, expect, it } from "vitest";

import { ThemeCode } from "@/utils";

import { initialStateTheme } from "../models/theme.model";

import themeReducer, { toggleTheme } from "./theme.slice";

describe("themeSlice", () => {
  it("returns the initial state", () => {
    expect(themeReducer(undefined, { type: "@@INIT" })).toEqual(
      initialStateTheme,
    );
  });

  it("toggles from dark to light", () => {
    const state = themeReducer({ mode: ThemeCode.Dark }, toggleTheme());
    expect(state.mode).toBe(ThemeCode.Light);
  });

  it("toggles from light to dark", () => {
    const state = themeReducer({ mode: ThemeCode.Light }, toggleTheme());
    expect(state.mode).toBe(ThemeCode.Dark);
  });
});
