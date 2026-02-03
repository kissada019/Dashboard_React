import React, { useState, useEffect } from "react";
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
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  Package,
  Leaf,
  Droplets,
  Sun,
  Ruler,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { addToCart } from "../../redux/slices/cartSlice";
import { onGetTreeById } from "../../redux/slices/treeSlice";
import alert from "../../utils/alert";

const TreeDetailShopee = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { tableTree, loading } = useSelector((state) => state.treeSlice);
  const treeData = tableTree.detail;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantityTree, setQuantityTree] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(onGetTreeById(id));
    }
  }, [id]);

  if (loading || !treeData?.id) {
    return (
      <Container fluid className="p-4">
        <div className="text-center">กำลังโหลด...</div>
      </Container>
    );
  }

  // รองรับ image_url / imageUrl (เช่น "/uploads/1770029640076-975375148.jpg") และ images (array)
  // ใช้ path สัมพัทธ์ (/uploads/...) เพื่อให้รูปโหลดผ่าน proxy (หลีกเลี่ยง CORS/CORP)
  const toImageSrc = (path) => {
    if (!path) return null;
    if (typeof path !== "string") return path;
    if (path.startsWith("http")) return path;
    return path.startsWith("/") ? path : "/" + path;
  };
  const images = [];
  const singleImage = treeData.image_url || treeData.imageUrl || treeData.image;
  if (singleImage) {
    images.push(toImageSrc(singleImage));
  }
  if (Array.isArray(treeData.images) && treeData.images.length) {
    treeData.images.forEach((img) => {
      const url = toImageSrc(img) || img;
      if (url) images.push(url);
    });
  }
  const mainImageUrl = images[selectedImageIndex] || images[0] || null;
  // ใช้ data URI เป็น placeholder เพื่อไม่พึ่ง external (via.placeholder.com อาจโหลดไม่ได้)
  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect fill='%23e8f5e3' width='500' height='500'/%3E%3Ctext fill='%234a7c2a' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20'%3ETree Image%3C/text%3E%3C/svg%3E";

  const priceNew = Number(treeData.sell_price ?? 0);
  const priceOld = Number(treeData.sell_price ?? 0);
  // จำนวนคงเหลือ (stock) - รองรับทั้ง quantity และ amount จาก API
  const stockMax = Number(treeData.quantity ?? treeData.amount ?? 0);
  const quantity = stockMax; // ใช้แสดง "คงเหลือ X ต้น"
  const rating = Number(treeData.rating ?? 0);
  const reviews = Number(treeData.reviews ?? 0);
  const sold = Number(treeData.sold ?? 0);
  const totalPrice = priceNew * quantityTree; // ราคารวมตามจำนวนที่เลือก

  const handleAddToCart = () => {
    dispatch(addToCart({ tree: treeData, quantity: quantityTree }));
    alert.custom
      .fire({
        icon: "success",
        title: "เพิ่มลงตะกร้าเรียบร้อย",
        text: `${treeData.name} จำนวน ${quantityTree} ต้น`,
        confirmButtonText: "ตกลง",
        showCancelButton: true,
        cancelButtonText: "ปิด",
        confirmButtonText: "ไปที่ตะกร้า",
      })
      .then((result) => {
        if (result.isConfirmed) {
          history.push("/admin/cart");
        }
      });
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ tree: treeData, quantity: quantityTree }));
    history.push("/admin/checkout");
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    alert.custom.fire({
      icon: isFavorite ? "info" : "success",
      title: isFavorite ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f8f9f6", minHeight: "100vh" }}
    >
      {/* Back Button */}
      <Button
        variant="light"
        onClick={() => history.goBack()}
        className="mb-4"
        style={{
          borderRadius: "8px",
          padding: "8px 16px",
          border: "1px solid #d4e6d1",
          backgroundColor: "#fff",
          color: "#2d5016",
        }}
      >
        <ArrowLeft
          size={18}
          style={{ marginRight: "8px", verticalAlign: "middle" }}
        />
        กลับ
      </Button>

      <Row>
        {/* Left Column - Images */}
        <Col lg={6} md={6} className="mb-4">
          <Card
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #d4e6d1",
              boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)",
            }}
          >
            <Card.Body className="p-0">
              {/* Main Image */}
              <div
                style={{
                  width: "100%",
                  height: "500px",
                  backgroundColor: "#f0f5ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={mainImageUrl || PLACEHOLDER_IMAGE}
                  alt={treeData.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    if (e.target.src !== PLACEHOLDER_IMAGE) {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }
                  }}
                />
                {/* Natural Badge */}
                <Badge
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    fontSize: "14px",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    backgroundColor: "#2d5016",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                >
                  <Leaf
                    size={14}
                    style={{ marginRight: "6px", verticalAlign: "middle" }}
                  />
                  พันธุ์ไม้คุณภาพ
                </Badge>
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="p-3" style={{ backgroundColor: "#fff" }}>
                  <div className="d-flex gap-2" style={{ overflowX: "auto" }}>
                    {images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        style={{
                          minWidth: "80px",
                          height: "80px",
                          border:
                            selectedImageIndex === index
                              ? "3px solid #4a7c2a"
                              : "2px solid #d4e6d1",
                          borderRadius: "10px",
                          overflow: "hidden",
                          cursor: "pointer",
                          backgroundColor: "#f0f5ee",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedImageIndex !== index) {
                            e.currentTarget.style.borderColor = "#4a7c2a";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedImageIndex !== index) {
                            e.currentTarget.style.borderColor = "#d4e6d1";
                          }
                        }}
                      >
                        <img
                          src={img}
                          alt={`${treeData.name} ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=Tree";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Product Info */}
        <Col lg={6} md={6}>
          <Card
            style={{
              borderRadius: "16px",
              border: "1px solid #d4e6d1",
              boxShadow: "0 4px 12px rgba(45, 80, 22, 0.08)",
            }}
          >
            <Card.Body className="p-4">
              {/* Product Name */}
              <div className="d-flex align-items-center mb-3">
                <Leaf
                  size={24}
                  color="#4a7c2a"
                  style={{ marginRight: "10px" }}
                />
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    margin: 0,
                    color: "#2d5016",
                  }}
                >
                  {treeData.name}
                </h2>
              </div>

              {/* Species Badge */}
              <Badge
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  marginBottom: "20px",
                  backgroundColor: "#e8f5e3",
                  color: "#2d5016",
                  fontWeight: "500",
                }}
              >
                {treeData.species}
              </Badge>

              {/* Rating & Reviews */}
              <div
                className="d-flex align-items-center mb-4"
                style={{ gap: "15px", flexWrap: "wrap" }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                      color="#fbbf24"
                    />
                  ))}
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2d5016",
                    }}
                  >
                    {rating}
                  </span>
                </div>
                <span style={{ color: "#5a7c3a", fontSize: "14px" }}>
                  ({reviews} รีวิว)
                </span>
                <span style={{ color: "#5a7c3a", fontSize: "14px" }}>
                  | ขายแล้ว {sold} ต้น
                </span>
              </div>

              {/* Price Section */}
              <div
                className="mb-4"
                style={{
                  padding: "24px",
                  backgroundColor: "#e8f5e3",
                  borderRadius: "12px",
                  border: "1px solid #d4e6d1",
                }}
              >
                <div
                  className="d-flex align-items-baseline"
                  style={{ gap: "15px", marginBottom: "12px" }}
                >
                  <span
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      color: "#2d5016",
                    }}
                  >
                    {priceNew.toLocaleString()} ฿
                  </span>
                  {priceOld > priceNew && (
                    <span
                      style={{
                        fontSize: "20px",
                        color: "#7a9471",
                        textDecoration: "line-through",
                      }}
                    >
                      {priceOld.toLocaleString()} ฿
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#4a7c2a",
                    fontWeight: "500",
                  }}
                >
                  ราคาต่อต้น
                </div>
              </div>

              {/* Stock & Location */}
              <div
                className="mb-4"
                style={{
                  padding: "16px",
                  backgroundColor: "#f8f9f6",
                  borderRadius: "10px",
                }}
              >
                <Row>
                  <Col xs={6}>
                    <div style={{ marginBottom: "10px" }}>
                      <span
                        style={{
                          color: "#5a7c3a",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        คงเหลือ:{" "}
                      </span>
                      <Badge
                        style={{
                          fontSize: "14px",
                          padding: "6px 12px",
                          backgroundColor:
                            quantity > 10
                              ? "#4a7c2a"
                              : quantity > 5
                              ? "#8b9a5b"
                              : "#c97d60",
                          color: "#fff",
                        }}
                      >
                        {quantity} ต้น
                      </Badge>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <span
                        style={{
                          color: "#5a7c3a",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        สถานที่:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#2d5016",
                        }}
                      >
                        {treeData.location}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    marginBottom: "10px",
                    display: "block",
                    color: "#2d5016",
                  }}
                >
                  จำนวนที่ต้องการ:
                </label>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "10px" }}
                >
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      setQuantityTree(Math.max(1, quantityTree - 1))
                    }
                    style={{
                      borderRadius: "8px",
                      width: "42px",
                      height: "42px",
                      borderColor: "#d4e6d1",
                      color: "#2d5016",
                    }}
                    aria-label="ลดจำนวน"
                  >
                    −
                  </Button>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    value={quantityTree}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      const max = stockMax || 9999;
                      const val =
                        raw === ""
                          ? 1
                          : Math.max(1, Math.min(parseInt(raw, 10) || 1, max));
                      setQuantityTree(val);
                    }}
                    style={{
                      width: "90px",
                      textAlign: "center",
                      borderRadius: "8px",
                      borderColor: "#d4e6d1",
                      fontWeight: "500",
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      setQuantityTree(
                        Math.min(stockMax || 9999, quantityTree + 1)
                      )
                    }
                    disabled={quantityTree >= (stockMax || 9999)}
                    style={{
                      borderRadius: "8px",
                      width: "42px",
                      height: "42px",
                      borderColor: "#d4e6d1",
                      color: "#2d5016",
                    }}
                    aria-label={
                      quantityTree >= (stockMax || 9999)
                        ? "ถึงจำนวนสูงสุดแล้ว"
                        : "เพิ่มจำนวน"
                    }
                  >
                    +
                  </Button>

                  <div
                    style={{
                      marginLeft: "15px",
                      padding: "10px 16px",
                      backgroundColor: "#e8f5e3",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ color: "#5a7c3a", fontSize: "14px" }}>
                      รวม:{" "}
                    </span>
                    <strong style={{ color: "#2d5016", fontSize: "18px" }}>
                      {totalPrice.toLocaleString()} ฿
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex mb-4" style={{ gap: "12px" }}>
                <Button
                  variant="outline-success"
                  size="lg"
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    borderRadius: "10px",
                    padding: "10px 10px",
                    fontWeight: "600",
                    borderWidth: "2px",
                    borderColor: "#4a7c2a",
                    color: "#4a7c2a",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <ShoppingCart
                    size={18}
                    style={{ marginRight: "6px", verticalAlign: "middle" }}
                  />
                  เพิ่มลงตะกร้า
                </Button>
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  style={{
                    flex: 1,
                    borderRadius: "10px",
                    padding: "10px 10px",
                    fontWeight: "600",
                    backgroundColor: "#4a7c2a",
                    borderColor: "#4a7c2a",
                    color: "#fff",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  สั่งซื้อทันที
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={handleFavorite}
                  style={{
                    borderRadius: "10px",
                    padding: "10px 10px",
                    width: "60px",
                    color: isFavorite ? "#c97d60" : "#5a7c3a",
                    borderColor: isFavorite ? "#c97d60" : "#d4e6d1",
                    backgroundColor: isFavorite ? "#fff5f0" : "#fff",
                  }}
                >
                  <Heart size={20} fill={isFavorite ? "#c97d60" : "none"} />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  style={{
                    borderRadius: "10px",
                    padding: "10px 10px",
                    width: "60px",
                    borderColor: "#d4e6d1",
                    color: "#5a7c3a",
                  }}
                >
                  <Share2 size={20} />
                </Button>
              </div>

              {/* Shipping Info */}
              <Card
                style={{
                  backgroundColor: "#f0f5ee",
                  border: "1px solid #d4e6d1",
                  borderRadius: "12px",
                }}
              >
                <Card.Body className="p-3">
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ gap: "10px" }}
                  >
                    <Truck size={18} color="#4a7c2a" />
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#2d5016",
                        fontWeight: "500",
                      }}
                    >
                      {treeData.shipping}
                    </span>
                  </div>
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ gap: "10px" }}
                  >
                    <Shield size={18} color="#4a7c2a" />
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#2d5016",
                        fontWeight: "500",
                      }}
                    >
                      {treeData.warranty}
                    </span>
                  </div>
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "10px" }}
                  >
                    <CheckCircle size={18} color="#4a7c2a" />
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#2d5016",
                        fontWeight: "500",
                      }}
                    >
                      มีสินค้าพร้อมส่ง
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Product Details Section */}
      <Row className="mt-4">
        <Col lg={12}>
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
                padding: "24px",
              }}
            >
              <div className="d-flex align-items-center">
                <Leaf
                  size={24}
                  color="#2d5016"
                  style={{ marginRight: "10px" }}
                />
                <h4 style={{ margin: 0, fontWeight: "700", color: "#2d5016" }}>
                  รายละเอียดพันธุ์ไม้
                </h4>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <p
                style={{
                  fontSize: "17px",
                  lineHeight: "2",
                  color: "#2d5016",
                  marginBottom: "30px",
                  fontWeight: "400",
                }}
              >
                {treeData.description}
              </p>

              {/* Specifications Table */}
              <h5
                style={{
                  marginBottom: "20px",
                  fontWeight: "700",
                  color: "#2d5016",
                }}
                className="d-flex align-items-center"
              >
                <Ruler size={20} style={{ marginRight: "8px" }} />
                ข้อมูลจำเพาะ
              </h5>
              <Table
                bordered
                hover
                style={{ marginBottom: "30px", borderColor: "#d4e6d1" }}
              >
                <tbody>
                  {Object.entries(treeData.specifications || {}).map(
                    ([key, value], index) => (
                      <tr
                        key={key}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9f6",
                        }}
                      >
                        <td
                          style={{
                            width: "200px",
                            backgroundColor: "#e8f5e3",
                            fontWeight: "600",
                            padding: "14px",
                            color: "#2d5016",
                            borderColor: "#d4e6d1",
                          }}
                        >
                          {key}
                        </td>
                        <td
                          style={{
                            padding: "14px",
                            color: "#5a7c3a",
                            borderColor: "#d4e6d1",
                          }}
                        >
                          {value}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>

              {/* Care Information */}
              <div
                style={{
                  padding: "24px",
                  backgroundColor: "#f0f5ee",
                  borderRadius: "12px",
                  border: "1px solid #d4e6d1",
                  marginBottom: "20px",
                }}
              >
                <h6
                  style={{
                    marginBottom: "18px",
                    fontWeight: "700",
                    color: "#2d5016",
                  }}
                  className="d-flex align-items-center"
                >
                  <Sun size={18} style={{ marginRight: "8px" }} />
                  ข้อมูลการดูแล
                </h6>
                <Row>
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <Sun
                        size={16}
                        color="#4a7c2a"
                        style={{ marginRight: "10px" }}
                      />
                      <span style={{ color: "#5a7c3a", fontSize: "14px" }}>
                        แสงแดด: ครึ่งวัน - เต็มวัน
                      </span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <Droplets
                        size={16}
                        color="#4a7c2a"
                        style={{ marginRight: "10px" }}
                      />
                      <span style={{ color: "#5a7c3a", fontSize: "14px" }}>
                        น้ำ: รดน้ำวันละ 1-2 ครั้ง
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <Calendar
                        size={16}
                        color="#4a7c2a"
                        style={{ marginRight: "10px" }}
                      />
                      <span style={{ color: "#5a7c3a", fontSize: "14px" }}>
                        ฤดูปลูก: ตลอดปี
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <CheckCircle
                        size={16}
                        color="#4a7c2a"
                        style={{ marginRight: "10px" }}
                      />
                      <span style={{ color: "#5a7c3a", fontSize: "14px" }}>
                        ดูแลง่าย เหมาะสำหรับผู้เริ่มต้น
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Additional Info */}
              <div
                style={{
                  padding: "24px",
                  backgroundColor: "#e8f5e3",
                  borderRadius: "12px",
                  border: "1px solid #d4e6d1",
                }}
              >
                <h6
                  style={{
                    marginBottom: "15px",
                    fontWeight: "700",
                    color: "#2d5016",
                  }}
                >
                  ข้อมูลเพิ่มเติม
                </h6>
                <ul
                  style={{ margin: 0, paddingLeft: "20px", color: "#5a7c3a" }}
                >
                  <li style={{ marginBottom: "10px", fontSize: "15px" }}>
                    ต้นไม้พร้อมปลูก ดูแลง่าย
                  </li>
                  <li style={{ marginBottom: "10px", fontSize: "15px" }}>
                    รับประกันคุณภาพสินค้า
                  </li>
                  <li style={{ marginBottom: "10px", fontSize: "15px" }}>
                    จัดส่งทั่วประเทศ
                  </li>
                  <li style={{ fontSize: "15px" }}>มีคำแนะนำการปลูกและดูแล</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TreeDetailShopee;
