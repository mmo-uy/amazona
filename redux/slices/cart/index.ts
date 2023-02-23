import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Product, ProductInCart } from "../../../types";
import Cookies from "js-cookie";
import { ShippingAddress, PaymentMethod } from "../../../types/index";

interface CartState {
  items: ProductInCart[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
}
const initialState: CartState = {
  items: Cookies.get("cart") ? JSON.parse(Cookies.get("cart")!) : [],
  shippingAddress: Cookies.get("shippingAddress")
    ? JSON.parse(Cookies.get("shippingAddress")!)
    : {},
  paymentMethod: Cookies.get("paymentMethod")
    ? JSON.parse(Cookies.get("paymentMethod")!)
    : {},
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
        (item) => item._id === action.payload.product._id
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
        (item) => item._id !== action.payload._id
      );
      Cookies.set("cart", JSON.stringify(removeItem));
      state.items = removeItem;
    },
    removeAll: (state) => {
      Cookies.remove("cart");
      state.items = [];
    },
    updateShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      Cookies.set("shippingAddress", JSON.stringify(action.payload));
    },
    selectPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
      Cookies.set("paymentMethod", JSON.stringify(action.payload));
    },
  },
});
export const {
  addItem,
  removeAll,
  removeItem,
  updateShippingAddress,
  selectPaymentMethod,
} = cartSlice.actions;
export default cartSlice.reducer;
