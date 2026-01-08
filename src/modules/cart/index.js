import React from "react";
import { Container, Row, Col, Card, Button, Badge, Table } from "react-bootstrap";
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
} from "lucide-react";
import { removeFromCart, updateQuantity, clearCart } from "../../redux/slices/cartSlice";
import alert from "../../utils/alert";

const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleRemoveItem = (id) => {
    alert.custom.fire({
      icon: "warning",
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromCart(id));
        alert.custom.fire({
          icon: "success",
          title: "ลบสำเร็จ",
          text: "ลบสินค้าออกจากตะกร้าแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleQuantityChange = (id, newQuantity) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
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
    history.push("/admin/tree");
  };

  if (cart.items.length === 0) {
    return (
      <Container fluid className="p-4" style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}>
        <Card style={{ borderRadius: "16px", border: "1px solid #d4e6d1", boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)" }}>
          <Card.Body className="text-center p-5">
            <ShoppingCart size={80} color="#d4e6d1" style={{ marginBottom: "20px" }} />
            <h3 style={{ color: "#2d5016", marginBottom: "15px" }}>ตะกร้าของคุณว่างเปล่า</h3>
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
              }}
            >
              <Leaf size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
              เลือกซื้อต้นไม้
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}>
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
            <ArrowLeft size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            กลับ
          </Button>
          <h2 style={{ margin: 0, color: "#2d5016", fontWeight: "700" }} className="d-flex align-items-center">
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
          {cart.items.length} รายการ
        </Badge>
      </div>

      <Row>
        {/* Cart Items */}
        <Col lg={8} md={12} className="mb-4">
          <Card style={{ borderRadius: "16px", border: "1px solid #d4e6d1", boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)" }}>
            <Card.Header
              style={{
                backgroundColor: "#e8f5e3",
                borderBottom: "2px solid #d4e6d1",
                borderRadius: "16px 16px 0 0",
                padding: "20px",
              }}
            >
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2d5016" }}>รายการสินค้า</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover style={{ margin: 0 }}>
                <thead style={{ backgroundColor: "#f0f5ee" }}>
                  <tr>
                    <th style={{ padding: "15px", color: "#2d5016", fontWeight: "600", borderColor: "#d4e6d1" }}>
                      สินค้า
                    </th>
                    <th style={{ padding: "15px", color: "#2d5016", fontWeight: "600", borderColor: "#d4e6d1", textAlign: "center" }}>
                      ราคา
                    </th>
                    <th style={{ padding: "15px", color: "#2d5016", fontWeight: "600", borderColor: "#d4e6d1", textAlign: "center" }}>
                      จำนวน
                    </th>
                    <th style={{ padding: "15px", color: "#2d5016", fontWeight: "600", borderColor: "#d4e6d1", textAlign: "center" }}>
                      รวม
                    </th>
                    <th style={{ padding: "15px", color: "#2d5016", fontWeight: "600", borderColor: "#d4e6d1", textAlign: "center" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id} style={{ borderColor: "#d4e6d1" }}>
                      <td style={{ padding: "20px", borderColor: "#d4e6d1" }}>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image || "https://via.placeholder.com/80x80?text=Tree"}
                            alt={item.name}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              marginRight: "15px",
                              border: "1px solid #d4e6d1",
                            }}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/80x80?text=Tree";
                            }}
                          />
                          <div>
                            <h6 style={{ margin: 0, color: "#2d5016", fontWeight: "600", marginBottom: "5px" }}>
                              {item.name}
                            </h6>
                            <Badge
                              style={{
                                backgroundColor: "#e8f5e3",
                                color: "#2d5016",
                                fontSize: "12px",
                                padding: "4px 10px",
                                borderRadius: "12px",
                              }}
                            >
                              {item.species}
                            </Badge>
                            <div style={{ fontSize: "12px", color: "#5a7c3a", marginTop: "5px" }}>
                              สถานที่: {item.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "20px", borderColor: "#d4e6d1", textAlign: "center" }}>
                        <span style={{ color: "#2d5016", fontWeight: "600" }}>
                          {item.price.toLocaleString()} ฿
                        </span>
                      </td>
                      <td style={{ padding: "20px", borderColor: "#d4e6d1", textAlign: "center" }}>
                        <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px" }}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
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
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxAmount}
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
                        {item.quantity >= item.maxAmount && (
                          <div style={{ fontSize: "11px", color: "#c97d60", marginTop: "5px" }}>
                            สูงสุด {item.maxAmount} ต้น
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "20px", borderColor: "#d4e6d1", textAlign: "center" }}>
                        <span style={{ color: "#2d5016", fontWeight: "700", fontSize: "16px" }}>
                          {(item.price * item.quantity).toLocaleString()} ฿
                        </span>
                      </td>
                      <td style={{ padding: "20px", borderColor: "#d4e6d1", textAlign: "center" }}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
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
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4} md={12}>
          <Card style={{ borderRadius: "16px", border: "1px solid #d4e6d1", boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)" }}>
            <Card.Header
              style={{
                backgroundColor: "#e8f5e3",
                borderBottom: "2px solid #d4e6d1",
                borderRadius: "16px 16px 0 0",
                padding: "20px",
              }}
            >
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2d5016" }}>สรุปคำสั่งซื้อ</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>จำนวนรายการ:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>{cart.items.length} รายการ</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>จำนวนต้นไม้:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)} ต้น
                  </span>
                </div>
                <hr style={{ borderColor: "#d4e6d1", margin: "15px 0" }} />
                <div className="d-flex justify-content-between">
                  <span style={{ color: "#2d5016", fontWeight: "600", fontSize: "18px" }}>ยอดรวม:</span>
                  <span style={{ color: "#2d5016", fontWeight: "700", fontSize: "24px" }}>
                    {cart.total.toLocaleString()} ฿
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
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
              >
                <CreditCard size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
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

