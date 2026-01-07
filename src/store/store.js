import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/store/slices/authSlice";
import bookingReducer from "@/store/slices/bookingSlice";
import { SplitApiSetting } from "@/services/SplitApiSetting";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};
const bookingPersistConfig = { key: "booking", storage };

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  booking: persistReducer(bookingPersistConfig, bookingReducer),
  [SplitApiSetting.reducerPath]: SplitApiSetting.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      SplitApiSetting.middleware
    ),
});

export const persistor = persistStore(store);
