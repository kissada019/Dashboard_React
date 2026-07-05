import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../../utils/service";

export const onCreateOrder = createAsyncThunk(
  "order/api/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("payload : ", payload);
      const response = await service.api.post("api/orders", payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "ไม่สามารถบันทึกคำสั่งซื้อได้");
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  lastCreated: null,
};

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onCreateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onCreateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreated = action.payload;
      })
      .addCase(onCreateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Create order failed";
      });
  },
});

export default orderSlice.reducer;
