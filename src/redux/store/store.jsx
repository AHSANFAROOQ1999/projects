import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../slices/accountSlice";
import storage from "redux-persist/lib/storage";
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
import cartReducer from "../slices/cartSlice";
import passwordSliceReducers from "../slices/passwordSlice";
import currencyReducer from "../slices/currencySlice";
import checkoutSlice from "../slices/checkoutSlice";
import multiLocationSlice from "../slices/multiLocationSlice";
import productPageSlice from "../slices/productPageSlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// ⬇ Do this if you want to retain state value on Reload.

const accountPersistedReducer = persistReducer(persistConfig, accountReducer);
const passwordSlice = persistReducer(persistConfig, passwordSliceReducers);
const checkoutPersistSlice = persistReducer(persistConfig, checkoutSlice);
const multiLocation = persistReducer(persistConfig, multiLocationSlice);

export const store = configureStore({
  reducer: {
    // ⬇ These Names will be Displayed in Redux Dev Tools and used to Access Slices

    account: accountPersistedReducer,
    password: passwordSlice,
    cart: cartReducer,
    currency: currencyReducer,
    checkout: checkoutPersistSlice,
    multiLocation: multiLocation,
    productPage: productPageSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
