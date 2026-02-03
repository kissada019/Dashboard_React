import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../../utils/service"; // ใช้ service สำหรับเรียก API
import alert from "../../utils/alert"; // ใช้ alert สำหรับแสดงข้อความ
import appConst from "../../shared/AppConst";
/* initial state */
const initialState = {
  tableTree: {
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

const _apiURL = appConst.ENV;
console.log("_apiURL : ", _apiURL.ENV);

/* Async Thunk: Fetch all trees */
export const onGetAllTree = createAsyncThunk(
  "treeSlice/api/trees",
  async (_, { rejectWithValue }) => {
    try {
      let response = null;
      if (_apiURL === "DEV") {
        response = await service.api.get("trees");
        console.log("response : ", response);
      } else if (_apiURL === "PRE") {
        response = await service.api.get("trees");
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const onGetTreeById = createAsyncThunk(
  "treeSlice/api/treeById",
  async (id, { rejectWithValue }) => {
    try {
      let response = null;
      if (_apiURL === "DEV") {
        response = await service.api.get(`trees/${id}`);
      } else if (_apiURL === "PRE") {
        response = await service.api.get(`trees/${id}`);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* Async Thunk: Create a new tree */
export const onCreateTree = createAsyncThunk(
  "treeSlice/api/trees",
  async (treeData) => {
    try {
      // console.log("treeData : ", treeData);

      let response = null;
      if (_apiURL === "DEV") {
        // response = await service.api.get("api/Tree/GetAll");
        response = await service.api.post("api/Tree/Create", treeData);
      } else if (_apiURL === "PRE") {
        response = await service.api.post("api/trees", treeData);
      }
      return response;
    } catch (error) {
      alert.error("Failed to create tree: " + error.message);
      return rejectWithValue(error.message);
    }
  }
);

/* Async Thunk: Create tree with FormData (รวมรูปภาพ) ส่งไปที่ POST /trees */
export const onCreateTreeWithFormData = createAsyncThunk(
  "treeSlice/api/treesWithFormData",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await service.api.postFormData("trees", formData);
      return response;
    } catch (error) {
      alert.error("ไม่สามารถเพิ่มต้นไม้ได้: " + (error.message || error));
      return rejectWithValue(error.message);
    }
  }
);

export const onUpdateTree = createAsyncThunk(
  "treeSlice/api/trees",
  async (treeData) => {
    try {
      // console.log("treeData : ", treeData);
      let response = null;
      if (_apiURL === "DEV") {
        response = await service.api.put("api/Tree/Update", treeData);
      } else if (_apiURL === "PRE") {
        response = await service.api.post("api/trees", treeData);
      }
      return response;
    } catch (error) {
      alert.error("Failed to create tree: " + error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const onDeleteTree = createAsyncThunk(
  "treeSlice/api/trees",
  async (id) => {
    try {
      let response = null;
      if (_apiURL === "DEV") {
        response = await service.api.deleted("api/Tree/Remove/" + id);
      } else if (_apiURL === "PRE") {
        response = await service.api.deleted("api/trees/" + id);
      }

      return response;
    } catch (error) {
      alert.error("Failed to create tree: " + error.message);
      return rejectWithValue(error.message);
    }
  }
);

/* Slice */
export const treeSlice = createSlice({
  name: "treeSlice",
  initialState,
  reducers: {
    onClearTreeData: () => initialState, // รีเซ็ต state
  },
  extraReducers: (builder) => {
    builder
      /* Fetch Trees */
      .addCase(onGetAllTree.pending, (state) => {
        state.loading = true;
      })
      .addCase(onGetAllTree.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.tableTree.data = action.payload;
        } else {
          alert.warning(alert.getMessage(action));
        }
      })
      .addCase(onGetAllTree.rejected, (state, action) => {
        state.loading = false;
        alert.error("Failed to fetch tree data: " + action.payload);
      });
    builder
      .addCase(onGetTreeById.pending, (state) => {
        state.loading = true;
        state.tableTree.detail = {}; // ล้างข้อมูลเก่าเมื่อโหลดจาก id ใหม่
      })
      .addCase(onGetTreeById.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const detail = payload?.data !== undefined ? payload.data : payload;
        if (detail && (detail.id != null || detail._id != null)) {
          state.tableTree.detail = detail;
        } else {
          state.tableTree.detail = {};
          if (!payload) alert.warning(alert.getMessage(action));
        }
      })
      .addCase(onGetTreeById.rejected, (state, action) => {
        state.loading = false;
        state.tableTree.detail = {};
        alert.error("Failed to fetch tree detail: " + action.payload);
      });

    /* Create Tree with FormData (รูปภาพ) */
    builder
      .addCase(onCreateTreeWithFormData.pending, (state) => {
        state.loading = true;
      })
      .addCase(onCreateTreeWithFormData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.tableTree.data.push(action.payload);
        }
      })
      .addCase(onCreateTreeWithFormData.rejected, (state) => {
        state.loading = false;
      });
  },
});

/* Export Actions และ Reducer */
export const { onClearTreeData } = treeSlice.actions;
export default treeSlice.reducer;
