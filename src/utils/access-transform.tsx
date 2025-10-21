import type { Access } from "@/features/access";
import { routeRegistry } from "@/router/routeRegistry";
import { UnknownRoute } from "@/router/unknown-route";
import type { RouteObject } from "react-router-dom";
import { AccessType } from "./enum";

const findChildrenCurrentAccess = (
  currentAccess: Access,
  allAccess: Access[],
  pathParent: string[] = []
): Access => {
  const result: Access[] = [];
  const childrens = allAccess
    .filter((c) => c.parentCode === currentAccess.code)
    .sort((a, b) => a.order - b.order);

  pathParent.push(currentAccess.path);

  childrens.forEach((c) => {
    const newChildren = findChildrenCurrentAccess(c, allAccess, [
      ...pathParent,
    ]);
    result.push(newChildren);
  });
  currentAccess.children = result;
  currentAccess.pathsParent = pathParent;
  currentAccess.pathComplete = pathParent.join("");
  return currentAccess;
};

export const accessTransform = (accesses: Access[]): Access[] => {
  const result: Access[] = [];

  accesses
    .filter((c) => c.parentCode === null)
    .sort((a, b) => a.order - b.order)
    .forEach((c) => {
      const newChildren = findChildrenCurrentAccess(c, accesses);
      result.push(newChildren);
    });

  return result;
};

const buildDynamicChildren = (currentAccess: Access): RouteObject => {
  const Element = routeRegistry[currentAccess.code] ?? UnknownRoute; //<NotFound />;
  const path = currentAccess.pathsParent.join("");
  const routeCurrent: RouteObject =
    currentAccess.resourceTypeCode === AccessType.Option
      ? { path, element: <Element />, children: [], id: currentAccess.code }
      : { path, children: [], id: currentAccess.code };
  currentAccess.children.forEach((c) => {
    const children = buildDynamicChildren(c);
    routeCurrent.children?.push(children);
  });

  return routeCurrent;
};

export const getAccessToRoute = (access: Access[]) => {
  const routes: RouteObject[] = [{ index: true, element: <div />, id: "home" }];

  access.forEach((a) => {
    const routeCurrent: RouteObject = buildDynamicChildren(a);
    routes.push(routeCurrent);
  });

  return routes;
};
