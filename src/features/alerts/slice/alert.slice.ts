import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialStateAlerts, type AlertItem } from "../models/alert.model";
import { Slice } from "@/utils";

export const alertSlice = createSlice({
  name: Slice.Alert,
  initialState: initialStateAlerts,
  reducers: {
    showAlert: {
      prepare: (payload: Omit<AlertItem, "id">) => ({
        payload: { ...payload, id: `alert_${new Date().toISOString()}` },
      }),
      reducer: (state, action: PayloadAction<AlertItem>) => {
        state.queue.push(action.payload);
      },
    },
    showAlerts: (state, action: PayloadAction<Omit<AlertItem, "id">[]>) => {
      for (const a of action.payload) {
        state.queue.push({ ...a, id: `alert_${new Date().toISOString()}` });
      }
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((a) => a.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.queue = [];
    },
  },
});

export const { showAlert, showAlerts, removeAlert, clearAlerts } =
  alertSlice.actions;

export default alertSlice.reducer;
