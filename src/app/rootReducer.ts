import type { Reducer, UnknownAction } from "@reduxjs/toolkit";

import { alertReducer, initialStateAlerts } from "@/features/alerts";
import { authReducer, initialStateAuth } from "@/features/auth";
import { languageReducer } from "@/features/language";
import { initialStateLoading, loadingReducer } from "@/features/loading";
import { themeReducer } from "@/features/theme";

import { apiSlice } from "./apiSlice";
import { resetApp } from "./appActions";

const makeResettable =
  <S>(reducer: Reducer<S>, initial: S) =>
  (state: S | undefined, action: UnknownAction): S => {
    if (resetApp.match(action)) return initial;
    return reducer(state, action);
  };

export const reducer = {
  themeSlice: themeReducer,
  languageSlice: languageReducer,
  authSlice: makeResettable(authReducer, initialStateAuth),
  alertSlice: makeResettable(alertReducer, initialStateAlerts),
  loadingSlice: makeResettable(loadingReducer, initialStateLoading),
  [apiSlice.reducerPath]: apiSlice.reducer,
};
