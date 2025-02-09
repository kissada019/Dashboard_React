import { configureStore } from "@reduxjs/toolkit";
/* Slices */
import catSlice from "./slices/catSlice";
import treeSlice from "./slices/treeSlice";

export const store = configureStore({
  reducer: {
    catSlice: catSlice,
    treeSlice: treeSlice,
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
