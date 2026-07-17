import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Card,
  Container,
  Form,
  Row,
  Col,
  Badge,
  Modal,
  Pagination,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import alert from "../../utils/alert";
import {
  onGetAllTree,
  onGetTreeById,
  onUpdateTree,
} from "../../redux/slices/treeSlice";
import {
  Pencil,
  Trash,
  Plus,
  Search,
  Sprout,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
} from "lucide-react";

const stockModalStyles = `
  .stock-center-modal.show .modal-dialog {
    transform: translate(0, 0) !important;
  }
  .stock-center-modal .modal-title {
    font-size: 28px;
    font-weight: 700;
  }
  .stock-center-modal .form-label {
    font-size: 20px;
    font-weight: 600;
  }
  .stock-center-modal .form-select,
  .stock-center-modal .form-control {
    font-size: 20px;
    height: 48px;
  }
  .stock-center-modal .btn {
    font-size: 18px;
  }
  .stock-center-modal h6 {
    font-size: 22px;
    font-weight: 700;
  }
  .stock-center-modal table th,
  .stock-center-modal table td {
    font-size: 18px;
  }

  .tree-stat-col {
    flex: 0 0 20%;
    max-width: 20%;
  }

  @media (max-width: 1199.98px) {
    .tree-stat-col {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
  }

  @media (max-width: 767.98px) {
    .tree-stat-col {
      flex: 0 0 50%;
      max-width: 50%;
    }
  }

  .tree-action-col {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tree-table-wrap table {
    min-width: 920px;
  }

  .tree-pagination-panel {
    align-items: center;
    background: #ffffff;
    border: 1px solid rgba(74, 124, 42, 0.08);
    border-radius: 10px;
    box-shadow: 0 16px 34px rgba(45, 80, 22, 0.13);
    display: flex;
    gap: 22px;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 24px;
    padding: 18px 22px;
    width: fit-content;
  }

  .tree-pagination-info {
    color: #667463;
    font-size: 14px;
    font-weight: 600;
  }

  .tree-pagination-controls {
    align-items: center;
    display: flex;
    gap: 22px;
  }

  .tree-pagination-controls .pagination {
    align-items: center;
    gap: 10px;
    margin: 0;
  }

  .tree-pagination-controls .visually-hidden,
  .tree-pagination-controls .sr-only {
    display: none !important;
  }

  .tree-pagination-controls .page-link {
    align-items: center;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 7px !important;
    color: #111827;
    display: inline-flex;
    font-size: 14px;
    font-weight: 600;
    height: 30px;
    justify-content: center;
    min-width: 30px;
    padding: 0 8px;
    transition: background 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
  }

  .tree-pagination-controls .page-item.active .page-link {
    background: #ffffff;
    border-color: #4a7c2a;
    color: #2d5016;
    box-shadow: 0 0 0 3px rgba(74, 124, 42, 0.1);
  }

  .tree-pagination-controls .page-link:hover {
    background: rgba(74, 124, 42, 0.07);
    border-color: transparent;
    color: #2d5016;
  }

  .tree-pagination-controls .page-item.disabled .page-link {
    background: transparent;
    border-color: transparent;
    color: #a4a9b2;
    box-shadow: none;
  }

  .tree-pagination-controls .page-item:first-child .page-link,
  .tree-pagination-controls .page-item:last-child .page-link {
    color: #4a7c2a;
    min-width: auto;
    padding: 0 4px;
  }

  .tree-pagination-controls .page-item:first-child.disabled .page-link,
  .tree-pagination-controls .page-item:last-child.disabled .page-link {
    color: #a4a9b2;
  }

  .tree-page-size-select {
    background: #ffffff;
    border: 1px solid rgba(74, 124, 42, 0.55);
    border-radius: 8px;
    color: #111827;
    font-size: 14px;
    font-weight: 600;
    height: 38px;
    min-width: 118px;
    padding: 4px 12px;
  }

  .tree-page-size-select:focus {
    border-color: #4a7c2a;
    box-shadow: 0 0 0 3px rgba(74, 124, 42, 0.12);
    outline: none;
  }

  @media (max-width: 576px) {
    .tree-main-header {
      gap: 10px;
    }
    .tree-main-header .card-title {
      font-size: 20px !important;
    }
    .tree-action-col {
      justify-content: flex-start;
      width: 100%;
    }
    .tree-action-btn {
      width: 100%;
      margin-right: 0 !important;
      margin-bottom: 6px;
      padding: 10px 12px !important;
      font-size: 14px !important;
    }
    .tree-search-col,
    .tree-summary-col {
      flex: 0 0 100%;
      max-width: 100%;
      text-align: left !important;
    }
    .tree-pagination-panel {
      align-items: stretch;
      flex-direction: column;
      width: 100%;
    }
    .tree-pagination-controls {
      align-items: stretch;
      flex-direction: column;
    }
    .tree-pagination-controls .pagination {
      justify-content: center;
      overflow-x: auto;
      padding-bottom: 2px;
    }
  }
`;

const TreePage = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const { tableTree, loading } = useSelector((state) => state.treeSlice);
  const data = tableTree.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedTreeId, setSelectedTreeId] = useState("");
  const [selectedAddQty, setSelectedAddQty] = useState(1);
  const [stockUpdateList, setStockUpdateList] = useState([]);
  const [isSubmittingStockUpdate, setIsSubmittingStockUpdate] = useState(false);
  React.useEffect(() => {
    dispatch(onGetAllTree());
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredData = data?.filter(
    (item) =>
      (item.id && item.id.toLowerCase().includes(searchTerm)) ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.species.toLowerCase().includes(searchTerm) ||
      item.buy_price.toString().includes(searchTerm) ||
      item.sell_price.toString().includes(searchTerm) ||
      item.quantity.toString().includes(searchTerm),
  );

  const handleDeleteTree = (tree) => {
    const { id, name } = tree || {};
    alert.custom
      .fire({
        icon: "warning",
        title: name
          ? `คุณต้องการลบข้อมูล "${name}" หรือไม่?`
          : `คุณต้องการลบข้อมูลต้นไม้ id = ${id}`,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(onUpdateTree({ id, status: "inactive" })).then(
            (response) => {
              if (response?.payload) {
                alert.custom.fire({
                  icon: "success",
                  title: "ปิดการใช้งานเรียบร้อย",
                  confirmButtonText: "ยืนยัน",
                });
                dispatch(onGetAllTree());
              } else {
                alert.custom.fire({
                  icon: "error",
                  title: "เกิดข้อผิดพลาด",
                  text: "ไม่สามารถปิดการใช้งานต้นไม้ได้",
                  confirmButtonText: "ตกลง",
                });
              }
            },
          );
        } else if (result.dismiss === alert.custom.DismissReason.cancel) {
          console.log("ยกเลิกการลบ");
        }
      });
  };

  const selectableTrees = data.filter(
    (item) => String(item?.status || "").toLowerCase() !== "inactive",
  );

  const resetStockModal = () => {
    setShowStockModal(false);
    setSelectedTreeId("");
    setSelectedAddQty(1);
    setStockUpdateList([]);
    setIsSubmittingStockUpdate(false);
  };

  const handleOpenStockModal = () => {
    setShowStockModal(true);
  };

  const handleAddToStockList = () => {
    const addQty = Number(selectedAddQty);
    const tree = selectableTrees.find((item) => item.id === selectedTreeId);

    if (!tree) {
      alert.custom.fire({
        icon: "warning",
        title: "กรุณาเลือกต้นไม้",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    if (!Number.isFinite(addQty) || addQty <= 0) {
      alert.custom.fire({
        icon: "warning",
        title: "จำนวนที่เพิ่มต้องมากกว่า 0",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const safeQty = Math.floor(addQty);
    setStockUpdateList((prev) => {
      const exists = prev.find((item) => item.id === tree.id);
      if (exists) {
        return prev.map((item) =>
          item.id === tree.id
            ? {
                ...item,
                addQty: item.addQty + safeQty,
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: tree.id,
          name: tree.name,
          currentQty: Number(tree.quantity || 0),
          addQty: safeQty,
        },
      ];
    });
    setSelectedTreeId("");
    setSelectedAddQty(1);
  };

  const handleRemoveFromStockList = (id) => {
    setStockUpdateList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitStockList = async () => {
    if (stockUpdateList.length === 0) {
      alert.custom.fire({
        icon: "warning",
        title: "ยังไม่มีรายการเพิ่มต้นไม้",
        text: "กรุณาเพิ่มรายการก่อนบันทึก",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setIsSubmittingStockUpdate(true);
    try {
      const responses = await Promise.all(
        stockUpdateList.map((item) =>
          dispatch(
            onUpdateTree({
              id: item.id,
              quantity: Number(item.currentQty) + Number(item.addQty),
            }),
          ),
        ),
      );

      const successCount = responses.filter((res) =>
        Boolean(res?.payload),
      ).length;
      if (successCount === stockUpdateList.length) {
        alert.custom.fire({
          icon: "success",
          title: "อัปเดตสต็อกสำเร็จ",
          text: `บันทึก ${successCount} รายการเรียบร้อย`,
          confirmButtonText: "ตกลง",
        });
      } else {
        alert.custom.fire({
          icon: "warning",
          title: "อัปเดตสต็อกบางรายการไม่สำเร็จ",
          text: `สำเร็จ ${successCount} จาก ${stockUpdateList.length} รายการ`,
          confirmButtonText: "ตกลง",
        });
      }
      dispatch(onGetAllTree());
      resetStockModal();
    } catch (error) {
      alert.custom.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตสต็อกได้",
        confirmButtonText: "ตกลง",
      });
      setIsSubmittingStockUpdate(false);
    }
  };

  const handleCreateClick = () => {
    history.push("/admin/register");
  };

  const handleEditClick = (id) => {
    history.push(`/admin/tree/edit/${id}`);
  };

  const handleViewDetail = (id) => {
    dispatch(onGetTreeById(id));
    history.push(`/admin/tree-detail/${id}`);
  };

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);
  const visiblePageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1,
  );

  React.useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Calculate statistics
  const totalTrees = data.length;
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = data.reduce(
    (sum, item) => sum + item.sell_price * item.quantity,
    0,
  );
  const totalBuyValue = data.reduce(
    (sum, item) => sum + item.buy_price * item.quantity,
    0,
  );
  const totalProfit = totalValue - totalBuyValue;

  return (
    <Container fluid className="p-4">
      <style>{stockModalStyles}</style>
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col className="tree-stat-col" md="6" sm="6">
          <Card
            className="card-stats"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
          >
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div
                    className="icon-big text-center"
                    style={{ fontSize: "2.5rem" }}
                  >
                    <Sprout size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p
                      className="card-category"
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: "5px",
                      }}
                    >
                      จำนวนชนิด
                    </p>
                    <Card.Title as="h4" style={{ color: "white", margin: 0 }}>
                      {totalTrees}
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="tree-stat-col" md="6" sm="6">
          <Card
            className="card-stats"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 15px rgba(245, 87, 108, 0.4)",
            }}
          >
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div
                    className="icon-big text-center"
                    style={{ fontSize: "2.5rem" }}
                  >
                    <Package size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p
                      className="card-category"
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: "5px",
                      }}
                    >
                      จำนวนทั้งหมด
                    </p>
                    <Card.Title as="h4" style={{ color: "white", margin: 0 }}>
                      {totalQuantity}
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="tree-stat-col" md="6" sm="6">
          <Card
            className="card-stats"
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 15px rgba(79, 172, 254, 0.4)",
            }}
          >
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div
                    className="icon-big text-center"
                    style={{ fontSize: "2.5rem" }}
                  >
                    <DollarSign size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p
                      className="card-category"
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: "5px",
                      }}
                    >
                      มูลค่ารวม
                    </p>
                    <Card.Title as="h4" style={{ color: "white", margin: 0 }}>
                      {totalValue.toLocaleString()} ฿
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="tree-stat-col" md="6" sm="6">
          <Card
            className="card-stats"
            style={{
              background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 15px rgba(253, 160, 133, 0.4)",
            }}
          >
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div
                    className="icon-big text-center"
                    style={{ fontSize: "2.5rem" }}
                  >
                    <DollarSign size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p
                      className="card-category"
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: "5px",
                      }}
                    >
                      มูลค่าราคาซื้อรวม
                    </p>
                    <Card.Title as="h4" style={{ color: "white", margin: 0 }}>
                      {totalBuyValue.toLocaleString()} ฿
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="tree-stat-col" md="6" sm="6">
          <Card
            className="card-stats"
            style={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 15px rgba(67, 233, 123, 0.4)",
            }}
          >
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div
                    className="icon-big text-center"
                    style={{ fontSize: "2.5rem" }}
                  >
                    <TrendingUp size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p
                      className="card-category"
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: "5px",
                      }}
                    >
                      กำไร
                    </p>
                    <Card.Title as="h4" style={{ color: "white", margin: 0 }}>
                      {totalProfit.toLocaleString()} ฿
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card
        className="card-tasks"
        style={{
          border: "none",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Card.Header
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "20px 30px",
            border: "none",
          }}
        >
          <Row className="justify-content-between align-items-center tree-main-header">
            <Col lg="6" md="6">
              <Card.Title
                as="h4"
                style={{ color: "white", margin: 0, fontWeight: "600" }}
              >
                <Sprout
                  size={28}
                  style={{ marginRight: "10px", verticalAlign: "middle" }}
                />
                จัดการข้อมูลต้นไม้
              </Card.Title>
            </Col>
            <Col lg="6" md="6" className="text-right tree-action-col">
              <Button
                variant="light"
                className="me-2 tree-action-btn"
                onClick={handleCreateClick}
                style={{
                  borderRadius: "8px",
                  padding: "8px 20px",
                  fontWeight: "500",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <Plus
                  size={18}
                  style={{ marginRight: "5px", verticalAlign: "middle" }}
                />
                เพิ่มข้อมูลใหม่
              </Button>
              <Button
                variant="success"
                onClick={handleOpenStockModal}
                className="tree-action-btn"
                style={{
                  borderRadius: "8px",
                  padding: "8px 20px",
                  fontWeight: "500",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <Plus
                  size={18}
                  style={{ marginRight: "5px", verticalAlign: "middle" }}
                />
                เพิ่มต้นไม้เข้าสต็อก
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body style={{ padding: "30px" }}>
          {/* Search Bar */}
          <Row className="mb-4">
            <Col lg="4" md="6" className="tree-search-col">
              <div style={{ position: "relative" }}>
                <Search
                  size={20}
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                    zIndex: 10,
                  }}
                />
                <Form.Control
                  type="text"
                  placeholder="ค้นหาต้นไม้, พันธุ์, ราคา..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    paddingLeft: "45px",
                    borderRadius: "10px",
                    border: "2px solid #e0e0e0",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>
            </Col>
            <Col lg="8" md="6" className="text-right tree-summary-col">
              <Badge
                bg="info"
                style={{
                  padding: "8px 15px",
                  fontSize: "14px",
                  borderRadius: "8px",
                }}
              >
                {loading
                  ? "กำลังโหลด..."
                  : `พบทั้งหมด ${filteredData.length} รายการ`}
              </Badge>
            </Col>
          </Row>

          {/* Table */}
          <div
            className="table-responsive tree-table-wrap"
            style={{ borderRadius: "10px", overflow: "hidden" }}
          >
            <Table
              hover
              style={{
                margin: 0,
                backgroundColor: "white",
              }}
            >
              <thead
                style={{
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  color: "#333",
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    ลำดับ
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    ชื่อ
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    พันธุ์
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    ราคาซื้อ
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    ราคาขาย
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    จำนวน
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      borderBottom: "2px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData?.length > 0 ? (
                  paginatedData.map((item, index) => {
                    return (
                      <tr
                        key={item.id}
                        style={{
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                          e.currentTarget.style.transform = "scale(1.01)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <td
                          style={{ padding: "15px", verticalAlign: "middle" }}
                        >
                          <Badge
                            bg="secondary"
                            style={{ borderRadius: "6px", padding: "5px 10px" }}
                          >
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </Badge>
                        </td>
                        <td
                          style={{
                            padding: "15px",
                            verticalAlign: "middle",
                            fontWeight: "500",
                          }}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{ padding: "15px", verticalAlign: "middle" }}
                        >
                          <Badge
                            bg="info"
                            style={{ borderRadius: "6px", padding: "5px 10px" }}
                          >
                            {item.species}
                          </Badge>
                        </td>
                        <td
                          style={{ padding: "15px", verticalAlign: "middle" }}
                        >
                          <span style={{ color: "#666" }}>
                            {item.buy_price.toLocaleString()} ฿
                          </span>
                        </td>
                        <td
                          style={{ padding: "15px", verticalAlign: "middle" }}
                        >
                          <span style={{ color: "#28a745", fontWeight: "600" }}>
                            {item.sell_price.toLocaleString()} ฿
                          </span>
                        </td>
                        <td
                          style={{ padding: "15px", verticalAlign: "middle" }}
                        >
                          <Badge
                            bg={
                              item.quantity > 10
                                ? "success"
                                : item.quantity > 5
                                  ? "warning"
                                  : "danger"
                            }
                            style={{ borderRadius: "6px", padding: "5px 10px" }}
                          >
                            {item.quantity} ต้น
                          </Badge>
                        </td>
                        <td
                          style={{
                            padding: "15px",
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Button
                            variant="outline-info"
                            className="me-2"
                            size="sm"
                            onClick={() => handleViewDetail(item.id)}
                            style={{
                              borderRadius: "6px",
                              padding: "5px 12px",
                              borderWidth: "2px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.1)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(23,162,184,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                            title="ดูรายละเอียด"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline-warning"
                            className="me-2"
                            size="sm"
                            onClick={() => handleEditClick(item.id)}
                            style={{
                              borderRadius: "6px",
                              padding: "5px 12px",
                              borderWidth: "2px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.1)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(255,193,7,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                            title="แก้ไข"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteTree(item)}
                            style={{
                              borderRadius: "6px",
                              padding: "5px 12px",
                              borderWidth: "2px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.1)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(220,53,69,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                            title="ลบ"
                          >
                            <Trash size={16} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#999",
                      }}
                    >
                      <Sprout
                        size={48}
                        style={{ marginBottom: "10px", opacity: 0.3 }}
                      />
                      <p style={{ margin: 0, fontSize: "16px" }}>ไม่พบข้อมูล</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="tree-pagination-panel">
              <div className="tree-pagination-controls">
                <Pagination>
                  <Pagination.Item
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    aria-label="หน้าก่อนหน้า"
                  >
                    {"Previous"}
                  </Pagination.Item>

                  {visiblePageNumbers.map((page, index) => {
                    const previousPage = visiblePageNumbers[index - 1];
                    const showGap = previousPage && page - previousPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {showGap ? <Pagination.Ellipsis disabled /> : null}
                        <Pagination.Item
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      </React.Fragment>
                    );
                  })}

                  <Pagination.Item
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="หน้าถัดไป"
                  >
                    {"Next"}
                  </Pagination.Item>
                </Pagination>

                <select
                  className="tree-page-size-select"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  aria-label="จำนวนรายการต่อหน้า"
                >
                  {[10, 20, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize} / page
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={showStockModal}
        onHide={resetStockModal}
        size="lg"
        centered
        backdrop="static"
        className="stock-center-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มต้นไม้เข้าสต็อก (หลายรายการ)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-2 align-items-end">
            <Col md={7}>
              <Form.Label className="mb-1">เลือกต้นไม้</Form.Label>
              <Form.Select
                value={selectedTreeId}
                onChange={(e) => setSelectedTreeId(e.target.value)}
              >
                <option value="">-- เลือกต้นไม้ --</option>
                {selectableTrees.map((tree) => (
                  <option key={tree.id} value={tree.id}>
                    {tree.name} - {tree.species || "ไม่ระบุพันธุ์"} (คงเหลือ{" "}
                    {tree.quantity} ต้น)
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="mb-1">จำนวนที่เพิ่ม</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={selectedAddQty}
                onChange={(e) => setSelectedAddQty(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Button
                className="w-100"
                variant="success"
                onClick={handleAddToStockList}
              >
                เพิ่ม
              </Button>
            </Col>
          </Row>

          <div className="mt-4">
            <h6 className="mb-2">รายการที่จะอัปเดต</h6>
            <div className="table-responsive">
              <Table bordered size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>ชื่อ</th>
                    <th className="text-center">คงเหลือเดิม</th>
                    <th className="text-center">เพิ่ม</th>
                    <th className="text-center">คงเหลือใหม่</th>
                    <th className="text-center">ลบ</th>
                  </tr>
                </thead>
                <tbody>
                  {stockUpdateList.length > 0 ? (
                    stockUpdateList.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.currentQty}</td>
                        <td className="text-center">{item.addQty}</td>
                        <td className="text-center">
                          {Number(item.currentQty) + Number(item.addQty)}
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleRemoveFromStockList(item.id)}
                          >
                            ลบ
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-3">
                        ยังไม่มีรายการ
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetStockModal}>
            ปิด
          </Button>
          <Button
            variant="success"
            onClick={handleSubmitStockList}
            disabled={isSubmittingStockUpdate}
          >
            {isSubmittingStockUpdate ? "กำลังบันทึก..." : "บันทึกทั้งหมด"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TreePage;
