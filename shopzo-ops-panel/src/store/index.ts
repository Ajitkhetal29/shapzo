import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import warehouseReducer from "./slices/warehouseSlice";
import userReducer from "./slices/userSlice";
import vendorReducer from "./slices/vendorSlice";
import generalReducer from "./slices/genralSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    warehouse: warehouseReducer,
    user: userReducer,
    vendor: vendorReducer,
    general: generalReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
