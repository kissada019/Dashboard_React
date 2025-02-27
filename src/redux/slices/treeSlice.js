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
      let response = null
      if (_apiURL === "DEV") {
        response = await service.api.get("api/Tree/GetAll");
      } else if (_apiURL === "PRE") {
        response = await service.api.get("api/trees");
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const onGetTreeById = createAsyncThunk(
  "treeSlice/api/trees",
  async (id) => {
    try {
      let response = null
      if (_apiURL === "DEV") {
        response = await service.api.get(`api/Tree/GetTreeById/${id}`);
      } else if (_apiURL === "PRE") {
        response = await service.api.get("api/trees");
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

      let response = null
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

export const onUpdateTree = createAsyncThunk(
  "treeSlice/api/trees",
  async (treeData) => {
    try {
      // console.log("treeData : ", treeData);
      let response = null
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
      let response = null
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

    /* Create Tree */
    // .addCase(onCreateTree.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(onCreateTree.fulfilled, (state, action) => {
    //   state.loading = false;
    //   if (action.payload) {
    //     state.tableTree.data.push(action.payload); // Add new tree to the list
    //   }
    // })
    // .addCase(onCreateTree.rejected, (state) => {
    //   state.loading = false;
    // });
  },
});

/* Export Actions และ Reducer */
export const { onClearTreeData } = treeSlice.actions;
export default treeSlice.reducer;
