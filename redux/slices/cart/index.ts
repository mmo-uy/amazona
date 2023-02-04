import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Product, ProductInCart } from "../../../types";
import Cookies from "js-cookie";

interface CartState {
  items: ProductInCart[];
}
const initialState: CartState = {
  items: Cookies.get("cart") ? JSON.parse(Cookies.get("cart")!) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ product: Product; qty?: number }>
    ) => {
      const itemInCart = state.items.find(
        (item) => item.id === action.payload.product.id
      );
      if (itemInCart) {
        if (action.payload.qty) {
          itemInCart.quantity = action.payload.qty;
          // itemInCart.stock! -= action.payload.qty;
        } else {
          itemInCart.quantity++;
          // itemInCart.stock!--;
        }
      } else {
        state.items.push({
          ...action.payload.product,
          quantity: action.payload.qty ?? 1,
        });
      }
      Cookies.set("cart", JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<ProductInCart>) => {
      const removeItem = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      Cookies.set("cart", JSON.stringify(removeItem));
      state.items = removeItem;
    },
    removeAll: (state, action) => {
      state.items = [];
    },
  },
});
export const { addItem, removeAll, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
