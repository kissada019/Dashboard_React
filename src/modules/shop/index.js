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

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e8f5e3' width='400' height='300'/%3E%3Ctext fill='%234a7c2a' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3ETree Image%3C/text%3E%3C/svg%3E";

const toImageSrc = (path) => {
  if (!path) return null;
  if (typeof path !== "string") return null;
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : "/" + path;
};

/* ---------- inline responsive CSS ---------- */
const mobileStyles = `
  @media (max-width: 576px) {
    .shop-header { padding: 20px 16px !important; border-radius: 12px !important; }
    .shop-header h2 { font-size: 20px !important; }
    .shop-header p  { font-size: 13px !important; }
    .shop-header .leaf-icon { width: 24px; height: 24px; }

    .shop-filter-card .card-body { padding: 12px !important; }
    .shop-filter-card .search-input { height: 40px !important; font-size: 13px !important; }
    .shop-filter-card .sort-select  { height: 40px !important; font-size: 13px !important; }

    .shop-container { padding: 12px !important; }

    .tree-card-img { height: 180px !important; }
    .tree-card-body { padding: 12px 14px !important; }
    .tree-card-name { font-size: 15px !important; }
    .tree-card-desc { font-size: 12px !important; }
    .tree-card-price { font-size: 18px !important; }
    .tree-card-price-unit { font-size: 12px !important; }
    .tree-card-stock { font-size: 12px !important; margin-bottom: 10px !important; }
    .tree-card-btn { font-size: 12px !important; padding: 7px 6px !important; }
    .tree-card-btn svg { width: 13px; height: 13px; }

    .shop-pagination-btn { padding: 6px 12px !important; font-size: 13px !important; }
    .shop-pagination-num { min-width: 32px !important; height: 32px !important; font-size: 13px !important; }
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
  const itemsPerPage = 12;

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

  const handleAddToCart = (item) => {
    dispatch(onAddToCartAPI({ tree_id: item.id, quantity: 1 })).then(
      (response) => {
        if (response?.payload && !response.error) {
          dispatch(addToCart({ tree: item, quantity: 1 }));
          alert.custom.fire({
            icon: "success",
            title: "เพิ่มลงตะกร้าเรียบร้อย",
            text: `${item.name} จำนวน 1 ต้น`,
            timer: 1500,
            showConfirmButton: false,
          });
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
      <style>{mobileStyles}</style>

      <Container
        fluid
        className="shop-container"
        style={{ padding: "16px", backgroundColor: "#f8f9f6" }}
      >
        {/* Header */}
        <div
          className="shop-header mb-3"
          style={{
            background: "linear-gradient(135deg, #2d5016 0%, #4a7c2a 100%)",
            borderRadius: "16px",
            padding: "28px 24px",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(45, 80, 22, 0.3)",
          }}
        >
          <div className="d-flex align-items-center mb-1">
            <Leaf
              className="leaf-icon"
              size={28}
              style={{ marginRight: "10px", flexShrink: 0 }}
            />
            <h2 style={{ margin: 0, fontWeight: "700", fontSize: "24px" }}>
              ร้านต้นไม้
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              opacity: 0.85,
              fontSize: "14px",
              marginTop: "6px",
            }}
          >
            เลือกซื้อต้นไม้คุณภาพดี หลากหลายสายพันธุ์
          </p>
        </div>

        {/* Search & Filter */}
        <Card
          className="shop-filter-card mb-3"
          style={{
            border: "none",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
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
                    style={{
                      paddingLeft: "36px",
                      borderRadius: "10px",
                      border: "2px solid #d4e6d1",
                      fontSize: "14px",
                      height: "42px",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4a7c2a")}
                    onBlur={(e) => (e.target.style.borderColor = "#d4e6d1")}
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
                    style={{
                      borderRadius: "10px",
                      border: "2px solid #d4e6d1",
                      fontSize: "14px",
                      height: "42px",
                    }}
                  >
                    <option value="name">เรียงตามชื่อ</option>
                    <option value="price_low">ราคา: น้อย → มาก</option>
                    <option value="price_high">ราคา: มาก → น้อย</option>
                  </Form.Select>
                </div>
              </Col>

              {/* Count badge */}
              <Col xs={5} sm={5} md={3} lg={4} className="text-end">
                <Badge
                  bg="success"
                  style={{
                    padding: "6px 14px",
                    fontSize: "13px",
                    borderRadius: "20px",
                    backgroundColor: "#4a7c2a",
                  }}
                >
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
                <Col key={item.id} xs={12} sm={6} md={6} lg={4} xl={3}>
                  <Card
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #e4ede0",
                      boxShadow: "0 2px 10px rgba(45, 80, 22, 0.06)",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 28px rgba(45, 80, 22, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 10px rgba(45, 80, 22, 0.06)";
                    }}
                  >
                    {/* Image */}
                    <div
                      className="tree-card-img"
                      style={{
                        width: "100%",
                        height: "200px",
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
                        <Badge
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            fontSize: "11px",
                            padding: "4px 10px",
                            borderRadius: "14px",
                            backgroundColor: "rgba(45, 80, 22, 0.85)",
                            color: "#fff",
                            fontWeight: "500",
                          }}
                        >
                          {item.species}
                        </Badge>
                      )}
                      {/* Stock Badge */}
                      {stock <= 5 && stock > 0 && (
                        <Badge
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            fontSize: "11px",
                            padding: "4px 10px",
                            borderRadius: "14px",
                            backgroundColor: "rgba(201, 125, 96, 0.9)",
                            color: "#fff",
                            fontWeight: "500",
                          }}
                        >
                          เหลือ {stock} ต้น
                        </Badge>
                      )}
                      {stock === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.45)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#fff",
                              fontSize: "16px",
                              fontWeight: "700",
                              letterSpacing: "2px",
                            }}
                          >
                            สินค้าหมด
                          </span>
                        </div>
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
                          whiteSpace: "nowrap",
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
                      <div className="d-flex" style={{ gap: "8px" }}>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="tree-card-btn"
                          onClick={() => handleViewDetail(item.id)}
                          style={{
                            flex: 1,
                            borderRadius: "8px",
                            borderColor: "#4a7c2a",
                            color: "#4a7c2a",
                            fontWeight: "500",
                            fontSize: "13px",
                            padding: "8px 8px",
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
                          className="tree-card-btn"
                          onClick={() => handleAddToCart(item)}
                          disabled={stock === 0}
                          style={{
                            flex: 1,
                            borderRadius: "8px",
                            backgroundColor: "#4a7c2a",
                            borderColor: "#4a7c2a",
                            color: "#fff",
                            fontWeight: "500",
                            fontSize: "13px",
                            padding: "8px 8px",
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
                          ใส่ตะกร้า
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Card
            style={{
              border: "none",
              borderRadius: "14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
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
                borderRadius: "8px",
                padding: "7px 16px",
                borderColor: "#4a7c2a",
                color: "#4a7c2a",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              ก่อนหน้า
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  className="shop-pagination-num"
                  onClick={() => setCurrentPage(page)}
                  variant={
                    page === currentPage ? "success" : "outline-success"
                  }
                  size="sm"
                  style={{
                    borderRadius: "8px",
                    minWidth: "36px",
                    height: "36px",
                    fontWeight: "600",
                    fontSize: "14px",
                    backgroundColor:
                      page === currentPage ? "#4a7c2a" : "transparent",
                    borderColor: "#4a7c2a",
                    color: page === currentPage ? "#fff" : "#4a7c2a",
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
                borderRadius: "8px",
                padding: "7px 16px",
                borderColor: "#4a7c2a",
                color: "#4a7c2a",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              ถัดไป
            </Button>
          </div>
        )}
      </Container>
    </>
  );
};

export default ShopPage;
