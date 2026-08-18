import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { useTranslate } from "@tolgee/react";

import { LoginForm, useLogin } from "@/features/auth/";

const LoginPage: React.FC = () => {
  const { t } = useTranslate();
  const { login, isLoading } = useLogin();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {t("login.title", "Iniciar Sesión")}
        </Typography>
        <LoginForm onSubmit={login} isLoading={isLoading} />
      </Box>
    </Container>
  );
};

export default LoginPage;
