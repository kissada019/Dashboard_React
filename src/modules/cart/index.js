import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Leaf,
  CreditCard,
  Loader,
} from "lucide-react";
import {
  onGetCart,
  onDeleteCartItem,
  onUpdateCartQuantity,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/slices/cartSlice";
import alert from "../../utils/alert";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e8f5e3' width='80' height='80'/%3E%3Ctext fill='%234a7c2a' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10'%3ETree%3C/text%3E%3C/svg%3E";

const toImageSrc = (path) => {
  if (!path) return null;
  if (typeof path !== "string") return null;
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : "/" + path;
};

const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // ดึงข้อมูลตะกร้าจาก API เมื่อเปิดหน้า
  useEffect(() => {
    dispatch(onGetCart());
  }, [dispatch]);

  // ใช้ข้อมูลจาก API (apiItems) ถ้ามี, ไม่งั้น fallback ไปใช้ local items
  const cartItems = cart.apiItems || cart.items || [];
  const cartTotal =
    cart.apiTotal != null
      ? cart.apiTotal
      : cartItems.reduce((sum, item) => {
          const price = Number(item.sell_price ?? item.price ?? 0);
          const qty = Number(item.quantity ?? 0);
          return sum + price * qty;
        }, 0);

  const handleRemoveItem = (treeId) => {
    alert.custom
      .fire({
        icon: "warning",
        title: "ยืนยันการลบ",
        text: "คุณต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?",
        showCancelButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#d33",
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(onDeleteCartItem(treeId)).then((response) => {
            if (response?.payload && !response.error) {
              dispatch(removeFromCart(treeId));
              // โหลดข้อมูลตะกร้าใหม่จาก API
              dispatch(onGetCart());
              alert.custom.fire({
                icon: "success",
                title: "ลบสำเร็จ",
                text: "ลบสินค้าออกจากตะกร้าแล้ว",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              alert.custom.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถลบสินค้าออกจากตะกร้าได้",
                confirmButtonText: "ตกลง",
              });
            }
          });
        }
      });
  };

  const handleQuantityChange = (treeId, action) => {
    dispatch(onUpdateCartQuantity({ tree_id: treeId, action })).then(
      (response) => {
        if (response?.payload && !response.error) {
          // โหลดข้อมูลตะกร้าใหม่จาก API
          dispatch(onGetCart());
        }
      }
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert.custom.fire({
        icon: "warning",
        title: "ตะกร้าว่าง",
        text: "กรุณาเพิ่มสินค้าลงตะกร้าก่อน",
      });
      return;
    }
    history.push("/admin/checkout");
  };

  const handleContinueShopping = () => {
    history.push("/admin/shop");
  };

  // แสดง loading ระหว่างโหลดข้อมูลจาก API
  if (cart.loading) {
    return (
      <Container
        fluid
        className="p-4"
        style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}
      >
        <Card
          style={{
            borderRadius: "16px",
            border: "1px solid #d4e6d1",
            boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)",
          }}
        >
          <Card.Body className="text-center p-5">
            <Loader
              size={48}
              color="#4a7c2a"
              style={{
                marginBottom: "20px",
                animation: "spin 1s linear infinite",
              }}
            />
            <h4 style={{ color: "#2d5016" }}>กำลังโหลดตะกร้า...</h4>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container
        fluid
        className="p-4"
        style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}
      >
        <Card
          style={{
            borderRadius: "16px",
            border: "1px solid #d4e6d1",
            boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)",
          }}
        >
          <Card.Body className="text-center p-5">
            <ShoppingCart
              size={80}
              color="#d4e6d1"
              style={{ marginBottom: "20px" }}
            />
            <h3 style={{ color: "#2d5016", marginBottom: "15px" }}>
              ตะกร้าของคุณว่างเปล่า
            </h3>
            <p style={{ color: "#5a7c3a", marginBottom: "30px" }}>
              ยังไม่มีสินค้าในตะกร้า กรุณาเลือกสินค้าที่คุณต้องการ
            </p>
            <Button
              onClick={handleContinueShopping}
              style={{
                backgroundColor: "#4a7c2a",
                borderColor: "#4a7c2a",
                borderRadius: "10px",
                padding: "12px 30px",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              <Leaf
                size={18}
                style={{
                  marginRight: "8px",
                  verticalAlign: "middle",
                  color: "#fff",
                }}
              />
              เลือกซื้อต้นไม้
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Button
            variant="light"
            onClick={() => history.goBack()}
            style={{
              borderRadius: "8px",
              padding: "8px 16px",
              border: "1px solid #d4e6d1",
              backgroundColor: "#fff",
              color: "#2d5016",
              marginRight: "15px",
            }}
          >
            <ArrowLeft
              size={18}
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            กลับ
          </Button>
          <h2
            style={{ margin: 0, color: "#2d5016", fontWeight: "700" }}
            className="d-flex align-items-center"
          >
            <ShoppingCart size={28} style={{ marginRight: "10px" }} />
            ตะกร้าสินค้า
          </h2>
        </div>
        <Badge
          style={{
            fontSize: "16px",
            padding: "8px 16px",
            backgroundColor: "#4a7c2a",
            color: "#fff",
            borderRadius: "20px",
          }}
        >
          {cartItems.length} รายการ
        </Badge>
      </div>

      <Row>
        {/* Cart Items */}
        <Col lg={8} md={12} className="mb-4">
          <Card
            style={{
              borderRadius: "16px",
              border: "1px solid #d4e6d1",
              boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)",
            }}
          >
            <Card.Header
              style={{
                backgroundColor: "#e8f5e3",
                borderBottom: "2px solid #d4e6d1",
                borderRadius: "16px 16px 0 0",
                padding: "20px",
              }}
            >
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2d5016" }}>
                รายการสินค้า
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover style={{ margin: 0, tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "16%" }} />
                </colgroup>
                <thead style={{ backgroundColor: "#f0f5ee" }}>
                  <tr>
                    {["สินค้า", "ราคา", "จำนวน", "รวม", "จัดการ"].map(
                      (title) => (
                        <th
                          key={title}
                          style={{
                            padding: "15px",
                            color: "#2d5016",
                            fontWeight: "600",
                            borderColor: "#d4e6d1",
                          }}
                        >
                          <div style={{ textAlign: "center", width: "100%" }}>
                            {title}
                          </div>
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    // รองรับ field จาก API (tree_id, sell_price, image_url, tree.name ฯลฯ)
                    const itemId = item.id || item.tree_id;
                    const treeId = item.tree_id || item.id;
                    const itemName =
                      item.name || item.tree_name || item.tree?.name || "-";
                    const itemSpecies =
                      item.species ||
                      item.tree_species ||
                      item.tree?.species ||
                      "";
                    const itemLocation =
                      item.location ||
                      item.tree_location ||
                      item.tree?.location ||
                      "";
                    const itemPrice = Number(
                      item.sell_price ??
                        item.price ??
                        item.tree?.sell_price ??
                        0,
                    );
                    const itemQty = Number(item.quantity ?? 0);
                    const itemMaxQty = Number(
                      item.maxQuantity ??
                        item.tree?.quantity ??
                        item.stock ??
                        9999,
                    );
                    const rawImage =
                      item.image_url ||
                      item.imageUrl ||
                      item.image ||
                      item.tree?.image_url ||
                      "";
                    const itemImage = toImageSrc(rawImage);

                    return (
                      <tr key={itemId} style={{ borderColor: "#d4e6d1" }}>
                        <td
                          style={{
                            padding: "20px",
                            borderColor: "#d4e6d1",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-center">
                            <img
                              src={itemImage || PLACEHOLDER_IMAGE}
                              alt={itemName}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                marginRight: "15px",
                                border: "1px solid #d4e6d1",
                              }}
                              onError={(e) => {
                                if (e.target.src !== PLACEHOLDER_IMAGE) {
                                  e.target.src = PLACEHOLDER_IMAGE;
                                }
                              }}
                            />
                            <div style={{ textAlign: "left" }}>
                              <h6
                                style={{
                                  margin: 0,
                                  color: "#2d5016",
                                  fontWeight: "600",
                                  marginBottom: "5px",
                                }}
                              >
                                {itemName}
                              </h6>
                              {itemSpecies && (
                                <Badge
                                  style={{
                                    backgroundColor: "#e8f5e3",
                                    color: "#fff",
                                    fontSize: "12px",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                  }}
                                >
                                  {itemSpecies}
                                </Badge>
                              )}
                              {itemLocation && (
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#5a7c3a",
                                    marginTop: "5px",
                                  }}
                                >
                                  สถานที่: {itemLocation}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "20px",
                            borderColor: "#d4e6d1",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <span style={{ color: "#2d5016", fontWeight: "600" }}>
                            {itemPrice.toLocaleString()} ฿
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "20px",
                            borderColor: "#d4e6d1",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{ gap: "10px" }}
                          >
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                itemQty <= 1
                                  ? handleRemoveItem(treeId)
                                  : handleQuantityChange(treeId, "decrement")
                              }
                              style={{
                                borderRadius: "8px",
                                width: "36px",
                                height: "36px",
                                borderColor: "#d4e6d1",
                                color: "#2d5016",
                              }}
                            >
                              <Minus size={16} />
                            </Button>
                            <span
                              style={{
                                minWidth: "50px",
                                textAlign: "center",
                                fontWeight: "600",
                                color: "#2d5016",
                              }}
                            >
                              {itemQty}
                            </span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(treeId, "increment")
                              }
                              disabled={itemQty >= itemMaxQty}
                              style={{
                                borderRadius: "8px",
                                width: "36px",
                                height: "36px",
                                borderColor: "#d4e6d1",
                                color: "#2d5016",
                              }}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                          {itemQty >= itemMaxQty && itemMaxQty < 9999 && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#c97d60",
                                marginTop: "5px",
                              }}
                            >
                              สูงสุด {itemMaxQty} ต้น
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "20px",
                            borderColor: "#d4e6d1",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <span
                            style={{
                              color: "#2d5016",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            {(itemPrice * itemQty).toLocaleString()} ฿
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "20px",
                            borderColor: "#d4e6d1",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(treeId)}
                            style={{
                              borderRadius: "8px",
                              borderColor: "#c97d60",
                              color: "#c97d60",
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4} md={12}>
          <Card
            style={{
              borderRadius: "16px",
              border: "1px solid #d4e6d1",
              boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)",
            }}
          >
            <Card.Header
              style={{
                backgroundColor: "#e8f5e3",
                borderBottom: "2px solid #d4e6d1",
                borderRadius: "16px 16px 0 0",
                padding: "20px",
              }}
            >
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2d5016" }}>
                สรุปคำสั่งซื้อ
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>จำนวนรายการ:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>
                    {cartItems.length} รายการ
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>จำนวนต้นไม้:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>
                    {cartItems.reduce(
                      (sum, item) => sum + Number(item.quantity ?? 0),
                      0,
                    )}{" "}
                    ต้น
                  </span>
                </div>
                <hr style={{ borderColor: "#d4e6d1", margin: "15px 0" }} />
                <div className="d-flex justify-content-between">
                  <span
                    style={{
                      color: "#2d5016",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    ยอดรวม:
                  </span>
                  <span
                    style={{
                      color: "#2d5016",
                      fontWeight: "700",
                      fontSize: "24px",
                    }}
                  >
                    {cartTotal.toLocaleString()} ฿
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  backgroundColor: "#4a7c2a",
                  borderColor: "#4a7c2a",
                  borderRadius: "10px",
                  padding: "14px",
                  color: "#fff",
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
              >
                <CreditCard
                  size={20}
                  style={{
                    marginRight: "8px",
                    verticalAlign: "middle",
                    color: "#fff",
                  }}
                />
                ดำเนินการชำระเงิน
              </Button>

              <Button
                variant="outline-secondary"
                onClick={handleContinueShopping}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  padding: "12px",
                  borderColor: "#d4e6d1",
                  color: "#2d5016",
                }}
              >
                เลือกซื้อเพิ่มเติม
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
