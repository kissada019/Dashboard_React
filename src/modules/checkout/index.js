import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Store,
  Phone,
  User,
  Mail,
  Calendar,
  Clock,
  Leaf,
  CheckCircle,
  Lock,
} from "lucide-react";
import {
  onDeleteCartItem,
  onGetCart,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import { onCreateOrder } from "../../redux/slices/orderSlice";
import alert from "../../utils/alert";
import service from "../../utils/service";
import userInfoStorage from "../../storage/userInfoStorage";
import {
  getDistrictOptions,
  getSubdistrictOptions,
  provinceOptions,
} from "../../utils/thailandAddress";

const getCheckoutItemDetails = (item) => {
  const treeId = item.treeId || item.tree_id || item.id;
  const price = Number(item.price ?? item.sell_price ?? item.tree?.sell_price ?? 0);
  const quantity = Number(item.quantity ?? 0);

  return {
    id: item.itemId || item.id || treeId,
    treeId,
    name: item.name || item.tree_name || item.tree?.name || "-",
    price,
    quantity,
    image: item.image || item.image_url || item.tree?.image_url || "",
  };
};

const addressSelectStyle = (hasError = false) => ({
  width: "100%",
  minWidth: 0,
  display: "block",
  borderRadius: "12px",
  borderColor: hasError ? "#c97d60" : "#d4e6d1",
  backgroundColor: "#fff",
  color: "#2d5016",
  fontSize: "16px",
  fontWeight: 600,
  minHeight: "52px",
  padding: "10px 14px",
  boxShadow: "0 1px 0 rgba(74, 124, 42, 0.06)",
});

const readonlyAddressStyle = (hasError = false) => ({
  ...addressSelectStyle(hasError),
  backgroundColor: "#f5f8f3",
  color: "#667463",
});

const getTodayDate = () => {
  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
};

const formatPickupDate = (value) => {
  if (!value) return "";
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("th-TH", {
    dateStyle: "medium",
  });
};

const Checkout = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const orderLoading = useSelector((state) => state.order?.loading);
  const userInfo = userInfoStorage.get() || {};
  const pickupDateRef = useRef(null);
  const pickupTimeRef = useRef(null);
  const checkoutItems = useMemo(() => {
    const stateItems = location.state?.checkoutItems;
    const rawItems = Array.isArray(stateItems) && stateItems.length > 0
      ? stateItems
      : cart.items;

    return (rawItems || []).map(getCheckoutItemDetails).filter((item) => item.treeId);
  }, [cart.items, location.state]);
  const checkoutTotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [formData, setFormData] = useState({
    firstName: userInfo.first_name || userInfo.firstName || "",
    lastName: userInfo.last_name || userInfo.lastName || "",
    phone: userInfo.phone || "",
    email: userInfo.email || "",
    address: userInfo.address || "",
    subdistrict: userInfo.subdistrict || "",
    district: userInfo.district || "",
    province: userInfo.province || "",
    postalCode: userInfo.postal_code || userInfo.postalCode || "",
    paymentMethod: "transfer",
    fulfillmentMethod: "delivery",
    pickupDate: "",
    pickupTime: "",
    notes: location.state?.orderNote || "",
  });

  const [errors, setErrors] = useState({});
  const isCartCheckout = location.state?.source === "cart";

  const openNativePicker = (inputRef) => {
    const input = inputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch (error) {
        // Some browsers only allow showPicker during the original click gesture.
      }
    }
  };

  useEffect(() => {
    if (!userInfo.id) return;

    service.api.get(`api/users/${userInfo.id}`, false, false).then((user) => {
      userInfoStorage.update(user);
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.first_name || "",
        lastName: prev.lastName || user.last_name || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || "",
        address: prev.address || user.address || "",
        subdistrict: prev.subdistrict || user.subdistrict || "",
        district: prev.district || user.district || "",
        province: prev.province || user.province || "",
        postalCode: prev.postalCode || user.postal_code || "",
      }));
    });
  }, [userInfo.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "province") {
        return {
          ...prev,
          province: value,
          district: "",
          subdistrict: "",
          postalCode: "",
        };
      }
      if (name === "district") {
        return {
          ...prev,
          district: value,
          subdistrict: "",
          postalCode: "",
        };
      }
      if (name === "subdistrict") {
        const subdistrict = getSubdistrictOptions(prev.province, prev.district).find(
          (item) => item.label === value
        );
        return {
          ...prev,
          subdistrict: value,
          postalCode: subdistrict?.postalCode ? String(subdistrict.postalCode) : prev.postalCode,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
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
    if (formData.fulfillmentMethod === "delivery") {
      if (!formData.address.trim()) newErrors.address = "กรุณากรอกที่อยู่";
      if (!formData.subdistrict.trim()) newErrors.subdistrict = "กรุณากรอกแขวง/ตำบล";
      if (!formData.district.trim()) newErrors.district = "กรุณากรอกอำเภอ/เขต";
      if (!formData.province.trim()) newErrors.province = "กรุณากรอกจังหวัด";
      if (!formData.postalCode.trim())
        newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์";
    } else {
      if (!formData.pickupDate) newErrors.pickupDate = "กรุณาเลือกวันที่รับสินค้า";
      if (!formData.pickupTime) newErrors.pickupTime = "กรุณาเลือกเวลารับสินค้า";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert.custom.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณาตรวจสอบข้อมูลที่กรอก",
      });
      return;
    }
    const overStockItems = checkoutItems.filter(
      (item) =>
        Number(item.maxQuantity ?? 9999) < 9999 &&
        Number(item.quantity) > Number(item.maxQuantity)
    );
    if (overStockItems.length > 0) {
      alert.custom.fire({
        icon: "warning",
        title: "จำนวนสินค้าเกินสต็อก",
        html: overStockItems
          .map(
            (item) =>
              `<div style="text-align:left">- ${item.name}: ต้องการ ${item.quantity} ต้น / คงเหลือ ${item.maxQuantity} ต้น</div>`
          )
          .join(""),
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const totalPrice = Number(checkoutTotal || 0);
    const isDelivery = formData.fulfillmentMethod === "delivery";
    const shippingNote = [
      `วิธีรับสินค้า: ${isDelivery ? "จัดส่งตามที่อยู่" : "รับหน้าร้าน"}`,
      `ผู้รับ: ${formData.firstName} ${formData.lastName}`,
      `โทร: ${formData.phone}`,
      `อีเมล: ${formData.email}`,
      isDelivery
        ? `ที่อยู่: ${formData.address}, ${formData.subdistrict}, ${formData.district}, ${formData.province} ${formData.postalCode}`
        : "ที่อยู่: รับสินค้าที่หน้าร้าน",
      !isDelivery && formData.pickupDate
        ? `วันที่รับ: ${formatPickupDate(formData.pickupDate)}`
        : "",
      !isDelivery && formData.pickupTime
        ? `เวลารับ: ${formData.pickupTime} น.`
        : "",
      formData.notes ? `หมายเหตุ: ${formData.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      items: checkoutItems.map((item) => ({
        tree_id: String(item.treeId),
        quantity: Number(item.quantity),
      })),
      note: shippingNote,
      total_price: totalPrice,
      discount_amount: 0,
      final_total: totalPrice,
      payment_method: formData.paymentMethod,
      sales_channel: "online",
      fulfillment_method: formData.fulfillmentMethod,
      pickup_date: isDelivery ? null : formData.pickupDate,
      pickup_time: isDelivery ? null : formData.pickupTime,
    };

    try {
      if (userInfo.id && isDelivery) {
        const updatedUser = await service.api.put(`api/users/${userInfo.id}`, {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          subdistrict: formData.subdistrict.trim(),
          district: formData.district.trim(),
          province: formData.province.trim(),
          postal_code: formData.postalCode.trim(),
        });
        userInfoStorage.update(updatedUser);
      }

      const order = await dispatch(onCreateOrder(payload)).unwrap();
      if (isCartCheckout) {
        const purchasedTreeIds = [
          ...new Set(checkoutItems.map((item) => String(item.treeId)).filter(Boolean)),
        ];
        await Promise.all(
          purchasedTreeIds.map((treeId) =>
            dispatch(onDeleteCartItem(treeId)).then((response) => {
              if (!response.error) {
                dispatch(removeFromCart(treeId));
              }
            })
          )
        );
        dispatch(onGetCart());
      }
      await alert.custom.fire({
        icon: "success",
        title: "สั่งซื้อสำเร็จ!",
        html: `
          <p>คำสั่งซื้อของคุณได้รับการยืนยันแล้ว</p>
          <p style="font-size: 14px; color: #666; margin-top: 10px;">
            หมายเลขคำสั่งซื้อ: <strong>${String(order?.id || "").slice(0, 8)}</strong>
          </p>
          <p style="font-size: 14px; color: #666;">
            สถานะ: <strong>รอชำระเงิน</strong>
          </p>
        `,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#4a7c2a",
      });
      history.push("/admin/online-orders");
    } catch (error) {
      alert.custom.fire({
        icon: "error",
        title: "สั่งซื้อไม่สำเร็จ",
        text: error?.message || "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  if (checkoutItems.length === 0) {
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
            <CreditCard
              size={80}
              color="#d4e6d1"
              style={{ marginBottom: "20px" }}
            />
            <h3 style={{ color: "#2d5016", marginBottom: "15px" }}>
              ไม่มีสินค้าในตะกร้า
            </h3>
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
  const totalQuantity = checkoutTotal + shippingFee;

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}
    >
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
          <ArrowLeft
            size={18}
            style={{ marginRight: "8px", verticalAlign: "middle" }}
          />
          กลับ
        </Button>
        <h2
          style={{ color: "#2d5016", fontWeight: "700" }}
          className="d-flex align-items-center"
        >
          <CreditCard size={28} style={{ marginRight: "10px" }} />
          ชำระเงิน
        </h2>
      </div>

      <Row>
        {/* Order Form */}
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
              <h5
                style={{ margin: 0, fontWeight: "700", color: "#2d5016" }}
                className="d-flex align-items-center"
              >
                <User size={20} style={{ marginRight: "10px" }} />
                ข้อมูลการรับสินค้า
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label style={{ color: "#2d5016", fontWeight: "700" }}>
                    วิธีรับสินค้า <span style={{ color: "#c97d60" }}>*</span>
                  </Form.Label>
                  <Row>
                    {[
                      {
                        value: "delivery",
                        title: "จัดส่งตามที่อยู่",
                        description: "ร้านค้าจะจัดส่งตามข้อมูลที่อยู่ด้านล่าง",
                        icon: Truck,
                      },
                      {
                        value: "pickup",
                        title: "รับหน้าร้าน",
                        description: "มารับต้นไม้ที่ร้านด้วยตนเอง",
                        icon: Store,
                      },
                    ].map((option) => {
                      const Icon = option.icon;
                      const checked = formData.fulfillmentMethod === option.value;
                      return (
                        <Col md={6} key={option.value} className="mb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                fulfillmentMethod: option.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              minHeight: 92,
                              textAlign: "left",
                              borderRadius: 14,
                              border: `2px solid ${checked ? "#4a7c2a" : "#d4e6d1"}`,
                              background: checked ? "#eef8ea" : "#fff",
                              color: "#2d5016",
                              padding: 14,
                              boxShadow: checked
                                ? "0 8px 18px rgba(74, 124, 42, 0.14)"
                                : "none",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <Icon size={22} style={{ marginRight: 10, color: "#4a7c2a" }} />
                              <div style={{ fontWeight: 800 }}>{option.title}</div>
                            </div>
                            <div style={{ marginTop: 8, color: "#6b7f62", fontSize: 13 }}>
                              {option.description}
                            </div>
                          </button>
                        </Col>
                      );
                    })}
                  </Row>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: "#2d5016", fontWeight: "600" }}
                      >
                        <User
                          size={16}
                          style={{
                            marginRight: "5px",
                            verticalAlign: "middle",
                          }}
                        />
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
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: "#2d5016", fontWeight: "600" }}
                      >
                        นามสกุล <span style={{ color: "#c97d60" }}>*</span>
                      </Form.Label>
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
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: "#2d5016", fontWeight: "600" }}
                      >
                        <Phone
                          size={16}
                          style={{
                            marginRight: "5px",
                            verticalAlign: "middle",
                          }}
                        />
                        เบอร์โทรศัพท์{" "}
                        <span style={{ color: "#c97d60" }}>*</span>
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
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: "#2d5016", fontWeight: "600" }}
                      >
                        <Mail
                          size={16}
                          style={{
                            marginRight: "5px",
                            verticalAlign: "middle",
                          }}
                        />
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
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {formData.fulfillmentMethod === "delivery" ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                        <MapPin
                          size={16}
                          style={{ marginRight: "5px", verticalAlign: "middle" }}
                        />
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
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ color: "#2d5016", fontWeight: "600" }}
                          >
                            จังหวัด <span style={{ color: "#c97d60" }}>*</span>
                          </Form.Label>
                          <Form.Select
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            isInvalid={!!errors.province}
                            style={addressSelectStyle(!!errors.province)}
                          >
                            <option value="">เลือกจังหวัด</option>
                            {provinceOptions.map((province) => (
                              <option key={province.code} value={province.label}>
                                {province.label}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.province}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ color: "#2d5016", fontWeight: "600" }}
                          >
                            อำเภอ/เขต <span style={{ color: "#c97d60" }}>*</span>
                          </Form.Label>
                          <Form.Select
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            isInvalid={!!errors.district}
                            disabled={!formData.province}
                            style={addressSelectStyle(!!errors.district)}
                          >
                            <option value="">เลือกอำเภอ/เขต</option>
                            {getDistrictOptions(formData.province).map((district) => (
                              <option key={district.code} value={district.label}>
                                {district.label}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.district}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ color: "#2d5016", fontWeight: "600" }}
                          >
                            แขวง/ตำบล <span style={{ color: "#c97d60" }}>*</span>
                          </Form.Label>
                          <Form.Select
                            name="subdistrict"
                            value={formData.subdistrict}
                            onChange={handleInputChange}
                            isInvalid={!!errors.subdistrict}
                            disabled={!formData.district}
                            style={addressSelectStyle(!!errors.subdistrict)}
                          >
                            <option value="">เลือกแขวง/ตำบล</option>
                            {getSubdistrictOptions(formData.province, formData.district).map(
                              (subdistrict) => (
                                <option key={subdistrict.code} value={subdistrict.label}>
                                  {subdistrict.label}
                                </option>
                              )
                            )}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.subdistrict}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ color: "#2d5016", fontWeight: "600" }}
                          >
                            รหัสไปรษณีย์ <span style={{ color: "#c97d60" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            isInvalid={!!errors.postalCode}
                            maxLength={5}
                            readOnly
                            style={readonlyAddressStyle(!!errors.postalCode)}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.postalCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <div
                      className="mb-3"
                      style={{
                        border: "1px solid #d4e6d1",
                        background: "#f7fbf5",
                        borderRadius: 12,
                        color: "#4f6f43",
                        fontWeight: 700,
                        padding: "14px 16px",
                      }}
                    >
                      เลือกรับหน้าร้านแล้ว ไม่จำเป็นต้องกรอกที่อยู่จัดส่ง
                    </div>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                            <Calendar
                              size={16}
                              style={{ marginRight: "5px", verticalAlign: "middle" }}
                            />
                            วันที่รับสินค้า <span style={{ color: "#c97d60" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            ref={pickupDateRef}
                            type="date"
                            name="pickupDate"
                            value={formData.pickupDate}
                            min={getTodayDate()}
                            onChange={handleInputChange}
                            onClick={() => openNativePicker(pickupDateRef)}
                            isInvalid={!!errors.pickupDate}
                            style={{
                              borderRadius: "8px",
                              borderColor: errors.pickupDate ? "#c97d60" : "#d4e6d1",
                              minHeight: "44px",
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pickupDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                            <Clock
                              size={16}
                              style={{ marginRight: "5px", verticalAlign: "middle" }}
                            />
                            เวลารับสินค้า <span style={{ color: "#c97d60" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            ref={pickupTimeRef}
                            type="time"
                            name="pickupTime"
                            value={formData.pickupTime}
                            onChange={handleInputChange}
                            onClick={() => openNativePicker(pickupTimeRef)}
                            isInvalid={!!errors.pickupTime}
                            style={{
                              borderRadius: "8px",
                              borderColor: errors.pickupTime ? "#c97d60" : "#d4e6d1",
                              minHeight: "44px",
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pickupTime}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                    <CreditCard
                      size={16}
                      style={{ marginRight: "5px", verticalAlign: "middle" }}
                    />
                    วิธีการชำระเงิน <span style={{ color: "#c97d60" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    style={addressSelectStyle(false)}
                  >
                    <option value="transfer">โอนเงินผ่านธนาคาร</option>
                    <option value="cod">เก็บเงินปลายทาง (COD)</option>
                    <option value="promptpay">พร้อมเพย์</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                    หมายเหตุ (ถ้ามี)
                  </Form.Label>
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

                <div
                  className="d-flex align-items-center"
                  style={{
                    padding: "15px",
                    backgroundColor: "#f0f5ee",
                    borderRadius: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Lock
                    size={18}
                    color="#4a7c2a"
                    style={{ marginRight: "10px" }}
                  />
                  <span style={{ fontSize: "14px", color: "#5a7c3a" }}>
                    ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้เฉพาะเพื่อดำเนินการคำสั่งซื้อเท่านั้น
                  </span>
                </div>
              </Form>
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
              position: "sticky",
              top: "20px",
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
              {/* Order Items */}
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginBottom: "20px",
                }}
              >
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center mb-3"
                    style={{
                      paddingBottom: "15px",
                      borderBottom: "1px solid #d4e6d1",
                    }}
                  >
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/60x60?text=Tree"
                      }
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
                        e.target.src =
                          "https://via.placeholder.com/60x60?text=Tree";
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#2d5016",
                          marginBottom: "3px",
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#5a7c3a" }}>
                        {item.quantity} x {item.price.toLocaleString()} ฿
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#2d5016",
                      }}
                    >
                      {(item.price * item.quantity).toLocaleString()} ฿
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: "#d4e6d1", margin: "20px 0" }} />

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>วิธีรับสินค้า:</span>
                  <span style={{ color: "#2d5016", fontWeight: "700" }}>
                    {formData.fulfillmentMethod === "delivery"
                      ? "จัดส่งตามที่อยู่"
                      : "รับหน้าร้าน"}
                  </span>
                </div>
                {formData.fulfillmentMethod === "pickup" ? (
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: "#5a7c3a" }}>เวลารับ:</span>
                    <span style={{ color: "#2d5016", fontWeight: "700", textAlign: "right" }}>
                      {formData.pickupDate && formData.pickupTime
                        ? `${formatPickupDate(formData.pickupDate)} ${formData.pickupTime} น.`
                        : "ยังไม่ได้ระบุ"}
                    </span>
                  </div>
                ) : null}
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>ยอดรวมสินค้า:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>
                    {checkoutTotal.toLocaleString()} ฿
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>
                    <Truck
                      size={14}
                      style={{ marginRight: "5px", verticalAlign: "middle" }}
                    />
                    ค่าจัดส่ง:
                  </span>
                  <span style={{ color: "#4a7c2a", fontWeight: "600" }}>
                    {formData.fulfillmentMethod === "delivery" ? "ฟรี" : "-"}
                  </span>
                </div>
                <hr style={{ borderColor: "#d4e6d1", margin: "15px 0" }} />
                <div className="d-flex justify-content-between">
                  <span
                    style={{
                      color: "#2d5016",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    ยอดรวมทั้งสิ้น:
                  </span>
                  <span
                    style={{
                      color: "#2d5016",
                      fontWeight: "700",
                      fontSize: "24px",
                    }}
                  >
                    {totalQuantity.toLocaleString()} ฿
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={orderLoading}
                style={{
                  width: "100%",
                  alignItems: "center",
                  background: orderLoading
                    ? "linear-gradient(135deg, #88a975 0%, #6f945b 100%)"
                    : "linear-gradient(135deg, #2f6b1f 0%, #4a8f2f 100%)",
                  border: "1px solid #2f6b1f",
                  borderRadius: "12px",
                  boxShadow: orderLoading
                    ? "none"
                    : "0 12px 24px rgba(47, 107, 31, 0.24)",
                  color: "#ffffff",
                  cursor: orderLoading ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  fontSize: "16px",
                  fontWeight: "800",
                  justifyContent: "center",
                  letterSpacing: 0,
                  marginTop: "20px",
                  minHeight: "56px",
                  opacity: 1,
                  padding: "14px 18px",
                  textShadow: "0 1px 1px rgba(0, 0, 0, 0.18)",
                }}
              >
                {orderLoading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ color: "#ffffff", marginRight: "8px" }}
                  />
                ) : (
                  <CheckCircle
                    size={20}
                    color="#ffffff"
                    style={{ marginRight: "8px", verticalAlign: "middle" }}
                  />
                )}
                {orderLoading ? "กำลังยืนยันคำสั่งซื้อ..." : "ยืนยันการสั่งซื้อ"}
              </Button>

              <div
                className="d-flex align-items-center justify-content-center mt-3"
                style={{ fontSize: "12px", color: "#5a7c3a" }}
              >
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
