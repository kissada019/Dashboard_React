import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  CheckCircle,
  Clock,
  Eye,
  ImagePlus,
  PackageCheck,
  RefreshCw,
  Truck,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import service from "../../utils/service";
import alert from "../../utils/alert";
import userInfoStorage from "../../storage/userInfoStorage";
import { getUserRoles } from "../../utils/authRole";
import appConst from "../../shared/AppConst";

const STATUS_META = {
  pending_payment: {
    label: "รอชำระเงิน",
    variant: "warning",
    icon: Clock,
  },
  payment_review: {
    label: "รอตรวจสอบ",
    variant: "primary",
    icon: Eye,
  },
  ready_to_ship: {
    label: "รอจัดส่ง",
    variant: "info",
    icon: Truck,
  },
  completed: {
    label: "เสร็จสิ้น",
    variant: "success",
    icon: CheckCircle,
  },
  cancelled: {
    label: "ยกเลิก",
    variant: "secondary",
    icon: PackageCheck,
  },
};

const CHANNEL_LABELS = {
  in_store: "หน้าร้าน",
  online: "ออนไลน์",
};

const PAYMENT_LABELS = {
  cash: "เงินสด",
  transfer: "โอนเงิน",
  cod: "เก็บเงินปลายทาง",
  promptpay: "พร้อมเพย์",
};

const FULFILLMENT_LABELS = {
  pickup: "รับหน้าร้าน",
  delivery: "จัดส่งตามที่อยู่",
};

const STATUS_FLOW = [
  {
    key: "pending_payment",
    label: "รอชำระเงิน",
    icon: Clock,
  },
  {
    key: "payment_review",
    label: "รอตรวจสอบ",
    icon: Eye,
  },
  {
    key: "ready_to_ship",
    label: "รอจัดส่ง",
    icon: Truck,
  },
  {
    key: "completed",
    label: "เสร็จสิ้น",
    icon: CheckCircle,
  },
];

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatPickupDate = (value) => {
  if (!value) return "";
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("th-TH", {
    dateStyle: "medium",
  });
};

const formatPickupTime = (value) => {
  if (!value) return "";
  return String(value).slice(0, 5);
};

const formatPickupSchedule = (order) => {
  if (order.fulfillment_method !== "pickup") return "";
  const pickupDate = formatPickupDate(order.pickup_date);
  const pickupTime = formatPickupTime(order.pickup_time);
  if (!pickupDate && !pickupTime) return "";
  return [pickupDate, pickupTime ? `${pickupTime} น.` : ""].filter(Boolean).join(" ");
};

const getStatusMeta = (status) => STATUS_META[status] || STATUS_META.pending_payment;

const toUploadSrc = (path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http")) return path;
  const apiBaseUrl = appConst.API_URL.replace(/\/$/, "");
  const uploadPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${uploadPath}`;
};

const OnlineOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [slipFiles, setSlipFiles] = useState({});
  const [uploadingId, setUploadingId] = useState("");
  const [slipPreview, setSlipPreview] = useState(null);

  const userInfo = userInfoStorage.get() || {};
  const userRoles = getUserRoles(userInfo);
  const canManageOrders = userRoles.includes("superadmin") || userRoles.includes("admin");

  const onlineOrders = useMemo(
    () => orders.filter((order) => order.sales_channel === "online"),
    [orders]
  );

  const loadOrders = async () => {
    setLoading(true);
    try {
      const path = canManageOrders ? "api/orders/admin/all" : "api/orders";
      const response = await service.api.get(path);
      setOrders(Array.isArray(response) ? response : []);
    } catch (error) {
      alert.custom.fire({
        icon: "error",
        title: "โหลดคำสั่งซื้อไม่สำเร็จ",
        text: error?.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [canManageOrders]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await service.api.patch(`api/orders/${orderId}/status`, { status });
      await loadOrders();
    } catch (error) {
      alert.custom.fire({
        icon: "error",
        title: "อัปเดตสถานะไม่สำเร็จ",
        text: error?.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setUpdatingId("");
    }
  };

  const handleSlipFileChange = (orderId, file) => {
    setSlipFiles((prev) => ({
      ...prev,
      [orderId]: file || null,
    }));
  };

  const uploadPaymentSlip = async (orderId) => {
    const file = slipFiles[orderId];
    if (!file) {
      alert.custom.fire({
        icon: "warning",
        title: "กรุณาเลือกรูปสลิป",
      });
      return;
    }

    const formData = new FormData();
    formData.append("payment_slip", file);
    setUploadingId(orderId);
    try {
      await service.api.postFormData(`api/orders/${orderId}/payment-slip`, formData);
      setSlipFiles((prev) => ({ ...prev, [orderId]: null }));
      await loadOrders();
      alert.custom.fire({
        icon: "success",
        title: "อัปโหลดสลิปสำเร็จ",
        text: "สถานะคำสั่งซื้อถูกเปลี่ยนเป็นรอตรวจสอบการชำระเงินแล้ว",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      alert.custom.fire({
        icon: "error",
        title: "อัปโหลดสลิปไม่สำเร็จ",
        text: error?.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setUploadingId("");
    }
  };

  const renderStatusStepper = (status) => {
    if (status === "cancelled") {
      return (
        <div
          className="d-flex align-items-center"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            background: "#f8fafc",
            padding: "12px 14px",
            color: "#64748b",
            fontWeight: 800,
          }}
        >
          <XCircle size={20} style={{ marginRight: 8 }} />
          ยกเลิกคำสั่งซื้อแล้ว
        </div>
      );
    }

    const currentIndex = Math.max(
      STATUS_FLOW.findIndex((step) => step.key === status),
      0
    );

    return (
      <div
        className="d-flex align-items-start justify-content-between mb-3"
        style={{
          background: "#f8fbf6",
          border: "1px solid #e3eedf",
          borderRadius: 12,
          padding: "16px 14px",
          gap: 8,
        }}
      >
        {STATUS_FLOW.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isActive = index <= currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div
                className="d-flex flex-column align-items-center text-center"
                style={{ flex: "0 0 86px", color: isActive ? "#2f6f3e" : "#9ca3af" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: isActive ? "#2f6f3e" : "#eef2f7",
                    color: isActive ? "#fff" : "#9ca3af",
                    border: isCurrent ? "3px solid #bbf7d0" : "3px solid transparent",
                    boxShadow: isCurrent ? "0 6px 14px rgba(47,111,62,.18)" : "none",
                  }}
                >
                  <Icon size={17} />
                </div>
                <div
                  style={{
                    marginTop: 7,
                    fontSize: 12,
                    fontWeight: isCurrent ? 900 : 700,
                    lineHeight: 1.25,
                  }}
                >
                  {step.label}
                </div>
              </div>
              {index < STATUS_FLOW.length - 1 ? (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    marginTop: 16,
                    borderRadius: 999,
                    background: isDone ? "#2f6f3e" : "#e5e7eb",
                  }}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderStatusBadge = (status) => {
    const meta = getStatusMeta(status);
    const Icon = meta.icon;
    return (
      <Badge bg={meta.variant} className="d-inline-flex align-items-center">
        <Icon size={14} style={{ marginRight: 6 }} />
        {meta.label}
      </Badge>
    );
  };

  const renderAdminStatusControls = (order) => {
    const isUpdating = updatingId === order.id;
    const actions = [
      {
        status: "pending_payment",
        label: "รอชำระเงิน",
        icon: Clock,
      },
      {
        status: "payment_review",
        label: "รอตรวจสอบ",
        icon: Eye,
      },
      {
        status: "ready_to_ship",
        label: order.status === "payment_review" ? "ยืนยันโอนเงิน" : "รอจัดส่ง",
        icon: Truck,
      },
      {
        status: "completed",
        label: "เสร็จสิ้น",
        icon: CheckCircle,
      },
    ];

    return (
      <div
        className="mt-3"
        style={{
          borderTop: "1px solid #e3eedf",
          paddingTop: 14,
        }}
      >
        <div style={{ color: "#60725a", fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
          ปรับสถานะคำสั่งซื้อ
        </div>
        <div className="d-flex flex-wrap" style={{ gap: 8 }}>
          {actions.map((action) => {
            const Icon = action.icon;
            const isActive = order.status === action.status;
            return (
              <Button
                key={action.status}
                size="sm"
                disabled={isUpdating || isActive || order.status === "cancelled"}
                onClick={() => updateStatus(order.id, action.status)}
                style={{
                  borderRadius: 999,
                  fontWeight: 800,
                  borderColor: isActive ? "#2f6f3e" : "#d7e7d2",
                  background: isActive ? "#2f6f3e" : "#fff",
                  color: isActive ? "#fff" : "#2f6f3e",
                  padding: "8px 12px",
                }}
              >
                <Icon size={15} style={{ marginRight: 6 }} />
                {action.label}
              </Button>
            );
          })}
          <Button
            size="sm"
            disabled={isUpdating || order.status === "cancelled"}
            onClick={() => updateStatus(order.id, "cancelled")}
            style={{
              borderRadius: 999,
              fontWeight: 800,
              borderColor: "#fecaca",
              background: order.status === "cancelled" ? "#94a3b8" : "#fff",
              color: order.status === "cancelled" ? "#fff" : "#b91c1c",
              padding: "8px 12px",
            }}
          >
            <XCircle size={15} style={{ marginRight: 6 }} />
            ยกเลิก
          </Button>
        </div>
      </div>
    );
  };

  const renderPaymentSlipSection = (order) => {
    const slipUrl = toUploadSrc(order.payment_slip_url);
    const canUpload = !canManageOrders && order.status === "pending_payment";
    const selectedFile = slipFiles[order.id];

    return (
      <div
        className="mt-3"
        style={{
          background: "#fbfdf9",
          border: "1px solid #e3eedf",
          borderRadius: 10,
          padding: 12,
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between" style={{ gap: 10 }}>
          <div style={{ color: "#234018", fontWeight: 900 }}>
            หลักฐานการชำระเงิน
          </div>
          {slipUrl ? (
            <Button
              size="sm"
              variant="light"
              onClick={() => setSlipPreview({ url: slipUrl, orderId: order.id })}
              style={{
                border: "1px solid #d7e7d2",
                color: "#2f6f3e",
                fontWeight: 800,
                borderRadius: 999,
              }}
            >
              <Eye size={15} style={{ marginRight: 6 }} />
              ดูสลิป
            </Button>
          ) : null}
        </div>

        {slipUrl ? (
          <div className="mt-3 d-flex flex-wrap align-items-start" style={{ gap: 12 }}>
            <button
              type="button"
              onClick={() => setSlipPreview({ url: slipUrl, orderId: order.id })}
              style={{
                border: 0,
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <img
                src={slipUrl}
                alt="payment slip"
                style={{
                  width: 118,
                  height: 118,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #d7e7d2",
                }}
              />
            </button>
            <div style={{ color: "#60725a", fontSize: 13, lineHeight: 1.7 }}>
              {canManageOrders
                ? "คลิกที่รูปหรือปุ่มดูสลิปเพื่อตรวจสอบหลักฐานการโอนเงิน"
                : "อัปโหลดสลิปแล้ว ร้านค้าจะตรวจสอบการชำระเงินก่อนจัดส่ง"}
            </div>
          </div>
        ) : (
          <div style={{ color: "#94a18e", fontSize: 13, marginTop: 8 }}>
            ยังไม่มีสลิปการโอนเงิน
          </div>
        )}

        {canUpload ? (
          <div
            className="mt-3"
            style={{
              borderTop: "1px solid #e3eedf",
              paddingTop: 12,
            }}
          >
            <label
              htmlFor={`payment-slip-${order.id}`}
              className="d-flex align-items-center justify-content-center"
              style={{
                border: "1px dashed #9fbea0",
                borderRadius: 10,
                background: "#f7fbf5",
                color: "#2f6f3e",
                minHeight: 76,
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              <ImagePlus size={20} style={{ marginRight: 8 }} />
              {selectedFile ? selectedFile.name : "เลือกรูปภาพสลิปการโอนเงิน"}
            </label>
            <input
              id={`payment-slip-${order.id}`}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleSlipFileChange(order.id, e.target.files?.[0])}
            />
            <Button
              className="mt-2"
              disabled={uploadingId === order.id || !selectedFile}
              onClick={() => uploadPaymentSlip(order.id)}
              style={{
                width: "100%",
                backgroundColor: "#2f6f3e",
                borderColor: "#2f6f3e",
                color: "#fff",
                fontWeight: 900,
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <Upload size={16} style={{ marginRight: 8, color: "#fff" }} />
              {uploadingId === order.id ? "กำลังอัปโหลด..." : "อัปโหลดสลิปและแจ้งชำระเงิน"}
            </Button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Container fluid className="p-4" style={{ background: "#f7faf6", minHeight: "100vh" }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <h3 style={{ color: "#234018", fontWeight: 800, marginBottom: 6 }}>
            คำสั่งซื้อออนไลน์
          </h3>
          <div style={{ color: "#60725a" }}>
            {canManageOrders ? "รายการออนไลน์ทั้งหมดจากลูกค้า" : "รายการต้นไม้ที่คุณสั่งซื้อ"}
          </div>
        </div>
        <Button
          variant="light"
          onClick={loadOrders}
          disabled={loading}
          style={{ border: "1px solid #d7e7d2", color: "#2d5016", fontWeight: 700 }}
        >
          <RefreshCw size={16} style={{ marginRight: 8 }} />
          รีเฟรช
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "#4a7c2a" }} />
        </div>
      ) : onlineOrders.length === 0 ? (
        <Card style={{ border: "1px solid #d7e7d2", borderRadius: 8 }}>
          <Card.Body className="text-center py-5" style={{ color: "#60725a" }}>
            ยังไม่มีคำสั่งซื้อออนไลน์
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {onlineOrders.map((order) => (
            <Col lg={6} md={12} key={order.id} className="mb-3">
              <Card style={{ border: "1px solid #d7e7d2", borderRadius: 8 }}>
                <Card.Header
                  className="d-flex flex-wrap justify-content-between align-items-start"
                  style={{ background: "#eef7eb", borderBottom: "1px solid #d7e7d2" }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: "#234018" }}>
                      Order #{String(order.id).slice(0, 8)}
                    </div>
                    <small style={{ color: "#60725a" }}>{formatDate(order.created_at)}</small>
                  </div>
                  <div className="text-right">
                    {renderStatusBadge(order.status)}
                    <div style={{ color: "#60725a", marginTop: 6, fontSize: 13 }}>
                      {CHANNEL_LABELS[order.sales_channel] || order.sales_channel}
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  {renderStatusStepper(order.status)}

                  <Table responsive size="sm" className="mb-3">
                    <thead>
                      <tr>
                        <th>ต้นไม้</th>
                        <th className="text-center">จำนวน</th>
                        <th className="text-right">รวม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.items || []).map((item) => (
                        <tr key={item.id}>
                          <td>{item.tree_name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-right">{formatMoney(item.subtotal)} บาท</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="d-flex flex-wrap justify-content-between">
                    <div style={{ color: "#60725a" }}>
                      ชำระเงิน: {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                    </div>
                    <div style={{ color: "#60725a", fontWeight: 800 }}>
                      วิธีรับสินค้า:{" "}
                      {FULFILLMENT_LABELS[order.fulfillment_method] || "จัดส่งตามที่อยู่"}
                    </div>
                    <div style={{ color: "#234018", fontWeight: 800 }}>
                      ยอดสุทธิ {formatMoney(order.final_total)} บาท
                    </div>
                  </div>

                  {formatPickupSchedule(order) ? (
                    <div
                      className="mt-2"
                      style={{ color: "#2d5016", fontWeight: 800 }}
                    >
                      วันเวลารับสินค้า: {formatPickupSchedule(order)}
                    </div>
                  ) : null}

                  {order.note ? (
                    <div
                      className="mt-3"
                      style={{
                        background: "#f8fbf6",
                        border: "1px solid #e3eedf",
                        borderRadius: 8,
                        color: "#60725a",
                        fontSize: 13,
                        padding: 10,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {order.note}
                    </div>
                  ) : null}

                  {renderPaymentSlipSection(order)}

                  {canManageOrders ? renderAdminStatusControls(order) : null}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        show={Boolean(slipPreview)}
        onHide={() => setSlipPreview(null)}
        dialogClassName="slip-preview-dialog"
        contentClassName="slip-preview-content"
      >
        <Modal.Header className="slip-preview-header">
          <Modal.Title className="slip-preview-title">
            สลิปการโอนเงิน
            <div className="slip-preview-order">
              Order #{String(slipPreview?.orderId || "").slice(0, 8)}
            </div>
          </Modal.Title>
          <button
            type="button"
            className="slip-preview-close"
            aria-label="ปิดหน้าต่างสลิป"
            onClick={() => setSlipPreview(null)}
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </Modal.Header>
        <Modal.Body className="slip-preview-body">
          {slipPreview?.url ? (
            <div className="slip-preview-frame">
              <img
                src={slipPreview.url}
                alt="payment slip preview"
                className="slip-preview-image"
              />
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
      <style>
        {`
          .slip-preview-dialog {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: min(560px, calc(100vw - 28px)) !important;
            max-width: min(560px, calc(100vw - 28px)) !important;
            margin: 0 !important;
          }
          .slip-preview-content {
            border: 0;
            border-radius: 12px;
            box-shadow: 0 22px 60px rgba(20, 42, 18, 0.22);
            max-height: calc(100vh - 40px);
            overflow: hidden;
          }
          .slip-preview-header {
            align-items: flex-start;
            background: #ffffff;
            border-bottom: 1px solid #e3eedf;
            padding: 14px 18px 12px;
          }
          .slip-preview-title {
            color: #234018;
            font-size: 20px;
            font-weight: 900;
            line-height: 1.25;
            margin: 0;
          }
          .slip-preview-order {
            color: #60725a;
            font-size: 13px;
            font-weight: 700;
            margin-top: 3px;
          }
          .slip-preview-close {
            align-items: center;
            background: #f2f7ef;
            border: 1px solid #d9e8d4;
            border-radius: 50%;
            color: #315325;
            display: inline-flex;
            height: 34px;
            justify-content: center;
            margin-left: 16px;
            padding: 0;
            transition: background 140ms ease, border-color 140ms ease, color 140ms ease, transform 140ms ease;
            width: 34px;
          }
          .slip-preview-close:hover,
          .slip-preview-close:focus {
            background: #315325;
            border-color: #315325;
            color: #ffffff;
            outline: none;
            transform: translateY(-1px);
          }
          .slip-preview-body {
            background: #f7faf6;
            max-height: calc(100vh - 112px);
            overflow: auto;
            padding: 12px;
          }
          .slip-preview-frame {
            align-items: center;
            background: #ffffff;
            border: 1px solid #d7e7d2;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            min-height: 320px;
            overflow: auto;
            padding: 10px;
          }
          .slip-preview-image {
            border-radius: 8px;
            display: block;
            max-height: min(68vh, 620px);
            max-width: 100%;
            object-fit: contain;
          }
          @media (max-width: 576px) {
            .slip-preview-dialog {
              width: calc(100vw - 18px) !important;
              max-width: calc(100vw - 18px) !important;
            }
            .slip-preview-header {
              padding: 12px 14px 10px;
            }
            .slip-preview-title {
              font-size: 18px;
            }
            .slip-preview-body {
              padding: 8px;
            }
            .slip-preview-frame {
              min-height: 260px;
              padding: 8px;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default OnlineOrders;
