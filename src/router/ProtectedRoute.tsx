import { useAppSelector } from "@/app/";
import { selectCurrentToken } from "@/features/auth/";
import { PagePath, useAuth } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = useAppSelector(selectCurrentToken);

  if (!useAuth()) {
    return <Outlet />;
  }

  return token ? <Outlet /> : <Navigate to={PagePath.Login} replace />;
};

export default ProtectedRoute;
