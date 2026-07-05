import React from "react";
import { Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const AdminNavbarGuest = () => {
  const history = useHistory();

  return (
    <>
      <Nav.Item>
        <Nav.Link
          className="m-0"
          href="/admin/login"
          onClick={(e) => {
            e.preventDefault();
            history.push("/admin/login");
          }}
        >
          <span className="no-icon">Log in</span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          className="m-0"
          href="/admin/signup"
          onClick={(e) => {
            e.preventDefault();
            history.push("/admin/signup");
          }}
        >
          <span className="no-icon">Register</span>
        </Nav.Link>
      </Nav.Item>
    </>
  );
};

export default AdminNavbarGuest;
