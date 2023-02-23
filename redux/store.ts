import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { CartReducer, ProductsReducer, OrderReducer } from "./slices";

export const store = configureStore({
  reducer: {
    products: ProductsReducer,
    cart: CartReducer,
    order: OrderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
