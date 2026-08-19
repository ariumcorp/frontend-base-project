import { Backdrop, CircularProgress, Typography } from "@mui/material";

import { useAppSelector } from "@/app/";

export const GlobalLoading = () => {
  const { open, message } = useAppSelector((state) => state.loadingSlice);
  return (
    <Backdrop
      open={open}
      sx={{ zIndex: 9999, color: "#fff", flexDirection: "column" }}
    >
      <CircularProgress color="inherit" />
      {message && <Typography mt={2}>{message}</Typography>}
    </Backdrop>
  );
};
