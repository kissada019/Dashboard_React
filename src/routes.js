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
import Dashboard from "pages/dashboard";
import Login from "pages/auth/login";
import Register from "pages/register";
import Edit from "pages/tree/edit";
import Tree from "pages/tree";
import Shop from "pages/shop";
import Sale from "pages/sale";
import TreeDetailShopee from "pages/tree/treeDetailShopee";
import Cart from "pages/cart";
import Checkout from "pages/checkout";
import OnlineOrders from "pages/onlineOrders";
import AddressPage from "pages/address";
import SignupPage from "pages/signup";
import RegisterAdminPage from "pages/registerAdmin";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
    roles: ["superadmin"],
  },
  {
    path: "/tree/edit/:id",
    name: "แก้ไขต้นไม้",
    icon: "nc-icon nc-single-copy-04",
    component: Edit,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/sale",
    name: "ขายต้นไม้",
    icon: "nc-icon nc-money-coins",
    component: Sale,
    layout: "/admin",
    roles: ["superadmin", "admin"],
  },
  {
    path: "/tree",
    name: "ต้นไม้ ",
    icon: "nc-icon nc-notes",
    component: Tree,
    layout: "/admin",
    roles: ["superadmin", "admin"],
  },
  {
    path: "/shop",
    name: "ร้านต้นไม้",
    icon: "nc-icon nc-notes",
    component: Shop,
    layout: "/admin",
  },
  {
    path: "/online-orders",
    name: "คำสั่งซื้อออนไลน์",
    icon: "nc-icon nc-delivery-fast",
    component: OnlineOrders,
    layout: "/admin",
    roles: ["superadmin", "admin", "user"],
  },
  {
    path: "/address",
    name: "ข้อมูลที่อยู่",
    icon: "nc-icon nc-pin-3",
    component: AddressPage,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/tree-detail/:id",
    name: "ดูรายละเอียดต้นไม้",
    icon: "nc-icon nc-single-copy-04",
    component: TreeDetailShopee,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/register",
    name: "เพิ่มต้นไม้ใหม่",
    icon: "nc-icon nc-paper-2",
    component: Register,
    layout: "/admin",
    roles: ["superadmin", "admin"],
  },
  {
    path: "/register-admin",
    name: "เพิ่มผู้ดูแล",
    icon: "nc-icon nc-badge",
    component: RegisterAdminPage,
    layout: "/admin",
    roles: ["superadmin"],
  },
  {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-single-02",
    component: Login,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/signup",
    name: "สมัครสมาชิก",
    icon: "nc-icon nc-single-02",
    component: SignupPage,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/cart",
    name: "ตะกร้าสินค้า",
    icon: "nc-icon nc-cart-simple",
    component: Cart,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/checkout",
    name: "ชำระเงิน",
    icon: "nc-icon nc-credit-card",
    component: Checkout,
    layout: "/admin",
    hidden: true,
  },
];

export default dashboardRoutes;
