import { configureStore } from "@reduxjs/toolkit";
/* Slices */
import catSlice from "./slices/catSlice";
import treeSlice from "./slices/treeSlice";
import cartSlice from "./slices/cartSlice";
import authSlice from "./slices/authSlice";
import orderSlice from "./slices/orderSlice";
import dashboardSlice from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    catSlice: catSlice,
    treeSlice: treeSlice,
    cart: cartSlice,
    auth: authSlice,
    orderSlice: orderSlice,
    dashboardSlice: dashboardSlice,
  },
});

// import { configureStore } from "@reduxjs/toolkit";
// import catReducer from "./path_to/catSlice";

// const store = configureStore({
//     reducer: {
//         cat: catReducer,
//     },
// });

// export default store;
