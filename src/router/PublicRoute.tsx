import { useAppSelector } from "@/app/";
import { selectCurrentToken } from "@/features/auth";
import { PagePath, useAuth } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = useAppSelector(selectCurrentToken);

  if (!useAuth()) {
    return <Navigate to={PagePath.Root} replace />;
  }

  return token ? <Navigate to={PagePath.Root} replace /> : <Outlet />;
};

export default PublicRoute;
