import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../../utils/service"; // ใช้ service สำหรับเรียก API
import alert from "../../utils/alert"; // ใช้ alert สำหรับแสดงข้อความ

/* initial state */
const initialState = {
    tableCat: {
        form: {
            username: "",
            password: "",
        },
        page: 1,
        sizePerPage: 10,
        total: 0,
        data: [],
        detail: {},
        isSearch: false,
    },
    loading: false, // เพิ่ม state สำหรับการโหลดข้อมูล
};

/* Async Thunk: Fetch all cats */
export const onGetAllCat = createAsyncThunk(
    "catSlice/api/Cat/GetAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await service.api.get("api/Cat/GetAll");
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/* Slice */
export const catSlice = createSlice({
    name: "catSlice",
    initialState,
    reducers: {
        onClearCatData: () => initialState, // รีเซ็ต state
    },
    extraReducers: (builder) => {
        builder
            .addCase(onGetAllCat.pending, (state) => {
                state.loading = true;
            })
            .addCase(onGetAllCat.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.success) {
                    state.tableCat.data = action.payload.responseObject;
                } else {
                    alert.warning(alert.getMessage(action));
                }
            })
            .addCase(onGetAllCat.rejected, (state, action) => {
                state.loading = false;
                alert.error("Failed to fetch cat data: " + action.payload);
            });
    },
});

/* Export Actions และ Reducer */
export const { onClearCatData } = catSlice.actions;
export default catSlice.reducer;