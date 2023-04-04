import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoadingState, Order } from "../../../types";
import {
  addOrder,
  getSingleOrder,
  getOrders,
} from "../../../services/order/index";

interface OrderState {
  order: Order | null;
  selectedOrder: Order | null;
  loading: LoadingState;
  orders: Order[];
  error: {
    message: String;
  } | null;
}
const initialState: OrderState = {
  order: null,
  selectedOrder: null,
  loading: "idle",
  orders: [],
  error: null,
};

export const asyncAddOrder = createAsyncThunk<Order, Order>(
  "order/new",
  async (order: Order, { rejectWithValue, dispatch }) => {
    try {
      const { data, status } = await addOrder(order);
      // TODO add return type
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const asyncGetOrder = createAsyncThunk<Order, string>(
  "order/single",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await getSingleOrder(id);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const asyncGetOrders = createAsyncThunk<Order[]>(
  "order/all",
  async (_params, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await getOrders();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncAddOrder.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(asyncAddOrder.rejected, (state, action) => {
      state.loading = "failed";
      // logger.error("asyncListClients.error", action.error);
    });
    builder.addCase(asyncAddOrder.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.selectedOrder = action.payload;
      // logger.info("asyncListClients.success", action.payload);
    });
    builder.addCase(asyncGetOrder.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(asyncGetOrder.rejected, (state, action) => {
      state.loading = "failed";
      state.error = { message: "ERROR" };
      // logger.error("asyncListClients.error", action.error);
    });
    builder.addCase(asyncGetOrder.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.order = action.payload;
      // logger.info("asyncListClients.success", action.payload);
    });
    builder.addCase(asyncGetOrders.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(asyncGetOrders.rejected, (state, action) => {
      state.loading = "failed";
      state.error = { message: "ERROR" };
      // logger.error("asyncListClients.error", action.error);
    });
    builder.addCase(asyncGetOrders.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.orders = action.payload;
      // logger.info("asyncListClients.success", action.payload);
    });
  },
});

export default orderSlice.reducer;
