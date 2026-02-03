import React from "react";
import { Nav } from "react-bootstrap";

const AdminNavbarGuest = () => {
  return (
    <>
      <Nav.Item>
        <Nav.Link
          className="m-0"
          href="login"
          // onClick={(e) => e.preventDefault()}
        >
          <span className="no-icon">Log in</span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          className="m-0"
          href="register"
          // onClick={(e) => e.preventDefault()}
        >
          <span className="no-icon">Register</span>
        </Nav.Link>
      </Nav.Item>
    </>
  );
};

export default AdminNavbarGuest;
