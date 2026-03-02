import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  Calculator,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { onGetAllTree } from "../../redux/slices/treeSlice";
import { onCreateOrder } from "../../redux/slices/orderSlice";
import alert from "../../utils/alert";

const pageStyles = `
  .sale-page {
    --sale-bg: #f6faf5;
    --sale-card: #ffffff;
    --sale-border: #d7e8d3;
    --sale-border-2: #cfe3cb;
    --sale-text: #1f3a14;
    --sale-subtext: #5a7c3a;
    --sale-muted: #6c757d;
    --sale-primary: #2d5016;
    --sale-accent: #4a7c2a;
    --sale-accent-2: #2f7d57;
    --sale-shadow: 0 10px 24px rgba(45, 80, 22, 0.10);
    --sale-shadow-2: 0 6px 16px rgba(45, 80, 22, 0.08);
  }

  .sale-hero {
    border: 1px solid var(--sale-border);
    border-radius: 18px;
    background:
      radial-gradient(1200px 280px at 10% 0%, rgba(74, 124, 42, 0.22), transparent 55%),
      radial-gradient(900px 320px at 80% 10%, rgba(47, 125, 87, 0.18), transparent 60%),
      linear-gradient(180deg, #ffffff 0%, #f3fbf1 100%);
    box-shadow: var(--sale-shadow);
  }

  .sale-card {
    border: 1px solid var(--sale-border);
    border-radius: 18px;
    background: var(--sale-card);
    box-shadow: var(--sale-shadow-2);
    overflow: hidden;
  }

  .sale-cardHeader {
    background: linear-gradient(180deg, #e9f7e4 0%, #e2f2de 100%);
    border-bottom: 1px solid var(--sale-border-2);
  }

  .sale-stat {
    border: 1px solid var(--sale-border);
    border-radius: 16px;
    background: linear-gradient(180deg, #ffffff 0%, #f7fcf6 100%);
    box-shadow: 0 4px 14px rgba(45, 80, 22, 0.08);
  }
  .sale-statTitle {
    color: var(--sale-muted);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .2px;
  }
  .sale-statValue {
    color: var(--sale-text);
    font-size: 22px;
    font-weight: 900;
    margin-top: 4px;
    line-height: 1.1;
  }

  .sale-search {
    border-radius: 14px !important;
    border: 1px solid var(--sale-border) !important;
    background: #fff !important;
    box-shadow: 0 6px 16px rgba(45, 80, 22, 0.08);
    height: 44px;
  }

  .sale-tableWrap {
    border: 1px solid var(--sale-border);
    border-radius: 16px;
    overflow: hidden;
  }

  .sale-table thead th {
    background: #fbfdfb;
    color: var(--sale-muted);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .2px;
    border-bottom: 1px solid var(--sale-border);
    padding-top: 14px;
    padding-bottom: 14px;
    white-space: nowrap;
  }

  .sale-table tbody td {
    border-top: 1px solid rgba(215, 232, 211, 0.7);
    padding-top: 14px;
    padding-bottom: 14px;
    vertical-align: middle;
  }

  .sale-row {
    transition: background-color .15s ease;
  }
  .sale-row:hover {
    background: rgba(232, 245, 227, 0.55);
  }
  .sale-row--selected {
    background: rgba(74, 124, 42, 0.10);
  }

  .sale-pill {
    border-radius: 999px !important;
    padding: 8px 12px !important;
    font-weight: 800 !important;
  }

  .sale-qtyBtn {
    border-radius: 12px !important;
    width: 36px;
    height: 36px;
    padding: 0 !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
  }

  .sale-qtyInput {
    height: 36px !important;
    border-radius: 12px !important;
    border: 1px solid var(--sale-border) !important;
    box-shadow: inset 0 1px 0 rgba(0,0,0,0.03);
    font-weight: 800;
  }

  /* Hide number spinners */
  .sale-page input[type=number]::-webkit-outer-spin-button,
  .sale-page input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .sale-page input[type=number] { -moz-appearance: textfield; }

  @media (max-width: 576px) {
    .sale-hero { border-radius: 14px; }
    .sale-card { border-radius: 14px; }
    .sale-stat { border-radius: 14px; }
    .sale-statValue { font-size: 18px; }
    .sale-search { height: 40px; }
    .sale-qtyBtn { width: 34px; height: 34px; }
    .sale-qtyInput { height: 34px !important; }
  }
`;

const Sale = () => {
  const dispatch = useDispatch();
  const { tableTree, loading } = useSelector((state) => state.treeSlice || {});
  const orderLoading = useSelector(
    (state) => state.orderSlice?.loading || false,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQty, setSelectedQty] = useState({});
  const [orderNote, setOrderNote] = useState("");
  const [customTotalPrice, setCustomTotalPrice] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(onGetAllTree());
  }, [dispatch]);

  const getItemPrice = (item) => {
    const price = item?.sell_price ?? item?.price ?? item?.amount ?? 0;
    return Number(price) || 0;
  };

  const getStock = (item) => {
    const stock = item?.quantity ?? item?.stock ?? item?.total_quantity ?? 0;
    return Math.max(Number(stock) || 0, 0);
  };

  const activeTrees = useMemo(() => {
    const rows = Array.isArray(tableTree?.data) ? tableTree.data : [];
    return rows.filter(
      (item) =>
        String(item?.status || "").toLowerCase() !== "inactive" &&
        String(item?.status || "").toLowerCase() !== "deleted",
    );
  }, [tableTree]);

  const filteredTrees = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return activeTrees;
    return activeTrees.filter((item) => {
      const idText = String(item?.id || item?._id || "").toLowerCase();
      const name = String(item?.name || "").toLowerCase();
      const species = String(
        item?.species || item?.category || "",
      ).toLowerCase();
      const price = String(getItemPrice(item)).toLowerCase();
      const quantity = String(getStock(item)).toLowerCase();
      return (
        idText.includes(keyword) ||
        name.includes(keyword) ||
        species.includes(keyword) ||
        price.includes(keyword) ||
        quantity.includes(keyword)
      );
    });
  }, [activeTrees, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTrees.length / itemsPerPage),
  );
  const paginatedTrees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrees.slice(start, start + itemsPerPage);
  }, [filteredTrees, currentPage]);

  const selectedItems = useMemo(() => {
    return activeTrees
      .map((item) => {
        const key = item?.id || item?._id;
        const qty = Number(selectedQty[key] || 0);
        if (!key || qty <= 0) return null;
        const price = getItemPrice(item);
        return {
          key,
          name: item?.name || "ไม่ระบุชื่อ",
          stock: getStock(item),
          qty,
          price,
          subtotal: qty * price,
        };
      })
      .filter(Boolean);
  }, [activeTrees, selectedQty]);

  const totalQty = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.qty, 0),
    [selectedItems],
  );
  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.subtotal, 0),
    [selectedItems],
  );
  const editedTotalPrice = useMemo(() => {
    if (customTotalPrice === "") return totalPrice;
    const parsed = Number(customTotalPrice);
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : totalPrice;
  }, [customTotalPrice, totalPrice]);
  const discount = useMemo(
    () => Math.max(totalPrice - editedTotalPrice, 0),
    [totalPrice, editedTotalPrice],
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleSelectRow = (item) => {
    const key = item?.id || item?._id;
    if (!key) return;
    const maxStock = getStock(item);
    if (maxStock <= 0) return;

    setSelectedQty((prev) => {
      const current = Number(prev[key] || 0);
      return { ...prev, [key]: Math.min(current + 1, maxStock) };
    });
  };

  const handleChangeQty = (key, maxStock, mode) => {
    setSelectedQty((prev) => {
      const current = Number(prev[key] || 0);
      let nextQty = current;
      if (mode === "inc") nextQty = Math.min(current + 1, maxStock);
      if (mode === "dec") nextQty = Math.max(current - 1, 0);

      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[key];
      } else {
        next[key] = nextQty;
      }
      return next;
    });
  };

  const handleInputQty = (key, maxStock, value) => {
    const input = Number(value);
    const qty = Number.isFinite(input)
      ? Math.min(Math.max(Math.floor(input), 0), maxStock)
      : 0;

    setSelectedQty((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[key];
      } else {
        next[key] = qty;
      }
      return next;
    });
  };

  const handleRemoveItem = (key) => {
    setSelectedQty((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleReset = () => {
    setSelectedQty({});
    setOrderNote("");
    setCustomTotalPrice("");
  };

  const handleConfirmSale = async () => {
    if (selectedItems.length === 0) {
      alert.custom.fire({
        icon: "warning",
        title: "ยังไม่ได้เลือกรายการ",
        text: "กรุณาเลือกรายการจากตารางด้านบนก่อน",
      });
      return;
    }
    const totalPriceBeforeDiscount = Number(totalPrice);
    const finalTotalNet = Number(editedTotalPrice);
    const discountAmount = Number(discount);

    console.log("totalPriceBeforeDiscount : ", totalPriceBeforeDiscount);
    console.log("finalTotalNet : ", finalTotalNet);
    console.log("discountAmount : ", discountAmount);

    const payload = {
      items: selectedItems.map((item) => ({
        tree_id: String(item.key),
        quantity: Number(item.qty),
      })),
      note: orderNote.trim(),
      total_price: totalPriceBeforeDiscount, // ราคารวมเดิม
      final_total: finalTotalNet, // ยอดสุทธิหลังลด
      discount_amount: discountAmount, // ส่วนลด
    };

    console.log("payload : ", payload);

    try {
      await dispatch(onCreateOrder(payload)).unwrap();
      await dispatch(onGetAllTree());
      handleReset();

      alert.custom.fire({
        icon: "success",
        title: "บันทึกคำสั่งซื้อสำเร็จ",
        html: `
          <div style="text-align:left;font-size:14px;">
            <div>จำนวนรายการ: <strong>${selectedItems.length}</strong></div>
            <div>จำนวนต้นไม้รวม: <strong>${totalQty}</strong></div>
            <div>ราคารวมเดิม: <strong>${totalPrice.toLocaleString()} บาท</strong></div>
            <div>ส่วนลด: <strong>${discount.toLocaleString()} บาท</strong></div>
            <div>ยอดสุทธิ: <strong>${editedTotalPrice.toLocaleString()} บาท</strong></div>
          </div>
        `,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#4a7c2a",
      });
    } catch (error) {
      // service.api.post in thunk handles alert on error already
      console.error("Create order failed:", error);
    }
  };

  return (
    <Container
      fluid
      className="p-4 sale-page"
      style={{ backgroundColor: "var(--sale-bg)", minHeight: "100vh" }}
    >
      <style>{pageStyles}</style>
      <Row className="mb-4">
        <Col>
          <Card className="sale-hero">
            <Card.Body className="p-4 d-flex justify-content-between align-items-center flex-wrap">
              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg, rgba(74,124,42,.22), rgba(47,125,87,.22))",
                    border: "1px solid var(--sale-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 18px rgba(45,80,22,.10)",
                  }}
                >
                  <ShoppingBag size={22} color="#2d5016" />
                </div>
                <div>
                  <h3
                    style={{
                      color: "var(--sale-primary)",
                      margin: 0,
                      fontWeight: 900,
                    }}
                  >
                    ขายต้นไม้
                  </h3>
                  <div
                    style={{
                      color: "var(--sale-subtext)",
                      marginTop: 6,
                      fontSize: 14,
                    }}
                  >
                    ค้นหาในตาราง แล้วคลิกทั้งแถวเพื่อเพิ่มเข้าออเดอร์
                  </div>
                </div>
              </div>

              <div
                className="d-flex align-items-center mt-3 mt-md-0"
                style={{ gap: "10px" }}
              >
                <Badge
                  pill
                  bg="success"
                  className="sale-pill"
                  style={{ backgroundColor: "#2f7d57" }}
                >
                  {selectedItems.length.toLocaleString()} รายการ
                </Badge>
                <Badge pill bg="success" className="sale-pill">
                  รวม {totalQty.toLocaleString()} ต้น
                </Badge>
                <Badge pill bg="primary" className="sale-pill">
                  {totalPrice.toLocaleString()} บาท
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col lg={3} md={6} sm={6}>
          <Card className="sale-stat">
            <Card.Body className="p-3">
              <div className="sale-statTitle">สินค้าทั้งหมด</div>
              <div className="sale-statValue">
                {activeTrees.length.toLocaleString()}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={6}>
          <Card className="sale-stat">
            <Card.Body className="p-3">
              <div className="sale-statTitle">รายการที่เลือก</div>
              <div className="sale-statValue">
                {selectedItems.length.toLocaleString()}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={6}>
          <Card className="sale-stat">
            <Card.Body className="p-3">
              <div className="sale-statTitle">จำนวนต้นไม้รวม</div>
              <div className="sale-statValue">{totalQty.toLocaleString()}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={6}>
          <Card className="sale-stat">
            <Card.Body className="p-3">
              <div className="sale-statTitle">ราคารวม</div>
              <div className="sale-statValue">
                {totalPrice.toLocaleString()} ฿
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="mb-4">
          <Card className="sale-card">
            <Card.Header className="sale-cardHeader p-3">
              <Row className="align-items-center">
                <Col md={6} className="mb-2 mb-md-0">
                  <div
                    style={{ color: "var(--sale-primary)", fontWeight: 900 }}
                  >
                    เลือกต้นไม้เพื่อขาย
                  </div>
                  <div
                    style={{
                      color: "var(--sale-muted)",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    Tip: คลิกซ้ำเพื่อเพิ่มจำนวน (ระบบจะไม่เกินคงเหลือ)
                  </div>
                </Col>
                <Col md={6}>
                  <div className="position-relative">
                    <Search
                      size={16}
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                      }}
                    />
                    <Form.Control
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="ค้นหาได้ทั้ง id, ชื่อ, สายพันธุ์, ราคา, จำนวน"
                      className="sale-search"
                      style={{ paddingLeft: "36px" }}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="sale-tableWrap">
                <Table responsive hover className="mb-0 sale-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>ชื่อต้นไม้</th>
                      <th style={{ textAlign: "left" }}>สายพันธุ์</th>
                      <th style={{ width: "140px", textAlign: "right" }}>
                        ราคาขาย
                      </th>
                      <th style={{ width: "120px", textAlign: "center" }}>
                        คงเหลือ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTrees.map((item) => {
                      const key = item?.id || item?._id;
                      const stock = getStock(item);
                      const price = getItemPrice(item);
                      const pickedQty = Number(selectedQty[key] || 0);
                      const isSelected = pickedQty > 0;
                      return (
                        <tr
                          key={key}
                          onClick={() => handleSelectRow(item)}
                          className={`sale-row ${isSelected ? "sale-row--selected" : ""}`}
                          style={{
                            cursor: stock > 0 ? "pointer" : "not-allowed",
                            opacity: stock > 0 ? 1 : 0.6,
                          }}
                          title={
                            stock > 0
                              ? "คลิกเพื่อเพิ่มเข้าออเดอร์"
                              : "สินค้าหมด"
                          }
                        >
                          <td style={{ verticalAlign: "middle" }}>
                            <div
                              className="d-flex align-items-center justify-content-between"
                              style={{ gap: "10px" }}
                            >
                              <div
                                style={{
                                  fontWeight: 900,
                                  color: "var(--sale-primary)",
                                  fontSize: 30,
                                }}
                              >
                                {item?.name || "-"}
                              </div>
                              {isSelected && (
                                <Badge
                                  pill
                                  bg="success"
                                  style={{
                                    backgroundColor: "rgba(47,125,87,.15)",
                                    color: "var(--sale-accent-2)",
                                    border: "1px solid rgba(47,125,87,.25)",
                                    fontWeight: 900,
                                  }}
                                >
                                  เลือก {pickedQty}
                                </Badge>
                              )}
                            </div>
                            <div
                              style={{
                                color: "var(--sale-muted)",
                                fontSize: 12,
                                marginTop: 4,
                              }}
                            >
                              {String(key || "").slice(0, 10)}
                              {String(key || "").length > 10 ? "..." : ""}
                            </div>
                          </td>
                          <td style={{ verticalAlign: "middle", fontSize: 30 }}>
                            {item?.species || item?.category || "-"}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              verticalAlign: "middle",
                              fontWeight: 900,
                              fontSize: 30,
                            }}
                          >
                            {price.toLocaleString()} ฿
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              fontSize: 30,
                            }}
                          >
                            <Badge
                              bg={stock > 0 ? "success" : "secondary"}
                              pill
                              style={{ color: "white" }}
                            >
                              {stock}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}

                    {!loading && paginatedTrees.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4"
                          style={{ color: "#6c757d" }}
                        >
                          ไม่พบข้อมูลต้นไม้
                        </td>
                      </tr>
                    )}

                    {loading && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4"
                          style={{ color: "#6c757d" }}
                        >
                          กำลังโหลดข้อมูล...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-between align-items-center">
              <span style={{ color: "#6c757d", fontSize: "14px" }}>
                หน้า {currentPage} / {totalPages}
              </span>
              <div className="d-flex" style={{ gap: "8px" }}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage <= 1}
                >
                  ก่อนหน้า
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                >
                  ถัดไป
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={12}>
          <Card className="sale-card">
            <Card.Header className="sale-cardHeader p-3 d-flex justify-content-between align-items-center flex-wrap">
              <div style={{ color: "var(--sale-primary)", fontWeight: 900 }}>
                <Calculator size={16} style={{ marginRight: 6 }} />
                รายการที่สั่งซื้อ
              </div>
              <div
                className="d-flex align-items-center mt-2 mt-md-0"
                style={{ gap: "10px" }}
              >
                <Badge
                  pill
                  bg="success"
                  className="sale-pill"
                  style={{ backgroundColor: "#2f7d57" }}
                >
                  {selectedItems.length.toLocaleString()} รายการ
                </Badge>
                <Badge pill bg="primary" className="sale-pill">
                  {totalPrice.toLocaleString()} บาท
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="sale-tableWrap">
                <Table responsive className="mb-0 sale-table">
                  <thead>
                    <tr>
                      <th>ชื่อต้นไม้</th>
                      <th style={{ width: "120px", textAlign: "center" }}>
                        คงเหลือ
                      </th>
                      <th style={{ width: "240px", textAlign: "center" }}>
                        จำนวนสั่งซื้อ
                      </th>
                      <th style={{ width: "140px", textAlign: "right" }}>
                        ราคา/ต้น
                      </th>
                      <th style={{ width: "150px", textAlign: "right" }}>
                        รวม
                      </th>
                      <th style={{ width: "120px", textAlign: "center" }}>
                        จัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item) => (
                      <tr
                        key={item.key}
                        className="sale-row sale-row--selected"
                      >
                        <td style={{ verticalAlign: "middle" }}>
                          <div
                            style={{
                              fontWeight: 900,
                              color: "var(--sale-primary)",
                              fontSize: 30,
                            }}
                          >
                            {item.name}
                          </div>
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <Badge bg="success" pill style={{ fontSize: 30 }}>
                            {item.stock}
                          </Badge>
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <div
                            className="d-inline-flex align-items-center"
                            style={{ gap: "8px" }}
                          >
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              className="sale-qtyBtn"
                              onClick={() =>
                                handleChangeQty(item.key, item.stock, "dec")
                              }
                            >
                              <Minus size={14} />
                            </Button>
                            <Form.Control
                              type="number"
                              min={0}
                              max={item.stock}
                              value={item.qty}
                              onChange={(e) =>
                                handleInputQty(
                                  item.key,
                                  item.stock,
                                  e.target.value,
                                )
                              }
                              className="sale-qtyInput"
                              style={{ width: "78px", textAlign: "center" }}
                            />
                            <Button
                              size="sm"
                              variant="outline-success"
                              className="sale-qtyBtn"
                              disabled={item.qty >= item.stock}
                              onClick={() =>
                                handleChangeQty(item.key, item.stock, "inc")
                              }
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            verticalAlign: "middle",
                            fontSize: 30,
                          }}
                        >
                          {item.price.toLocaleString()} ฿
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            verticalAlign: "middle",
                            fontWeight: "900",
                            fontSize: 30,
                          }}
                        >
                          {item.subtotal.toLocaleString()} ฿
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(item.key)}
                            style={{ borderRadius: 12, fontWeight: 800 }}
                          >
                            ลบ
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {selectedItems.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4"
                          style={{ color: "#6c757d", fontSize: 30 }}
                        >
                          ยังไม่มีรายการสั่งซื้อ
                          (คลิกแถวจากตารางด้านบนเพื่อเพิ่ม)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="p-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div
                  style={{
                    color: "var(--sale-primary)",
                    fontWeight: 900,
                    fontSize: 30,
                  }}
                >
                  ราคารวมทั้งหมด: {totalPrice.toLocaleString()} บาท
                </div>
                <div className="d-flex mt-2 mt-md-0" style={{ gap: "8px" }}>
                  <Button
                    variant="outline-secondary"
                    onClick={handleReset}
                    style={{ borderRadius: 12, fontWeight: 800 }}
                    disabled={orderLoading}
                  >
                    <Trash2 size={16} style={{ marginRight: "6px" }} />
                    ล้างรายการ
                  </Button>
                  <Button
                    onClick={handleConfirmSale}
                    disabled={orderLoading}
                    style={{
                      backgroundColor: "var(--sale-accent)",
                      borderColor: "var(--sale-accent)",
                      borderRadius: 12,
                      fontWeight: 900,
                      color: "white",
                    }}
                  >
                    {orderLoading ? "กำลังบันทึก..." : "ขาย"}
                  </Button>
                </div>
              </div>

              <div
                className="mt-4 d-flex align-items-center flex-wrap"
                style={{ gap: "10px" }}
              >
                <div
                  style={{
                    color: "var(--sale-primary)",
                    fontWeight: 900,
                    fontSize: 30,
                  }}
                >
                  แก้ไขราคารวม:
                </div>
                <Form.Control
                  type="number"
                  min={0}
                  value={customTotalPrice}
                  onChange={(e) => setCustomTotalPrice(e.target.value)}
                  placeholder={`${totalPrice}`}
                  style={{
                    borderRadius: 12,
                    maxWidth: "220px",
                    fontSize: 30,
                    fontWeight: 900,
                    height: "54px",
                    color: "var(--sale-primary)",
                  }}
                />
                <div
                  style={{
                    color: "var(--sale-primary)",
                    fontWeight: 900,
                    fontSize: 30,
                  }}
                >
                  บาท
                </div>
              </div>

              <div
                className="mt-4 d-flex align-items-center flex-wrap "
                style={{ gap: "10px" }}
              >
                <div
                  style={{
                    color: "var(--sale-primary)",
                    fontWeight: 900,
                    fontSize: 30,
                  }}
                >
                  ยอดสุทธิ: {editedTotalPrice.toLocaleString()} บาท
                </div>
                <div
                  style={{
                    color: "var(--sale-subtext)",
                    fontWeight: 800,
                    fontSize: 24,
                    marginLeft: 8,
                  }}
                >
                  ส่วนลด:
                </div>
                <div
                  style={{
                    color: "var(--sale-subtext)",
                    fontWeight: 800,
                    fontSize: 24,
                    marginLeft: 8,
                  }}
                >
                  {discount.toLocaleString()}
                </div>
                <div
                  style={{
                    color: "var(--sale-subtext)",
                    fontWeight: 800,
                    fontSize: 24,
                    marginLeft: 8,
                  }}
                >
                  บาท
                </div>
              </div>

              <div
                className="mt-3 d-flex align-items-start flex-wrap pt-2"
                style={{ gap: "10px" }}
              >
                <div
                  style={{
                    color: "var(--sale-primary)",
                    fontWeight: 900,
                    fontSize: 30,
                  }}
                >
                  note:
                </div>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="หมายเหตุคำสั่งซื้อ เช่น ซื้อปลูกหน้าบ้าน"
                  style={{ borderRadius: 12, maxWidth: "520px" }}
                />
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Sale;
