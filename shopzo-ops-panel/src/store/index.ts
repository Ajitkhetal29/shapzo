import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import warehouseReducer from "./slices/warehouseSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    warehouse: warehouseReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
