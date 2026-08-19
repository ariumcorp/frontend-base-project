import {
  type TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

import type { ReduxDispatch, ReduxState } from "./store";

export const useAppDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReduxState> =
  useReduxSelector;
