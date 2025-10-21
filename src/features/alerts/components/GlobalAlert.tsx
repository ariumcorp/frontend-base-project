import { Alert, Snackbar } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/";
import { alertSlice } from "../slice/alert.slice";

const DEFAULT_DURATION = 4000;

export const GlobalAlert = () => {
  const dispatch = useAppDispatch();
  const { queue } = useAppSelector((state) => state.alertSlice); // <-- AJUSTADO
  const current = queue[0] ?? null;

  const autoHideDuration = useMemo(() => {
    if (!current) return undefined;
    if (current.duration === null) return undefined;
    return current.duration ?? DEFAULT_DURATION;
  }, [current]);

  const handleClose = useCallback(() => {
    if (!current) return;
    dispatch(alertSlice.actions.removeAlert(current.id));
  }, [dispatch, current]);

  return (
    <Snackbar
      key={current?.id ?? "no-alert"}
      open={!!current}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {current ? (
        <Alert
          severity={current.severity}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          {current.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
};
