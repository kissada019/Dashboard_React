import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../../utils/service";

export const onGetDashboardSummary = createAsyncThunk(
  "dashboard/api/summary",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const query = `dashboard/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const response = await service.api.get(query);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "ไม่สามารถดึงข้อมูลสรุป Dashboard ได้"
      );
    }
  }
);

const initialSummary = {
  total_tree_types: 0,
  total_trees: 0,
  stock_value_sell_price: 0,
  stock_value_buy_price: 0,
  stock_profit_value: 0,
  total_sales_from_orders: 0,
  sold_orders_count: 0,
  sold_orders: [],
  top_selling_trees: [],
  sales_monthly: [],
  sales_weekly: [],
};

const initialState = {
  loading: false,
  error: null,
  summary: initialSummary,
};

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onGetDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        const root =
          payload?.data && typeof payload.data === "object" ? payload.data : payload;
        state.summary = {
          total_tree_types: Number(root.total_tree_types ?? 0),
          total_trees: Number(root.total_trees ?? 0),
          stock_value_sell_price: Number(root.stock_value_sell_price ?? 0),
          stock_value_buy_price: Number(root.stock_value_buy_price ?? 0),
          stock_profit_value: Number(root.stock_profit_value ?? 0),
          total_sales_from_orders: Number(root.total_sales_from_orders ?? 0),
          sold_orders_count: Number(root.sold_orders_count ?? 0),
          sold_orders: Array.isArray(root.sold_orders) ? root.sold_orders : [],
          top_selling_trees: Array.isArray(root.top_selling_trees)
            ? root.top_selling_trees
            : [],
          sales_monthly: Array.isArray(root.sales_monthly) ? root.sales_monthly : [],
          sales_weekly: Array.isArray(root.sales_weekly) ? root.sales_weekly : [],
        };
      })
      .addCase(onGetDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Dashboard summary failed";
        state.summary = initialSummary;
      });
  },
});

export default dashboardSlice.reducer;
