import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { LanguageCode, Slice } from "@/utils";

import { initialStateLanguage } from "../models/language.model";

const languageSlice = createSlice({
  name: Slice.Language,
  initialState: initialStateLanguage,
  reducers: {
    setAvailableLanguages: (state, action: PayloadAction<string[]>) => {
      const newLangs = new Set([LanguageCode.Default, ...action.payload]);
      state.available = Array.from(newLangs);
    },
    resetLanguages: (state) => {
      state.available = initialStateLanguage.available;
    },
  },
});

export const { setAvailableLanguages, resetLanguages } = languageSlice.actions;
export default languageSlice.reducer;
