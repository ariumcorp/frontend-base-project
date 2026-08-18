import { createSlice } from "@reduxjs/toolkit";

import { Slice, ThemeCode } from "@/utils";

import { initialStateTheme } from "../models/theme.model";

const themeSlice = createSlice({
  name: Slice.Theme,
  initialState: initialStateTheme,

  reducers: {
    toggleTheme: (state) => {
      state.mode =
        state.mode === ThemeCode.Light ? ThemeCode.Dark : ThemeCode.Light;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
