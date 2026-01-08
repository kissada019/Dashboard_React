import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  User,
  Mail,
  Leaf,
  CheckCircle,
  Lock,
} from "lucide-react";
import { clearCart } from "../../redux/slices/cartSlice";
import alert from "../../utils/alert";

const Checkout = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    district: "",
    province: "",
    postalCode: "",
    paymentMethod: "transfer",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อ";
    if (!formData.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.email.trim()) newErrors.email = "กรุณากรอกอีเมล";
    if (!formData.address.trim()) newErrors.address = "กรุณากรอกที่อยู่";
    if (!formData.district.trim()) newErrors.district = "กรุณากรอกอำเภอ/เขต";
    if (!formData.province.trim()) newErrors.province = "กรุณากรอกจังหวัด";
    if (!formData.postalCode.trim()) newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert.custom.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณาตรวจสอบข้อมูลที่กรอก",
      });
      return;
    }

    // Simulate order processing
    alert.custom.fire({
      icon: "info",
      title: "กำลังดำเนินการ",
      text: "กรุณารอสักครู่...",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        alert.custom.showLoading();
      },
    });

    // Simulate API call
    setTimeout(() => {
      alert.custom.close();
      alert.custom.fire({
        icon: "success",
        title: "สั่งซื้อสำเร็จ!",
        html: `
          <p>คำสั่งซื้อของคุณได้รับการยืนยันแล้ว</p>
          <p style="font-size: 14px; color: #666; margin-top: 10px;">
            หมายเลขคำสั่งซื้อ: <strong>ORD-${Date.now()}</strong>
          </p>
          <p style="font-size: 14px; color: #666;">
            เราจะส่งอีเมลยืนยันไปที่ ${formData.email}
          </p>
        `,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#4a7c2a",
      }).then(() => {
        dispatch(clearCart());
        history.push("/admin/tree");
      });
    }, 2000);
  };

  if (cart.items.length === 0) {
    return (
      <Container fluid className="p-4" style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}>
        <Card style={{ borderRadius: "16px", border: "1px solid #d4e6d1", boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)" }}>
          <Card.Body className="text-center p-5">
            <CreditCard size={80} color="#d4e6d1" style={{ marginBottom: "20px" }} />
            <h3 style={{ color: "#2d5016", marginBottom: "15px" }}>ไม่มีสินค้าในตะกร้า</h3>
            <p style={{ color: "#5a7c3a", marginBottom: "30px" }}>
              กรุณาเพิ่มสินค้าลงตะกร้าก่อนดำเนินการชำระเงิน
            </p>
            <Button
              onClick={() => history.push("/admin/cart")}
              style={{
                backgroundColor: "#4a7c2a",
                borderColor: "#4a7c2a",
                borderRadius: "10px",
                padding: "12px 30px",
                fontWeight: "600",
              }}
            >
              กลับไปตะกร้า
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const shippingFee = 0; // ฟรี
  const totalAmount = cart.total + shippingFee;

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-4">
        <Button
          variant="light"
          onClick={() => history.goBack()}
          style={{
            borderRadius: "8px",
            padding: "8px 16px",
            border: "1px solid #d4e6d1",
            backgroundColor: "#fff",
            color: "#2d5016",
            marginBottom: "15px",
          }}
        >
          <ArrowLeft size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
          กลับ
        </Button>
        <h2 style={{ color: "#2d5016", fontWeight: "700" }} className="d-flex align-items-center">
          <CreditCard size={28} style={{ marginRight: "10px" }} />
          ชำระเงิน
        </h2>
      </div>

      <Row>
        {/* Order Form */}
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
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2d5016" }} className="d-flex align-items-center">
                <User size={20} style={{ marginRight: "10px" }} />
                ข้อมูลการจัดส่ง
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                        <User size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                        ชื่อ <span style={{ color: "#c97d60" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.firstName}
                        style={{
                          borderRadius: "8px",
                          borderColor: errors.firstName ? "#c97d60" : "#d4e6d1",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>นามสกุล <span style={{ color: "#c97d60" }}>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.lastName}
                        style={{
                          borderRadius: "8px",
                          borderColor: errors.lastName ? "#c97d60" : "#d4e6d1",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                        <Phone size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                        เบอร์โทรศัพท์ <span style={{ color: "#c97d60" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone}
                        style={{
                          borderRadius: "8px",
                          borderColor: errors.phone ? "#c97d60" : "#d4e6d1",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                        <Mail size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                        อีเมล <span style={{ color: "#c97d60" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        style={{
                          borderRadius: "8px",
                          borderColor: errors.email ? "#c97d60" : "#d4e6d1",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                    <MapPin size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                    ที่อยู่ <span style={{ color: "#c97d60" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    isInvalid={!!errors.address}
                    style={{
                      borderRadius: "8px",
                      borderColor: errors.address ? "#c97d60" : "#d4e6d1",
                    }}
                  />
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>อำเภอ/เขต <span style={{ color: "#c97d60" }}>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        isInvalid={!!errors.district}
                        style={{
                          borderRadius: "8px",
                          borderColor: errors.district ? "#c97d60" : "#d4e6d1",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">{errors.district}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>จังหวัด <span style={{ color: "#c97d60" }}>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        isInvalid={!!errors.province}
                        style={{
                          borderRadius: "8px",
                          borderColor: errors.province ? "#c97d60" : "#d4e6d1",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>รหัสไปรษณีย์ <span style={{ color: "#c97d60" }}>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        isInvalid={!!errors.postalCode}
                        maxLength={5}
                        style={{
                          borderRadius: "8px",
                          borderColor: errors.postalCode ? "#c97d60" : "#d4e6d1",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">{errors.postalCode}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                    <CreditCard size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                    วิธีการชำระเงิน <span style={{ color: "#c97d60" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    style={{
                      borderRadius: "8px",
                      borderColor: "#d4e6d1",
                    }}
                  >
                    <option value="transfer">โอนเงินผ่านธนาคาร</option>
                    <option value="cod">เก็บเงินปลายทาง (COD)</option>
                    <option value="promptpay">พร้อมเพย์</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>หมายเหตุ (ถ้ามี)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="เช่น เวลาที่สะดวกให้จัดส่ง, หมายเหตุพิเศษ"
                    style={{
                      borderRadius: "8px",
                      borderColor: "#d4e6d1",
                    }}
                  />
                </Form.Group>

                <div className="d-flex align-items-center" style={{ padding: "15px", backgroundColor: "#f0f5ee", borderRadius: "10px", marginTop: "20px" }}>
                  <Lock size={18} color="#4a7c2a" style={{ marginRight: "10px" }} />
                  <span style={{ fontSize: "14px", color: "#5a7c3a" }}>
                    ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้เฉพาะเพื่อการจัดส่งสินค้าเท่านั้น
                  </span>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4} md={12}>
          <Card style={{ borderRadius: "16px", border: "1px solid #d4e6d1", boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)", position: "sticky", top: "20px" }}>
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
              {/* Order Items */}
              <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
                {cart.items.map((item) => (
                  <div key={item.id} className="d-flex align-items-center mb-3" style={{ paddingBottom: "15px", borderBottom: "1px solid #d4e6d1" }}>
                    <img
                      src={item.image || "https://via.placeholder.com/60x60?text=Tree"}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "12px",
                        border: "1px solid #d4e6d1",
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/60x60?text=Tree";
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d5016", marginBottom: "3px" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#5a7c3a" }}>
                        {item.quantity} x {item.price.toLocaleString()} ฿
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#2d5016" }}>
                      {(item.price * item.quantity).toLocaleString()} ฿
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: "#d4e6d1", margin: "20px 0" }} />

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>ยอดรวมสินค้า:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>{cart.total.toLocaleString()} ฿</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>
                    <Truck size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                    ค่าจัดส่ง:
                  </span>
                  <span style={{ color: "#4a7c2a", fontWeight: "600" }}>ฟรี</span>
                </div>
                <hr style={{ borderColor: "#d4e6d1", margin: "15px 0" }} />
                <div className="d-flex justify-content-between">
                  <span style={{ color: "#2d5016", fontWeight: "700", fontSize: "18px" }}>ยอดรวมทั้งสิ้น:</span>
                  <span style={{ color: "#2d5016", fontWeight: "700", fontSize: "24px" }}>
                    {totalAmount.toLocaleString()} ฿
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                style={{
                  width: "100%",
                  backgroundColor: "#4a7c2a",
                  borderColor: "#4a7c2a",
                  borderRadius: "10px",
                  padding: "14px",
                  fontWeight: "600",
                  marginTop: "20px",
                }}
              >
                <CheckCircle size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                ยืนยันการสั่งซื้อ
              </Button>

              <div className="d-flex align-items-center justify-content-center mt-3" style={{ fontSize: "12px", color: "#5a7c3a" }}>
                <Leaf size={14} style={{ marginRight: "5px" }} />
                รับประกันคุณภาพสินค้า
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

