import {
  type Action,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";
// import {
//   useDispatch as useReduxDispatch,
//   useSelector as useReduxSelector,
//   type TypedUseSelectorHook,
// } from "react-redux";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";

import { api, identityApi } from "@/lib/api";

//import { dbService } from "services";
//import { attachInterceptors } from "../api/api-config";
//import { identityAxiosAttachInterceptors } from "@/lib/api/axios/IdentityAxios";
import { getKeyEncrypt, isProd } from "../utils/";

import { resetApp } from "./appActions";
import { middlewares } from "./middleware";
import { reduxPersistWhiteList } from "./reduxPersistWhitelist";
import { reducer } from "./rootReducer";

//import { fetchAllProcessedSurveys, fetchAllSurveys } from "./thunk";

const rootReducerBase = combineReducers({
  ...reducer,
});

// const rootReducer: typeof rootReducerBase = (state, action) => {
//   if (action.type === authSlice.actions.cleanValuesAuth().type) {
//     return rootReducerBase(undefined, action);
//   }
//   return rootReducerBase(state, action);
// };

const persistConfig = {
  key: "root",
  storage,
  whitelist: reduxPersistWhiteList,
  transforms: [
    encryptTransform({
      secretKey: getKeyEncrypt(), // ¡Llave para le encriptacion en el localstorage!
      onError: (error) => {
        console.error("Error en la encriptación del estado:", error);
      },
    }),
  ],
};

//const persistedReducer = persistReducer(persistConfig, rootReducer);
const persistedReducer = persistReducer<ReturnType<typeof rootReducerBase>>(
  persistConfig,
  rootReducerBase,
);

export const reduxStore = configureStore({
  reducer: persistedReducer,
  devTools: !isProd(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora estas acciones de redux-persist
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(middlewares),
});

identityApi.attachInterceptors(reduxStore);
api.attachInterceptors(reduxStore);

// --- INICIALIZACIÓN GLOBAL DE LA APP ---
// 1. Inicia los listeners para que reaccionen a cualquier cambio futuro
//dbService.initializeListeners(reduxStore.dispatch);

// 2. Inicia la replicación con CouchDB
//dbService.startReplication();

// 3. Carga los datos iniciales que ya existen en PouchDB
//reduxStore.dispatch(fetchAllSurveys());
//reduxStore.dispatch(fetchAllProcessedSurveys());
// ------------------------------------

/* 
Types */
export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;

export const reduxPersistor = persistStore(reduxStore);

// ⬇️ función de utilidad para cerrar sesión limpiamente
export const logoutAndReset = () => (dispatch: ReduxDispatch) => {
  // reduxPersistor.pause();
  // await reduxPersistor.flush();
  // await reduxPersistor.purge();
  dispatch(resetApp());
  //dispatch(logout());
  // reduxPersistor.persist();
};
