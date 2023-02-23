import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product, LoadingState } from "../../../types";
import { getAllProducts } from "../../../services/product";
import { getSingleProduct } from "../../../services/product/index";

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
      return rejectWithValue(error);
    }
  }
);
export const asyncGetProduct = createAsyncThunk<Product, string | number>(
  "product/single",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await getSingleProduct(id);
      return response;
    } catch (error) {
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
      // logger.info("asyncListClients.success", action.payload);
    });
    builder.addCase(asyncGetProduct.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(asyncGetProduct.rejected, (state, action) => {
      state.loading = "failed";
      // logger.error("asyncListClients.error", action.error);
    });
    builder.addCase(asyncGetProduct.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.selectedProduct = action.payload;
      // logger.info("asyncListClients.success", action.payload);
    });
  },
});

export default productSlice.reducer;
