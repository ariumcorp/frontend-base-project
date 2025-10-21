import { alertReducer, initialStateAlerts } from "@/features/alerts";
import { authReducer, initialStateAuth } from "@/features/auth";
import { languageReducer } from "@/features/language";
import { initialStateLoading, loadingReducer } from "@/features/loading";
import { themeReducer } from "@/features/theme";
import type { AnyAction, Reducer } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { resetApp } from "./appActions";

const makeResettable =
  <S>(reducer: Reducer<S>, initial: S) =>
  (state: S | undefined, action: AnyAction): S => {
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
