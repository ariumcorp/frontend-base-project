import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/app/";
import { selectCurrentToken } from "@/features/auth";
import { PagePath, useAuth } from "@/utils";

const PublicRoute = () => {
  const token = useAppSelector(selectCurrentToken);

  if (!useAuth()) {
    return <Navigate to={PagePath.Root} replace />;
  }

  return token ? <Navigate to={PagePath.Root} replace /> : <Outlet />;
};

export default PublicRoute;
