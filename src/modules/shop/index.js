import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Modal,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  Search,
  Leaf,
  ShoppingCart,
  Eye,
  Sprout,
  SlidersHorizontal,
} from "lucide-react";
import { onGetAllTree } from "../../redux/slices/treeSlice";
import { addToCart, onAddToCartAPI } from "../../redux/slices/cartSlice";
import alert from "../../utils/alert";
import userInfoStorage from "../../storage/userInfoStorage";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e8f5e3' width='400' height='300'/%3E%3Ctext fill='%234a7c2a' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3ETree Image%3C/text%3E%3C/svg%3E";

const toImageSrc = (path) => {
  if (!path) return null;
  if (typeof path !== "string") return null;
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : "/" + path;
};

const shopStyles = `
  .shop-modern {
    --shop-bg: #f3f7f3;
    --shop-card: #ffffff;
    --shop-text: #1f3a14;
    --shop-muted: #6f8667;
    --shop-border: #d8e6d2;
    --shop-brand: #2f7d57;
    --shop-brand-dark: #245f43;
    --shop-brand-soft: #e8f5ee;
    background: radial-gradient(1200px 500px at 10% -10%, rgba(74,124,42,0.15), transparent 60%), var(--shop-bg);
  }
  .shop-header {
    border: 1px solid #3f7a34;
    border-radius: 18px;
    padding: 26px 24px;
    color: #fff;
    background: linear-gradient(135deg, #1f4f18 0%, #2d6f27 45%, #2f7d57 100%);
    box-shadow: 0 16px 34px rgba(31, 79, 24, 0.32);
  }
  .shop-header-title {
    margin: 0;
    font-weight: 900;
    font-size: 28px;
    letter-spacing: .2px;
  }
  .shop-header-subtitle {
    margin: 8px 0 0;
    opacity: .92;
    font-size: 14px;
  }
  .shop-header-badge {
    border: 1px solid rgba(255,255,255,.45);
    border-radius: 999px;
    background: rgba(255,255,255,.18);
    font-size: 12px;
    font-weight: 800;
    padding: 6px 12px;
    backdrop-filter: blur(3px);
  }
  .shop-filter-card {
    border: 1px solid var(--shop-border) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 22px rgba(45, 80, 22, 0.08) !important;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
  }
  .search-input, .sort-select {
    border-radius: 12px !important;
    border: 1px solid var(--shop-border) !important;
    height: 44px !important;
    font-size: 14px !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
  }
  .search-input { padding-left: 38px !important; }
  .search-input:focus, .sort-select:focus {
    border-color: var(--shop-brand) !important;
    box-shadow: 0 0 0 3px rgba(47, 125, 87, 0.16) !important;
  }
  .shop-count-badge {
    background: linear-gradient(135deg, #2f7d57 0%, #245f43 100%) !important;
    border-radius: 999px !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    padding: 8px 14px !important;
    box-shadow: 0 8px 16px rgba(36,95,67,.25);
  }
  .tree-card-modern {
    border-radius: 16px !important;
    border: 1px solid #dce9d6 !important;
    box-shadow: 0 8px 20px rgba(45, 80, 22, 0.08) !important;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform .2s ease, box-shadow .25s ease;
  }
  .tree-card-modern:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(45, 80, 22, 0.18) !important;
  }
  .tree-card-img {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #eaf3e8;
    flex: 0 0 auto;
  }
  .tree-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .35s ease;
  }
  .tree-card-modern:hover .tree-card-img img {
    transform: scale(1.06);
  }
  .tree-species-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    background: rgba(31, 58, 20, 0.82);
    border: 1px solid rgba(255,255,255,.28);
  }
  .tree-low-stock-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    background: rgba(201, 125, 96, 0.92);
  }
  .tree-out-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,.48);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 1px;
  }
  .tree-card-body {
    padding: 15px 16px !important;
    flex: 1 1 auto;
  }
  .tree-card-name {
    margin: 0;
    font-size: 16px;
    font-weight: 900;
    color: var(--shop-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .tree-card-desc {
    margin: 6px 0 10px;
    font-size: 13px;
    color: var(--shop-muted);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .tree-card-price {
    font-size: 22px;
    font-weight: 900;
    color: #245f43;
  }
  .tree-card-price-unit {
    font-size: 13px;
    color: #78956f;
    margin-left: 4px;
  }
  .tree-card-stock {
    margin: 4px 0 12px;
    font-size: 12px;
    font-weight: 700;
  }
  .tree-card-btn {
    border-radius: 10px !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    padding: 8px 8px !important;
  }
  .tree-card-btn-primary {
    background: linear-gradient(135deg, #2f7d57 0%, #245f43 100%) !important;
    border-color: #245f43 !important;
    color: #fff !important;
  }
  .tree-card-btn-secondary {
    border-color: #2f7d57 !important;
    color: #2f7d57 !important;
    background: #fff !important;
  }
  .shop-empty {
    border: 1px dashed #c6dbc1 !important;
    border-radius: 16px !important;
    box-shadow: none !important;
    background: #fbfefb;
  }
  .shop-pagination-btn, .shop-pagination-num {
    border-radius: 10px !important;
    border-color: #2f7d57 !important;
    color: #2f7d57 !important;
    font-weight: 700 !important;
  }
  .shop-pagination-num.active {
    background: #2f7d57 !important;
    color: #fff !important;
  }
  .modal-dialog.shop-cart-modal-up {
    margin-top: 42px !important;
    margin-bottom: 16px !important;
  }
  @media (max-width: 576px) {
    .shop-container { padding: 12px !important; }
    .shop-header { padding: 18px 14px; border-radius: 14px; }
    .shop-header-title { font-size: 21px; }
    .shop-header-subtitle { font-size: 12px; }
    .tree-card-img { aspect-ratio: 1 / 0.86; }
    .tree-card-body { padding: 12px !important; }
    .tree-card-name {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tree-card-price { font-size: 18px; }
    .tree-card-btn { font-size: 12px !important; padding: 7px 6px !important; }
    .tree-card-actions {
      flex-direction: column;
      gap: 7px !important;
    }
    .modal-dialog.shop-cart-modal-up {
      margin-top: 24px !important;
      margin-bottom: 12px !important;
      margin-left: 12px;
      margin-right: 12px;
    }
  }
  @media (min-width: 577px) and (max-width: 991px) {
    .tree-card-body { padding: 13px !important; }
    .tree-card-btn { font-size: 12px !important; padding: 7px 6px !important; }
  }
`;

const ShopPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { tableTree, loading } = useSelector((state) => state.treeSlice);
  const data = tableTree.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [cartTarget, setCartTarget] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(1);
  const itemsPerPage = 12;
  const userInfo = userInfoStorage.get() || {};
  const isLoggedIn = Boolean(userInfo.token);

  useEffect(() => {
    dispatch(onGetAllTree());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // กรองข้อมูลเฉพาะ active
  const filteredData = data
    .filter(
      (item) =>
        (item.status || "active").toLowerCase() !== "inactive" &&
        (item.name?.toLowerCase().includes(searchTerm) ||
          item.species?.toLowerCase().includes(searchTerm))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return (a.sell_price || 0) - (b.sell_price || 0);
        case "price_high":
          return (b.sell_price || 0) - (a.sell_price || 0);
        case "name":
        default:
          return (a.name || "").localeCompare(b.name || "", "th");
      }
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = (id) => {
    history.push(`/admin/tree-detail/${id}`);
  };

  const handleOpenAddToCart = (item) => {
    if (!isLoggedIn) {
      alert.custom.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบก่อนซื้อ",
        text: "คุณสามารถดูรายการต้นไม้ได้ แต่ต้องเข้าสู่ระบบก่อนใส่ตะกร้า",
        showCancelButton: true,
        confirmButtonText: "เข้าสู่ระบบ",
        cancelButtonText: "ปิด",
        confirmButtonColor: "#4a7c2a",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/admin/login");
        }
      });
      return;
    }

    setCartTarget(item);
    setCartQuantity(1);
  };

  const handleCloseAddToCart = () => {
    setCartTarget(null);
    setCartQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const stock = Number(cartTarget?.quantity ?? cartTarget?.amount ?? 1);
    const nextQuantity = Number(e.target.value);
    if (Number.isNaN(nextQuantity)) {
      setCartQuantity(1);
      return;
    }
    setCartQuantity(Math.max(1, Math.min(nextQuantity, stock)));
  };

  const handleAddToCart = () => {
    if (!cartTarget) return;

    const quantity = Number(cartQuantity);
    dispatch(onAddToCartAPI({ tree_id: cartTarget.id, quantity })).then(
      (response) => {
        if (response?.payload && !response.error) {
          dispatch(addToCart({ tree: cartTarget, quantity }));
          alert.custom.fire({
            icon: "success",
            title: "เพิ่มลงตะกร้าเรียบร้อย",
            text: `${cartTarget.name} จำนวน ${quantity} ต้น`,
            timer: 1500,
            showConfirmButton: false,
          });
          handleCloseAddToCart();
        } else {
          alert.custom.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: response?.payload || "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้",
            confirmButtonText: "ตกลง",
          });
        }
      }
    );
  };

  const getImageUrl = (item) => {
    return (
      toImageSrc(item.image_url) ||
      toImageSrc(item.imageUrl) ||
      toImageSrc(item.image) ||
      null
    );
  };

  return (
    <>
      {/* inject responsive CSS */}
      <style>{shopStyles}</style>

      <Container
        fluid
        className="shop-container shop-modern"
        style={{ padding: "16px" }}
      >
        {/* Header */}
        <div className="shop-header mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 10 }}>
            <div>
              <div className="d-flex align-items-center mb-1">
                <Leaf
                  className="leaf-icon"
                  size={28}
                  style={{ marginRight: "10px", flexShrink: 0 }}
                />
                <h2 className="shop-header-title">ร้านต้นไม้</h2>
              </div>
              <p className="shop-header-subtitle">
                เลือกซื้อต้นไม้คุณภาพดี หลากหลายสายพันธุ์
              </p>
            </div>
            <div className="shop-header-badge">
              {loading ? "กำลังโหลด..." : `${filteredData.length.toLocaleString()} ต้นไม้พร้อมขาย`}
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <Card className="shop-filter-card mb-3">
          <Card.Body style={{ padding: "14px 16px" }}>
            <Row className="align-items-center g-2">
              {/* Search */}
              <Col xs={12} sm={12} md={5} lg={5}>
                <div style={{ position: "relative" }}>
                  <Search
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#999",
                      zIndex: 10,
                    }}
                  />
                  <Form.Control
                    type="text"
                    className="search-input"
                    placeholder="ค้นหาต้นไม้..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </Col>

              {/* Sort */}
              <Col xs={7} sm={7} md={4} lg={3}>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "6px" }}
                >
                  <SlidersHorizontal
                    size={16}
                    color="#5a7c3a"
                    style={{ flexShrink: 0 }}
                  />
                  <Form.Select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">เรียงตามชื่อ</option>
                    <option value="price_low">ราคา: น้อย → มาก</option>
                    <option value="price_high">ราคา: มาก → น้อย</option>
                  </Form.Select>
                </div>
              </Col>

              {/* Count badge */}
              <Col xs={5} sm={5} md={3} lg={4} className="text-end">
                <Badge bg="success" className="shop-count-badge">
                  <Sprout
                    size={13}
                    style={{ marginRight: "5px", verticalAlign: "middle" }}
                  />
                  {loading ? "โหลด..." : `${filteredData.length} รายการ`}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tree Cards */}
        {paginatedData.length > 0 ? (
          <Row className="g-3">
            {paginatedData.map((item) => {
              const imageUrl = getImageUrl(item);
              const price = Number(item.sell_price ?? 0);
              const stock = Number(item.quantity ?? item.amount ?? 0);

              return (
                <Col key={item.id} xs={6} sm={6} md={6} lg={4} xl={3}>
                  <Card className="tree-card-modern">
                    {/* Image */}
                    <div
                      className="tree-card-img"
                      style={{
                        width: "100%",
                        backgroundColor: "#f0f5ee",
                        overflow: "hidden",
                        position: "relative",
                      }}
                      onClick={() => handleViewDetail(item.id)}
                    >
                      <img
                        src={imageUrl || PLACEHOLDER_IMAGE}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.3s ease",
                        }}
                        onError={(e) => {
                          if (e.target.src !== PLACEHOLDER_IMAGE) {
                            e.target.src = PLACEHOLDER_IMAGE;
                          }
                        }}
                      />
                      {/* Species Badge */}
                      {item.species && (
                        <Badge className="tree-species-badge">
                          {item.species}
                        </Badge>
                      )}
                      {/* Stock Badge */}
                      {stock <= 5 && stock > 0 && (
                        <Badge className="tree-low-stock-badge">
                          เหลือ {stock} ต้น
                        </Badge>
                      )}
                      {stock === 0 && (
                        <div className="tree-out-overlay">สินค้าหมด</div>
                      )}
                    </div>

                    {/* Card Body */}
                    <Card.Body
                      className="tree-card-body d-flex flex-column"
                      style={{ padding: "14px 16px" }}
                    >
                      {/* Name */}
                      <h5
                        className="tree-card-name"
                        style={{
                          fontWeight: "650",
                          color: "#2d5016",
                          fontSize: "15px",
                          marginBottom: "4px",
                          lineHeight: "1.4",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={() => handleViewDetail(item.id)}
                        title={item.name}
                      >
                        {item.name}
                      </h5>

                      {/* Description snippet */}
                      {item.description && (
                        <p
                          className="tree-card-desc"
                          style={{
                            fontSize: "13px",
                            color: "#7a9471",
                            margin: "0 0 10px 0",
                            lineHeight: "1.5",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.description}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mt-auto" style={{ marginBottom: "8px" }}>
                        <span
                          className="tree-card-price"
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#2d5016",
                          }}
                        >
                          {price.toLocaleString()} ฿
                        </span>
                        <span
                          className="tree-card-price-unit"
                          style={{
                            fontSize: "13px",
                            color: "#7a9471",
                            marginLeft: "4px",
                          }}
                        >
                          / ต้น
                        </span>
                      </div>

                      {/* Stock info */}
                      <div
                        className="tree-card-stock"
                        style={{
                          fontSize: "12px",
                          color: stock > 0 ? "#5a7c3a" : "#c97d60",
                          marginBottom: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {stock > 0 ? `คงเหลือ ${stock} ต้น` : "สินค้าหมด"}
                      </div>

                      {/* Action Buttons */}
                      <div className="tree-card-actions d-flex" style={{ gap: "8px" }}>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="tree-card-btn tree-card-btn-secondary"
                          onClick={() => handleViewDetail(item.id)}
                          style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Eye
                            size={14}
                            style={{
                              marginRight: "4px",
                              verticalAlign: "middle",
                            }}
                          />
                          ดูรายละเอียด
                        </Button>
                        <Button
                          size="sm"
                          className="tree-card-btn tree-card-btn-primary"
                          onClick={() => handleOpenAddToCart(item)}
                          disabled={stock === 0}
                          style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            opacity: stock === 0 ? 0.5 : 1,
                          }}
                        >
                          <ShoppingCart
                            size={14}
                            style={{
                              marginRight: "4px",
                              verticalAlign: "middle",
                            }}
                          />
                          {isLoggedIn ? "ใส่ตะกร้า" : "เข้าสู่ระบบเพื่อซื้อ"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Card className="shop-empty">
            <Card.Body
              style={{
                padding: "50px 20px",
                textAlign: "center",
                color: "#999",
              }}
            >
              <Sprout
                size={56}
                style={{ marginBottom: "14px", opacity: 0.3, color: "#4a7c2a" }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#7a9471",
                }}
              >
                {loading ? "กำลังโหลดข้อมูล..." : "ไม่พบต้นไม้ที่ค้นหา"}
              </p>
            </Card.Body>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="d-flex justify-content-center align-items-center mt-3 flex-wrap"
            style={{ gap: "6px" }}
          >
            <Button
              className="shop-pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              variant="outline-success"
              size="sm"
              style={{
                padding: "7px 16px",
                fontSize: "14px",
              }}
            >
              ก่อนหน้า
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  className={`shop-pagination-num ${page === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                  variant={
                    page === currentPage ? "success" : "outline-success"
                  }
                  size="sm"
                  style={{
                    minWidth: "36px",
                    height: "36px",
                    fontSize: "14px",
                  }}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              className="shop-pagination-btn"
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline-success"
              size="sm"
              style={{
                padding: "7px 16px",
                fontSize: "14px",
              }}
            >
              ถัดไป
            </Button>
          </div>
        )}

        <Modal
          show={!!cartTarget}
          onHide={handleCloseAddToCart}
          dialogClassName="shop-cart-modal-up"
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#2d5016", fontWeight: 800 }}>
              เลือกจำนวนต้นไม้
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cartTarget ? (
              <>
                <div className="d-flex align-items-center mb-3" style={{ gap: 12 }}>
                  <img
                    src={getImageUrl(cartTarget) || PLACEHOLDER_IMAGE}
                    alt={cartTarget.name}
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #d8e6d2",
                    }}
                    onError={(e) => {
                      if (e.target.src !== PLACEHOLDER_IMAGE) {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }
                    }}
                  />
                  <div>
                    <div style={{ color: "#2d5016", fontWeight: 800 }}>
                      {cartTarget.name}
                    </div>
                    <div style={{ color: "#6f8667", fontSize: 13 }}>
                      {Number(cartTarget.sell_price ?? 0).toLocaleString()} บาท / ต้น
                    </div>
                    <div style={{ color: "#6f8667", fontSize: 13 }}>
                      คงเหลือ {Number(cartTarget.quantity ?? cartTarget.amount ?? 0)} ต้น
                    </div>
                  </div>
                </div>

                <Form.Group>
                  <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                    จำนวนที่ต้องการ
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={Number(cartTarget.quantity ?? cartTarget.amount ?? 1)}
                    value={cartQuantity}
                    onChange={handleQuantityChange}
                    style={{
                      borderRadius: 10,
                      borderColor: "#d8e6d2",
                      height: 44,
                      fontWeight: 700,
                    }}
                  />
                </Form.Group>

                <div
                  className="mt-3"
                  style={{
                    background: "#f3f7f3",
                    border: "1px solid #d8e6d2",
                    borderRadius: 8,
                    color: "#2d5016",
                    fontWeight: 800,
                    padding: "10px 12px",
                  }}
                >
                  รวม {(
                    Number(cartTarget.sell_price ?? 0) * Number(cartQuantity || 0)
                  ).toLocaleString()} บาท
                </div>
              </>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={handleCloseAddToCart}>
              ยกเลิก
            </Button>
            <Button
              className="tree-card-btn-primary"
              onClick={handleAddToCart}
              disabled={!cartTarget || Number(cartQuantity) < 1}
            >
              <ShoppingCart size={16} style={{ marginRight: 6 }} />
              ยืนยันใส่ตะกร้า
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ShopPage;
