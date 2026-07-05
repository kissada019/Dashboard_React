import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
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

const getCartItemDetails = (item) => {
  const treeId = item.tree_id || item.tree?.id || item.id;
  const itemId = item.id || item.cart_id || treeId;
  const price = Number(item.sell_price ?? item.price ?? item.tree?.sell_price ?? 0);
  const quantity = Number(item.quantity ?? 0);
  const rawImage =
    item.image_url ||
    item.imageUrl ||
    item.image ||
    item.tree?.image_url ||
    item.tree?.images?.[0] ||
    "";

  return {
    itemId,
    treeId,
    name: item.name || item.tree_name || item.tree?.name || "-",
    species: item.species || item.tree_species || item.tree?.species || "",
    location: item.location || item.tree_location || item.tree?.location || "",
    price,
    quantity,
    maxQuantity: Number(item.maxQuantity ?? item.stock ?? item.tree?.quantity ?? 9999),
    image: toImageSrc(rawImage),
  };
};

const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [selectedTreeIds, setSelectedTreeIds] = useState([]);
  const [orderNote, setOrderNote] = useState("");
  const paymentMethod = "transfer";

  // ดึงข้อมูลตะกร้าจาก API เมื่อเปิดหน้า
  useEffect(() => {
    dispatch(onGetCart());
  }, [dispatch]);

  // ใช้ข้อมูลจาก API (apiItems) ถ้ามี, ไม่งั้น fallback ไปใช้ local items
  const cartItems = cart.apiItems || cart.items || [];
  const normalizedItems = useMemo(
    () => cartItems.map(getCartItemDetails).filter((item) => item.treeId),
    [cartItems]
  );
  const selectedItems = useMemo(
    () =>
      normalizedItems.filter((item) =>
        selectedTreeIds.includes(String(item.treeId))
      ),
    [normalizedItems, selectedTreeIds]
  );
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const selectedOverStockItems = selectedItems.filter(
    (item) => item.maxQuantity < 9999 && item.quantity > item.maxQuantity
  );
  const isAllSelected =
    normalizedItems.length > 0 && selectedTreeIds.length === normalizedItems.length;

  useEffect(() => {
    const currentIds = normalizedItems.map((item) => String(item.treeId));
    setSelectedTreeIds((prev) => {
      if (prev.length === 0) return currentIds;
      return prev.filter((id) => currentIds.includes(id));
    });
  }, [normalizedItems]);

  const handleToggleItem = (treeId) => {
    const id = String(treeId);
    setSelectedTreeIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    setSelectedTreeIds(
      isAllSelected ? [] : normalizedItems.map((item) => String(item.treeId))
    );
  };

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
    if (normalizedItems.length === 0) {
      alert.custom.fire({
        icon: "warning",
        title: "ตะกร้าว่าง",
        text: "กรุณาเพิ่มสินค้าลงตะกร้าก่อน",
      });
      return;
    }
    if (selectedItems.length === 0) {
      alert.custom.fire({
        icon: "warning",
        title: "ยังไม่ได้เลือกรายการ",
        text: "กรุณาเลือกต้นไม้ที่ต้องการซื้ออย่างน้อย 1 รายการ",
      });
      return;
    }
    if (selectedOverStockItems.length > 0) {
      alert.custom.fire({
        icon: "warning",
        title: "จำนวนสินค้าเกินสต็อก",
        html: selectedOverStockItems
          .map(
            (item) =>
              `<div style="text-align:left">- ${item.name}: ในตะกร้า ${item.quantity} ต้น / คงเหลือ ${item.maxQuantity} ต้น</div>`
          )
          .join(""),
        confirmButtonText: "ตกลง",
      });
      return;
    }

    history.push("/admin/checkout", {
      checkoutItems: selectedItems,
      orderNote: orderNote.trim(),
      source: "cart",
    });
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

  if (normalizedItems.length === 0) {
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
          {normalizedItems.length} รายการ
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
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "14%" }} />
                </colgroup>
                <thead style={{ backgroundColor: "#f0f5ee" }}>
                  <tr>
                    {["เลือก", "สินค้า", "ราคา", "จำนวน", "รวม", "จัดการ"].map(
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
                            {title === "เลือก" ? (
                              <Form.Check
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={handleToggleAll}
                                aria-label="เลือกรายการทั้งหมด"
                                style={{
                                  minHeight: "20px",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              />
                            ) : (
                              title
                            )}
                          </div>
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {normalizedItems.map((item) => {
                    const isSelected = selectedTreeIds.includes(
                      String(item.treeId)
                    );

                    return (
                      <tr
                        key={item.itemId}
                        style={{
                          borderColor: "#d4e6d1",
                          backgroundColor: isSelected ? "#fbfef9" : "#fff",
                        }}
                      >
                        <td
                          style={{
                            padding: "20px",
                            borderColor: "#d4e6d1",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <Form.Check
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleItem(item.treeId)}
                            aria-label={`เลือก ${item.name}`}
                            style={{
                              minHeight: "20px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          />
                        </td>
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
                              src={item.image || PLACEHOLDER_IMAGE}
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
                                {item.name}
                              </h6>
                              {item.species && (
                                <Badge
                                  style={{
                                    backgroundColor: "#e8f5e3",
                                    color: "#fff",
                                    fontSize: "12px",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                  }}
                                >
                                  {item.species}
                                </Badge>
                              )}
                              {item.location && (
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#5a7c3a",
                                    marginTop: "5px",
                                  }}
                                >
                                  สถานที่: {item.location}
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
                            {item.price.toLocaleString()} ฿
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
                                item.quantity <= 1
                                  ? handleRemoveItem(item.treeId)
                                  : handleQuantityChange(item.treeId, "decrement")
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
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.treeId, "increment")
                              }
                              disabled={item.quantity >= item.maxQuantity}
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
                          {item.quantity >= item.maxQuantity && item.maxQuantity < 9999 && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#c97d60",
                                marginTop: "5px",
                              }}
                            >
                              {item.quantity > item.maxQuantity
                                ? `เกินสต็อก คงเหลือ ${item.maxQuantity} ต้น`
                                : `สูงสุด ${item.maxQuantity} ต้น`}
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
                            {(item.price * item.quantity).toLocaleString()} ฿
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
                            onClick={() => handleRemoveItem(item.treeId)}
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
                  <span style={{ color: "#5a7c3a" }}>รายการที่เลือก:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>
                    {selectedItems.length} / {normalizedItems.length} รายการ
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>จำนวนต้นไม้:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>
                    {selectedQuantity} ต้น
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#5a7c3a" }}>ส่วนลด:</span>
                  <span style={{ color: "#2d5016", fontWeight: "600" }}>
                    0 ฿
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
                    ยอดสุทธิ:
                  </span>
                  <span
                    style={{
                      color: "#2d5016",
                      fontWeight: "700",
                      fontSize: "24px",
                    }}
                  >
                    {selectedTotal.toLocaleString()} ฿
                  </span>
                </div>
              </div>

              <Form className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                    หมายเหตุ
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    // placeholder="เช่น "
                    style={{
                      borderRadius: "10px",
                      borderColor: "#d4e6d1",
                      color: "#2d5016",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d5016", fontWeight: "600" }}>
                    วิธีชำระเงิน
                  </Form.Label>
                  <div
                    style={{
                      borderRadius: "10px",
                      border: "1px solid #d4e6d1",
                      backgroundColor: "#f5fbf2",
                      color: "#2d5016",
                      fontWeight: "600",
                      padding: "10px 12px",
                    }}
                  >
                    โอนเงิน
                  </div>
                </Form.Group>

                <div
                  style={{
                    backgroundColor: "#f5fbf2",
                    border: "1px solid #d4e6d1",
                    borderRadius: "10px",
                    padding: "12px",
                    color: "#5a7c3a",
                    fontSize: "13px",
                  }}
                >
                  ช่องทางการขาย: <strong>online</strong>
                </div>
              </Form>

              <Button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
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
                กรอกข้อมูลจัดส่ง
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
