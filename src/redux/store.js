import { configureStore } from "@reduxjs/toolkit";
/* Slices */
import catSlice from './slices/catSlice'


export const store = configureStore({
    reducer: {
        catSlice: catSlice,
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