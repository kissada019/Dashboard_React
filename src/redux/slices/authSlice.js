import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import alert from "../../utils/alert";
import userInfoStorage from "../../storage/userInfoStorage";
import service from "../../utils/service"; 


const initialState = {
  user: null,
  loading: false,
  error: null,
  form: {
    username: "",
    password: "",
  },
};

// const _apiURL = appConst.ENV;
// console.log("_apiURL : ", _apiURL.ENV);

export const onLogin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    console.log("credentials : ", credentials);
    try {
      const response = await service.api.post("auth/Login", credentials);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onChangeLoginForm: (state, action) => {
      const { name, value } = action.payload;
      state.form = {
        ...state.form,
        [name]: value,
      };
    },
    onResetLoginForm: (state) => {
      state.form = { username: "", password: "" };
    },
    onLogout: (state) => {
      state.user = null;
      state.error = null;
      userInfoStorage.remove();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        userInfoStorage.set(action.payload);
      })
      .addCase(onLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert.error("Login failed: " + action.payload);
      });
  },
});

export const { onChangeLoginForm, onResetLoginForm, onLogout } =
  authSlice.actions;
export default authSlice.reducer;
