import type { Middleware } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import { isProd } from "@/utils";

import { apiSlice } from "./apiSlice";

const middlewares: Middleware[] = [];

middlewares.push(apiSlice.middleware);
if (!isProd()) {
  middlewares.push(
    createLogger({
      duration: true,
      timestamp: false,
      collapsed: true,
      colors: {
        title: () => "#139BFE",
        prevState: () => "#1C5FAF",
        action: () => "#149945",
        nextState: () => "#A47104",
        error: () => "#ff0005",
      },
      predicate: () => typeof window !== "undefined",
    }),
  );
}

export { middlewares };
