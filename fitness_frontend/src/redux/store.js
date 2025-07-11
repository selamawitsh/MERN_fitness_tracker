import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // uses localStorage by default
import userReducer from "./reducer/userSlics.js";  // your user slice

// 1. Config object
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// 2. Combine reducers (even if you have only one now)
const rootReducer = combineReducers({
  user: userReducer,
});

// 3. Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create and export the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux-persist actions from serializability warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Create and export the persistor
export const persistor = persistStore(store);
