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
import Dashboard from "pages/Dashboard.js";
import UserProfile from "pages/UserProfile.js";
import TableList from "pages/TableList.js";
import Typography from "pages/Typography.js";
import Icons from "pages/Icons.js";
import Maps from "pages/Maps.js";
import Notifications from "pages/Notifications.js";
import Kanban from "pages/Kanban";
import Login from "pages/auth/login";
import Register from "pages/register";
import Tree from "pages/tree";
// import TreeEdit from "pages/tree/edit"
import TreeDetail from "pages/tree/treeDetail"

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tree/:id",
    name: "รายละเอียดต้นไม้",
    icon: "nc-icon nc-single-copy-04",
    component: TreeDetail, // New component for detailed view
    layout: "/admin",
  },
  {
    path: "/tree",
    name: "ต้นไม้",
    icon: "nc-icon nc-notes",
    component: Tree,
    layout: "/admin",
  },

  {
    path: "/register",
    name: "Register",
    icon: "nc-icon nc-paper-2",
    component: Register,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Table List",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  },
  {
    path: "/kanban",
    name: "Kanban",
    icon: "nc-icon nc-badge",
    component: Kanban,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-single-02",
    component: Login,
    layout: "/admin",
  },
];

export default dashboardRoutes;
