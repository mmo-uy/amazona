import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product, LoadingState } from "../../../types";
import { getAllProducts } from "../../../services/product";

interface ProductState {
  productsList: Product[];
  selectedProduct: Product | null;
  loading: LoadingState;
}
const initialState: ProductState = {
  productsList: [],
  selectedProduct: null,
  loading: "idle",
};
export const asyncListProducts = createAsyncThunk<Product[]>(
  "products/all",
  async (_params, { rejectWithValue, dispatch }) => {
    try {
      const response = await getAllProducts();
      return response;
    } catch (error) {
      // errorHandlerHelper(error, dispatch);
      return rejectWithValue(error);
    }
  }
);
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncListProducts.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(asyncListProducts.rejected, (state, action) => {
      state.loading = "failed";
      // logger.error("asyncListClients.error", action.error);
    });
    builder.addCase(asyncListProducts.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.productsList = action.payload;
      // logger.info("asyncListClients.successs", action.payload);
    });
  },
});

export default productSlice.reducer;
