/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Nav } from "react-bootstrap";
import { ChevronLeft } from "lucide-react";

import logo from "assets/img/reactlogo.png";
import userInfoStorage from "../../storage/userInfoStorage";
import { hasAnyRole } from "../../utils/authRole";

function Sidebar({ color, image, routes }) {
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const closeMobileSidebar = () => {
    document.documentElement.classList.remove("nav-open");
    const bodyClick = document.getElementById("bodyClick");
    if (bodyClick) {
      bodyClick.parentElement.removeChild(bodyClick);
    }
  };

  // ดึง role จาก localStorage
  const userInfo = userInfoStorage.get() || {};

  // กรองเมนู: ไม่แสดง hidden และเช็ค roles (ถ้า route ไม่ได้ตั้ง roles = เข้าถึงได้ทุก role)
  const route = routes.filter((r) => {
    if (r.hidden) return false;
    if (r.roles && r.roles.length > 0) {
      return hasAnyRole(userInfo, r.roles);
    }
    return true;
  });

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")",
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-between">
          <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-mini mx-1"
          ></a>
          <a className="simple-text">กฤษดา พันธุ์ไม้</a>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={closeMobileSidebar}
            aria-label="พับเมนู"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <Nav>
          {route.map((prop, key) => {
            if (!prop.redirect)
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
