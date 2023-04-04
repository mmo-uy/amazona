import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoadingState, Order } from "../../../types";
import { addOrder, getSingleOrder } from "../../../services/order/index";

interface OrderState {
  payment: Order | null;
  loading: LoadingState;
  selectedOrder: Order | null;
  error: {
    message: String;
  } | null;
}
const initialState: OrderState = {
  payment: null,
  loading: "idle",
  selectedOrder: null,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
   
  },
});

export default orderSlice.reducer;
