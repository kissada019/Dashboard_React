import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import userInfoStorage from "../storage/userInfoStorage";
import common from "../utils/common";
import alert from "../utils/alert";
import publicRoutes from "../config/publicRoutes";
import { hasAnyRole } from "../utils/authRole";

const RequireAuth = ({ children, roles = [] }) => {
  const history = useHistory();
  const location = useLocation();
  const [notified, setNotified] = useState(false);
  const userInfo = userInfoStorage.get();
  const isSessionValid = common.checkSession();
  const hasUser =
    userInfo && Object.keys(userInfo).length > 0 && userInfo.token;
  const isPublic = publicRoutes.some((route) => {
    if (route.endsWith("/*")) {
      return location.pathname.startsWith(route.replace("/*", ""));
    }
    return route === location.pathname;
  });
  const isAuthorized = isPublic || hasAnyRole(userInfo, roles);

  useEffect(() => {
    if (isPublic) return;
    if (!hasUser || !isSessionValid) {
      if (!notified) {
        setNotified(true);
        alert.custom.fire({
          icon: "warning",
          title: "กรุณาเข้าสู่ระบบก่อน",
          text: "หน้านี้ต้องเข้าสู่ระบบก่อนใช้งาน",
          confirmButtonText: "ตกลง",
        });
      }
      history.push("/admin/login");
      return;
    }

    if (!isAuthorized) {
      history.push("/admin/shop");
    }
  }, [
    hasUser,
    isSessionValid,
    isPublic,
    isAuthorized,
    history,
    notified,
    location.pathname,
  ]);

  if (!isPublic && (!hasUser || !isSessionValid)) {
    return null;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
