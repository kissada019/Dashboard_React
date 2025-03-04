import axios from "axios";
import { constantCase } from "constant-case";
import appConst from "../shared/AppConst";
/* storage */
// import userInfoStorage from "../storage/userInfoStorage";
import userInfoStorage from "../storage/userInfoStorage";
import layout from "./layout";
import alert from "./alert";
/* variables */
const _apiURL = appConst.API_URL;

/* functions */
const get = (path, isLoading = true, isAlert = true) => {
  console.log("userInfoStorage : ");
  const userInfoStore = userInfoStorage.get();
  const accessToken = userInfoStore && userInfoStore.token;
  const token = accessToken ? "Bearer " + accessToken : "";
  // layout.loading.show(isLoading);
  return new Promise((resolve, reject) => {
    axios
      .get(_apiURL + path, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: token,
        },
      })
      .then((result) => {
        layout.loading.hide(isLoading);
        resolve(result.data);
      })
      .catch((error) => {
        layout.loading.hide(isLoading);
        if (isAlert && path) {
          let lastPath = path.split("/").slice(-1)[0];
          alert.error(error.message, constantCase(lastPath));
        }
        reject(error);
      });
  });
};

const post = (path, request, isLoading = true, isAlert = true) => {
  const userInfoStore = userInfoStorage.get();
  const accessToken = userInfoStore && userInfoStore.token;
  const token = accessToken ? "Bearer " + accessToken : "";
  layout.loading.show(isLoading);
  return new Promise((resolve, reject) => {
    axios
      .post(
        _apiURL + path,
        request, // Directly passing request instead of wrapping it
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: token,
          },
        }
      )
      .then((result) => {
        layout.loading.hide(isLoading);
        resolve(result.data);
      })
      .catch((error) => {
        layout.loading.hide(isLoading);
        if (isAlert && path) {
          let lastPath = path.split("/").slice(-1)[0];
          alert.error(error.message, constantCase(lastPath));
        }
        reject(error);
      });
  });
};

const put = (path, request, isLoading = true, isAlert = true) => {
  const userInfoStore = userInfoStorage.get();
  const accessToken = userInfoStore && userInfoStore.token;
  const token = accessToken ? "Bearer " + accessToken : "";
  layout.loading.show(isLoading);
  return new Promise((resolve, reject) => {
    axios
      .put(
        _apiURL + path,
        request, // Directly passing request instead of wrapping it
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: token,
          },
        }
      )
      .then((result) => {
        layout.loading.hide(isLoading);
        resolve(result.data);
      })
      .catch((error) => {
        layout.loading.hide(isLoading);
        if (isAlert && path) {
          let lastPath = path.split("/").slice(-1)[0];
          alert.error(error.message, constantCase(lastPath));
        }
        reject(error);
      });
  });
};

const deleted = (path, request, isLoading = true, isAlert = true) => {
  const userInfoStore = userInfoStorage.get();
  const accessToken = userInfoStore && userInfoStore.token;
  const token = accessToken ? "Bearer " + accessToken : "";
  layout.loading.show(isLoading);
  return new Promise((resolve, reject) => {
    axios
      .delete(
        _apiURL + path,
        request, // Directly passing request instead of wrapping it
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: token,
          },
        }
      )
      .then((result) => {
        layout.loading.hide(isLoading);
        resolve(result.data);
      })
      .catch((error) => {
        layout.loading.hide(isLoading);
        if (isAlert && path) {
          let lastPath = path.split("/").slice(-1)[0];
          alert.error(error.message, constantCase(lastPath));
        }
        reject(error);
      });
  });
};

const postFormData = (path, formData, isLoading = true, isAlert = true) => {
  const userInfoStore = userInfoStorage.get();
  const accessToken = userInfoStore && userInfoStore.token;
  const token = accessToken ? "Bearer " + accessToken : "";
  layout.loading.show(isLoading);
  return new Promise((resolve, reject) => {
    axios
      .post(_apiURL + path, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then((result) => {
        layout.loading.hide(isLoading);
        resolve(result.data);
      })
      .catch((error) => {
        console.log("post : ");
        layout.loading.hide(isLoading);
        if (isAlert && path) {
          let lastPath = path.split("/").slice(-1)[0];
          alert.error(error.message, constantCase(lastPath));
        }
        reject(error);
      });
  });
};

const service = {
  api: {
    get,
    post,
    put,
    deleted,
    postFormData,
  },
};

export default service;
