import React, { useState } from "react";
import {
  Table,
  Button,
  Card,
  Container,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import alert from "../../utils/alert";
import { Pencil, Trash, Plus, Search, Sprout, Package, DollarSign, TrendingUp, Eye } from "lucide-react";

const TreePage = () => {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    const mockData = [
      { id: 1, name: "ต้นมะม่วง", species: "มะม่วงน้ำดอกไม้", price_old: 100, price_new: 150, amount: 20 },
      { id: 2, name: "ต้นลำไย", species: "ลำไย", price_old: 120, price_new: 180, amount: 15 },
      { id: 3, name: "ต้นมะขาม", species: "มะขาม", price_old: 90, price_new: 130, amount: 8 },
      { id: 4, name: "ต้นมะพร้าว", species: "มะพร้าวน้ำหอม", price_old: 200, price_new: 250, amount: 5 },
      { id: 5, name: "ต้นส้ม", species: "ส้มโอ", price_old: 110, price_new: 160, amount: 12 },
      { id: 6, name: "ต้นกาแฟ", species: "อาราบิก้า", price_old: 300, price_new: 350, amount: 7 },
      { id: 7, name: "ต้นมะกรูด", species: "มะกรูด", price_old: 80, price_new: 120, amount: 30 },
      { id: 8, name: "ต้นสัก", species: "สักทอง", price_old: 500, price_new: 650, amount: 3 },
      { id: 9, name: "ต้นชวนชม", species: "ชวนชม", price_old: 60, price_new: 90, amount: 25 },
      { id: 10, name: "ต้นกุหลาบ", species: "กุหลาบ", price_old: 40, price_new: 70, amount: 40 },
      { id: 11, name: "ต้นไผ่", species: "ไผ่", price_old: 70, price_new: 95, amount: 18 },
      { id: 12, name: "ต้นมะนาว", species: "มะนาว", price_old: 50, price_new: 80, amount: 22 },
    ];

    setData(mockData);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredData = data?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.species.toLowerCase().includes(searchTerm) ||
      item.price_old.toString().includes(searchTerm) ||
      item.price_new.toString().includes(searchTerm) ||
      item.amount.toString().includes(searchTerm)
  );

  const handleDeleteTree = (id) => {
    alert.custom
      .fire({
        icon: "warning",
        title: "คุณต้องการลบข้อมูลต้นไม้ id = " + id,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      })
      .then((result) => {
        if (result.isConfirmed) {
          setData((prevData) => prevData.filter((item) => item.id !== id));
          alert.custom.fire({
            icon: "success",
            title: "ลบข้อมูลเรียบร้อย",
            confirmButtonText: "ยืนยัน",
          });
        } else if (result.dismiss === alert.custom.DismissReason.cancel) {
          console.log("ยกเลิกการลบ");
        }
      });
  };

  const handleCreateClick = () => {
    history.push("/admin/register");
  };

  const handleEditClick = (id) => {
    history.push(`/admin/tree/${id}`);
  };

  const handleViewDetail = (id) => {
    history.push(`/admin/tree-detail/${id}`);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Calculate statistics
  const totalTrees = data.length;
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const totalValue = data.reduce((sum, item) => sum + (item.price_new * item.amount), 0);
  const avgProfit = data.length > 0 
    ? data.reduce((sum, item) => sum + (item.price_new - item.price_old), 0) / data.length 
    : 0;

  return (
    <Container fluid className="p-4">
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg="3" md="6" sm="6">
          <Card className="card-stats" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}>
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center" style={{ fontSize: '2.5rem' }}>
                    <Sprout size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>
                      จำนวนชนิด
                    </p>
                    <Card.Title as="h4" style={{ color: 'white', margin: 0 }}>
                      {totalTrees}
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" md="6" sm="6">
          <Card className="card-stats" style={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)'
          }}>
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center" style={{ fontSize: '2.5rem' }}>
                    <Package size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>
                      จำนวนทั้งหมด
                    </p>
                    <Card.Title as="h4" style={{ color: 'white', margin: 0 }}>
                      {totalAmount}
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" md="6" sm="6">
          <Card className="card-stats" style={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)'
          }}>
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center" style={{ fontSize: '2.5rem' }}>
                    <DollarSign size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>
                      มูลค่ารวม
                    </p>
                    <Card.Title as="h4" style={{ color: 'white', margin: 0 }}>
                      {totalValue.toLocaleString()} ฿
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" md="6" sm="6">
          <Card className="card-stats" style={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px rgba(67, 233, 123, 0.4)'
          }}>
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center" style={{ fontSize: '2.5rem' }}>
                    <TrendingUp size={48} />
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>
                      กำไรเฉลี่ย
                    </p>
                    <Card.Title as="h4" style={{ color: 'white', margin: 0 }}>
                      {avgProfit.toFixed(0)} ฿
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card className="card-tasks" style={{ 
        border: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <Card.Header style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 30px',
          border: 'none'
        }}>
          <Row className="justify-content-between align-items-center">
            <Col lg="6" md="6">
              <Card.Title as="h4" style={{ color: 'white', margin: 0, fontWeight: '600' }}>
                <Sprout size={28} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                จัดการข้อมูลต้นไม้
              </Card.Title>
            </Col>
            <Col lg="6" md="6" className="text-right">
              <Button
                variant="light"
                className="me-2"
                onClick={handleCreateClick}
                style={{
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <Plus size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                เพิ่มข้อมูลใหม่
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body style={{ padding: '30px' }}>
          {/* Search Bar */}
          <Row className="mb-4">
            <Col lg="4" md="6">
              <div style={{ position: 'relative' }}>
                <Search 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#999',
                    zIndex: 10
                  }} 
                />
                <Form.Control
                  type="text"
                  placeholder="ค้นหาต้นไม้, พันธุ์, ราคา..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    paddingLeft: '45px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            </Col>
            <Col lg="8" md="6" className="text-right">
              <Badge 
                bg="info" 
                style={{ 
                  padding: '8px 15px', 
                  fontSize: '14px',
                  borderRadius: '8px'
                }}
              >
                พบทั้งหมด {filteredData.length} รายการ
              </Badge>
            </Col>
          </Row>

          {/* Table */}
          <div className="table-responsive" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <Table 
              hover 
              style={{ 
                margin: 0,
                backgroundColor: 'white'
              }}
            >
              <thead style={{ 
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                color: '#333'
              }}>
                <tr>
                  <th style={{ 
                    padding: '15px',
                    fontWeight: '600',
                    borderBottom: '2px solid #ddd'
                  }}>ลำดับ</th>
                  <th style={{ 
                    padding: '15px',
                    fontWeight: '600',
                    borderBottom: '2px solid #ddd'
                  }}>ชื่อ</th>
                  <th style={{ 
                    padding: '15px',
                    fontWeight: '600',
                    borderBottom: '2px solid #ddd'
                  }}>พันธุ์</th>
                  <th style={{ 
                    padding: '15px',
                    fontWeight: '600',
                    borderBottom: '2px solid #ddd'
                  }}>ราคาซื้อ</th>
                  <th style={{ 
                    padding: '15px',
                    fontWeight: '600',
                    borderBottom: '2px solid #ddd'
                  }}>ราคาขาย</th>
                  <th style={{ 
                    padding: '15px',
                    fontWeight: '600',
                    borderBottom: '2px solid #ddd'
                  }}>จำนวน</th>
                  <th style={{ 
                    padding: '15px',
                    fontWeight: '600',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'center'
                  }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData?.length > 0 ? (
                  paginatedData.map((item, index) => {
                    return (
                      <tr 
                        key={item.id}
                        style={{
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.transform = 'scale(1.01)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                          <Badge bg="secondary" style={{ borderRadius: '6px', padding: '5px 10px' }}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </Badge>
                        </td>
                        <td style={{ padding: '15px', verticalAlign: 'middle', fontWeight: '500' }}>
                          {item.name}
                        </td>
                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                          <Badge bg="info" style={{ borderRadius: '6px', padding: '5px 10px' }}>
                            {item.species}
                          </Badge>
                        </td>
                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                          <span style={{ color: '#666' }}>{item.price_old.toLocaleString()} ฿</span>
                        </td>
                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                          <span style={{ color: '#28a745', fontWeight: '600' }}>
                            {item.price_new.toLocaleString()} ฿
                          </span>
                        </td>
                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                          <Badge 
                            bg={item.amount > 10 ? "success" : item.amount > 5 ? "warning" : "danger"}
                            style={{ borderRadius: '6px', padding: '5px 10px' }}
                          >
                            {item.amount} ต้น
                          </Badge>
                        </td>
                        <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <Button
                            variant="outline-info"
                            className="me-2"
                            size="sm"
                            onClick={() => handleViewDetail(item.id)}
                            style={{
                              borderRadius: '6px',
                              padding: '5px 12px',
                              borderWidth: '2px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,162,184,0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
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
                              borderRadius: '6px',
                              padding: '5px 12px',
                              borderWidth: '2px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,193,7,0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            title="แก้ไข"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteTree(item.id)}
                            style={{
                              borderRadius: '6px',
                              padding: '5px 12px',
                              borderWidth: '2px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(220,53,69,0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
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
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <Sprout size={48} style={{ marginBottom: '10px', opacity: 0.3 }} />
                      <p style={{ margin: 0, fontSize: '16px' }}>ไม่พบข้อมูล</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div 
              className="d-flex justify-content-between align-items-center mt-4"
              style={{
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '10px'
              }}
            >
              <Button 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                variant="outline-primary"
                style={{
                  borderRadius: '8px',
                  padding: '8px 20px',
                  borderWidth: '2px',
                  fontWeight: '500'
                }}
              >
                ก่อนหน้า
              </Button>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#666'
              }}>
                หน้า {currentPage} จาก {totalPages}
              </span>
              <Button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline-primary"
                style={{
                  borderRadius: '8px',
                  padding: '8px 20px',
                  borderWidth: '2px',
                  fontWeight: '500'
                }}
              >
                ถัดไป
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TreePage;

