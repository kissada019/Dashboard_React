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
import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { onGetCart } from "../../redux/slices/cartSlice";
import userInfoStorage from "../../storage/userInfoStorage";
import AdminNavbarLoggedIn from "./AdminNavbarLoggedIn";
import AdminNavbarGuest from "./AdminNavbarGuest";

import routes from "routes.js";

function Header() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const userInfo = userInfoStorage.get() || {};
  const token = userInfo?.token || "";
  const isLoggedIn = Boolean(token);
  const userRole = String(userInfo?.role || "").toLowerCase();
  const isAdmin = userRole === "admin";

  // ดึงข้อมูลตะกร้าจาก API เมื่อ login แล้ว
  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      dispatch(onGetCart());
    }
  }, [isLoggedIn, isAdmin, dispatch]);

  // ใช้ข้อมูลจาก API (apiItems) ถ้ามี
  const apiItems = cart.apiItems || [];
  const localItems = cart.items || [];
  const cartItemCount = apiItems.length > 0
    ? apiItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0)
    : localItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
  const decodeTokenPayload = (jwt) => {
    if (!jwt || typeof jwt !== "string") return {};
    const parts = jwt.split(".");
    if (parts.length < 2) return {};
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4 || 4)) % 4),
      "="
    );
    try {
      const json = decodeURIComponent(
        atob(padded)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch (error) {
      return {};
    }
  };
  const tokenPayload = decodeTokenPayload(token);
  console.log("tokenPayload", tokenPayload);
  const username =
    tokenPayload?.username ||
    tokenPayload?.userName ||
    tokenPayload?.preferred_username ||
    userInfo?.username ||
    userInfo?.userName ||
    "";
  const email =
    tokenPayload?.email ||
    tokenPayload?.emailAddress ||
    userInfo?.email ||
    userInfo?.emailAddress ||
    "";
  console.log("username", username);

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    history.push("/admin/cart");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    userInfoStorage.remove();
    history.push("/admin/login");
    window.location.reload();
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href="#home"
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
            {getBrandText()}
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav mr-auto" navbar>
            <Nav.Item>
              <Nav.Link
                data-toggle="dropdown"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="m-0"
              >
                <i className="nc-icon nc-palette"></i>
                <span className="d-lg-none ml-1">Dashboard</span>
              </Nav.Link>
            </Nav.Item>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                data-toggle="dropdown"
                id="dropdown-67443507"
                variant="default"
                className="m-0"
              >
                <i className="nc-icon nc-planet"></i>
                <span className="notification">5</span>
                <span className="d-lg-none ml-1">Notification</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Notification 1
                </Dropdown.Item>
                <Dropdown.Item
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Notification 2
                </Dropdown.Item>
                <Dropdown.Item
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Notification 3
                </Dropdown.Item>
                <Dropdown.Item
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Notification 4
                </Dropdown.Item>
                <Dropdown.Item
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Another notification
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Item>
              <Nav.Link
                className="m-0"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <i className="nc-icon nc-zoom-split"></i>
                <span className="d-lg-block"> Search</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className="ml-auto" navbar>
            {isLoggedIn ? (
              <AdminNavbarLoggedIn
                cartItemCount={cartItemCount}
                handleCartClick={handleCartClick}
                username={username}
                email={email}
                handleLogout={handleLogout}
                showCart={!isAdmin}
              />
            ) : (
              <AdminNavbarGuest />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
