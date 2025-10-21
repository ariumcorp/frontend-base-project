import { useAppDispatch } from "@/app/";
import { useNotifier } from "@/features/alerts/hooks/useNotifier";
import { setCredentials, type LoginRequest } from "@/features/auth";
import { hideLoading, openLoading } from "@/features/loading";
import { authApi } from "@/lib/api";
import { PagePath } from "@/utils";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { errorFromApi } = useNotifier(t);

  const login = async (payload: LoginRequest) => {
    try {
      dispatch(openLoading());
      setIsLoading(true);

      const data = await authApi.login(payload);

      dispatch(setCredentials(data));

      navigate(PagePath.Root);
    } catch (err) {
      errorFromApi(err);
    } finally {
      setIsLoading(false);
      dispatch(hideLoading());
    }
  };

  return { login, isLoading };
}
