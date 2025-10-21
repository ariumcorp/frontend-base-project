import React from "react";

export const routeRegistry: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<object>>
> = {
  home: React.lazy(() => import("../pages/LoginPage")),
};
