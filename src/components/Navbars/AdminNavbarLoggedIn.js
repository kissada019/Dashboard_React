import React from "react";
import { Nav, Dropdown, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const AdminNavbarLoggedIn = ({
  cartItemCount,
  handleCartClick,
  username,
  email,
  handleLogout,
  showCart = true,
}) => {
  const history = useHistory();

  const handleAddressClick = (e) => {
    e.preventDefault();
    history.push("/admin/address");
  };

  return (
    <>
      {/* Cart Icon */}
      {showCart && (
        <Nav.Item>
          <Nav.Link
            className="m-0"
            href="#pablo"
            onClick={handleCartClick}
            style={{
              position: "relative",
              cursor: "pointer",
              padding: "10px 15px",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <i
                className="nc-icon nc-cart-simple"
                style={{ fontSize: "20px", color: "#2d5016" }}
              ></i>
              {cartItemCount > 0 && (
                <Badge
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#c97d60",
                    color: "#fff",
                    borderRadius: "50%",
                    minWidth: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "0 5px",
                    border: "2px solid #fff",
                  }}
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </div>
            <span className="d-lg-none ml-2" style={{ color: "#2d5016" }}>
              ตะกร้า {cartItemCount > 0 && `(${cartItemCount})`}
            </span>
          </Nav.Link>
        </Nav.Item>
      )}

      <Dropdown as={Nav.Item}>
        <Dropdown.Toggle
          aria-expanded={false}
          aria-haspopup={true}
          as={Nav.Link}
          data-toggle="dropdown"
          id="navbarDropdownMenuLink"
          variant="default"
          className="m-0"
        >
          <span
            className="no-icon d-flex flex-column"
            style={{ lineHeight: 1.1, marginTop: "4px" }}
          >
            <span>{username || "Account"}</span>
            {email && (
              <small style={{ fontSize: "11px", color: "#7a7a7a" }}>
                {email}
              </small>
            )}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
          <Dropdown.Item href="#address" onClick={handleAddressClick}>
            ข้อมูลที่อยู่
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#pablo" onClick={handleLogout}>
            ออกจากระบบ
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    </>
  );
};

export default AdminNavbarLoggedIn;
