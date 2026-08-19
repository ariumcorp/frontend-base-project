import { createSlice } from "@reduxjs/toolkit";

import { Slice } from "@/utils";

import { initialStateLoading } from "../models/loading.model";

export const loadingSlice = createSlice({
  name: Slice.Loading,
  initialState: initialStateLoading,
  reducers: {
    hideLoading: (state) => {
      return { ...state, ...initialStateLoading };
    },
    openLoading: (state) => {
      return { ...state, open: true };
    },
  },
});

export const { hideLoading, openLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
