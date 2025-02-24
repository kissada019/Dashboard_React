/* libs */
import Swal from "sweetalert2";
/* storage */
import userInfoStorage from "../storage/userInfoStorage";
/* utils */
import common from "./common";

/* mixin */
const SwalWithBootstrap = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-dark-red mx-1 min-w-90px",
    cancelButton: "btn btn-secondary mx-1 min-w-90px",
    denyButton: "btn btn-outline-primary mx-1 min-w-90px",
    input: "text-body alert-remove-border",
  },
  buttonsStyling: false,
  returnFocus: false,
  showCloseButton: true,
});

const success = (msg, callback = () => {}) => {
  SwalWithBootstrap.fire({
    icon: "success",
    title: "สำเร็จ",
    html: msg,
    allowOutsideClick: false,
    focusConfirm: false,
    confirmButtonText: "ตกลง",
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};

const warning = (msg, flag) => {
  let message = "";
  let classNameMsg = msg && msg.includes("\n") ? "text-pre" : "";
  let classNameFlag = flag && flag.includes("\n") ? "text-pre" : "";
  if (flag)
    message += `<p class="${classNameFlag} mb-1">Warning Code: ${flag}</p>`;
  if (msg) message += `<p class="${classNameMsg} mb-0">${msg}</p>`;
  SwalWithBootstrap.fire({
    icon: "warning",
    title: "แจ้งเตือน",
    html: message,
    allowOutsideClick: false,
    focusConfirm: false,
    confirmButtonText: "ตกลง",
  });
};

const error = (msg, flag) => {
  if (msg && msg.includes("401")) {
    sessionExpired();
  } else {
    let message = "";
    let classNameMsg = msg && msg.includes("\n") ? "text-pre" : "";
    let classNameFlag = flag && flag.includes("\n") ? "text-pre" : "";
    if (flag)
      message += `<p class="${classNameFlag} mb-1">Error Code: ${flag}</p>`;
    if (msg) message += `<p class="${classNameMsg} mb-0">${msg}</p>`;
    SwalWithBootstrap.fire({
      icon: "error",
      title: "พบข้อผิดพลาดของระบบ",
      html: message,
      allowOutsideClick: false,
      focusConfirm: false,
      confirmButtonText: "ตกลง",
    });
  }
};

const successAutoClose = (msg, callback = () => {}) => {
  // SwalWithBootstrap.fire({
  //     icon: 'success',
  //     title: 'สำเร็จ',
  //     html: msg,
  //     allowOutsideClick: false,
  //     focusConfirm: false,
  //     showConfirmButton: false,
  //     timer: 1000,
  // }).then((result) => {
  //     // if (result.isConfirmed) {
  //     func();
  //     // }
  // })
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: msg,
  }).then(() => {
    callback();
  });
};

const sessionExpired = () => {
  let checkSession = common.checkSession();
  if (checkSession === false) {
    userInfoStorage.remove();
    window.location.href = "/auth/login";
  } else {
    SwalWithBootstrap.fire({
      icon: "error",
      title: "เซสชั่นหมดอายุ",
      html: "กรุณาเข้าสู่ระบบอีกครั้ง",
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "ตกลง",
    }).then((result) => {
      if (
        result.isDismissed !== true ||
        (result.isDismissed === true && result.dismiss === "close")
      ) {
        userInfoStorage.remove();
        window.location.href = "/auth/login";
      }
    });
  }
};

const getMessage = (response) => {
  let message = "";
  if (response?.payload?.message) {
    message = response?.payload?.message;
    if (response?.payload?.errors?.length > 0) {
      message = response?.payload?.errors?.join(" ");
    }
  } else {
    message = response?.error?.message;
  }
  return message || "";
};

const alert = {
  custom: SwalWithBootstrap,
  success: success,
  warning: warning,
  error: error,
  successAutoClose: successAutoClose,
  getMessage: getMessage,
};

export default alert;
