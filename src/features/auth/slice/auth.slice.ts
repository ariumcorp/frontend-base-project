import type { ReduxState } from "@/app/";
import { Slice } from "@/utils";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialStateAuth, type Auth } from "../models/auth.model";

const authSlice = createSlice({
  name: Slice.Auth,
  initialState: initialStateAuth,
  reducers: {
    setCredentials: (state, action: PayloadAction<Auth>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.message = action.payload.message;
    },

    logOut: (state) => {
      return { ...state, ...initialStateAuth };
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: ReduxState) =>
  state.authSlice.accessToken;
