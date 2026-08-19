import React, { useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useTranslate } from "@tolgee/react";

import type { LoginRequest } from "../models/auth.model";

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const { t } = useTranslate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void onSubmit({ username, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        margin="normal"
        fullWidth
        required
        id="username"
        name="Usuario"
        label={t("login.field.code", "Código de Usuario")}
        autoComplete="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <TextField
        margin="normal"
        fullWidth
        required
        id="contrasena"
        name="contrasena"
        label={t("login.field.password", "Contraseña")}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          t("login.button.submit", "Ingresar")
        )}
      </Button>
    </Box>
  );
};
