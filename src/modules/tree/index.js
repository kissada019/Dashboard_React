import React, { useState } from "react";
import {
  Table,
  Button,
  Card,
  Container,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import alert from "../../utils/alert";
import { Pencil, Trash } from "lucide-react";
// Using mock data instead of API calls for now
/*
import { useDispatch } from "react-redux";
import {
  onGetAllTree,
  onCreateTree,
  onDeleteTree,
} from "../../redux/slices/treeSlice";
*/

const LayoutPage = () => {
  const history = useHistory();
  /*
  const dispatch = useDispatch();
  */

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

  /*
  // Original effect that fetched data from API via redux
  React.useEffect(() => {
    dispatch(onGetAllTree()).then((response) => {
      console.log("onGetAllTree response : ", response?.payload);
      setData(response?.payload);
    });
  }, []);
  */

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

    /*
    // Original delete handler that dispatched API delete via redux
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
            console.log("delete id : ", id);
            dispatch(onDeleteTree(id)).then(() => {
              alert.custom
                .fire({
                  icon: "success",
                  title: "ลบข้อมูลเรียบร้อย",
                  confirmButtonText: "ยืนยัน",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    setData((prevData) =>
                      prevData.filter((item) => item.id !== id)
                    );
                  }
                });
            });
          } else if (result.dismiss === alert.custom.DismissReason.cancel) {
            console.log("ยกเลิกการลบ");
          }
        });
    };
    */

  const handleCreateClick = () => {
    history.push("/admin/register");
  };

  const handleEditClick = (id) => {
    history.push(`/admin/tree/${id}`);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // console.log("paginatedData : ", paginatedData);


  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Container fluid className="p-4">
      <Card className="card-tasks p-3">
        <Card.Header>
          <div className="places-buttons">
            <Row className="justify-content-between mb-3">
              <Col lg="3" md="3">
                <Card.Title as="h4">ต้นไม้</Card.Title>
              </Col>
              <Col lg="1" md="1">
                <div className="numbers text-right">
                  <Button
                    variant="outline-primary"
                    className="btn btn-success"
                    onClick={handleCreateClick}
                    size="sm"
                  >
                    Create
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-end mt-2 mb-3">
              <Col lg="3" md="3">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Col>
            </Row>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-full-width">
            <Table className="table table-hover no-border">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>ชื่อ</th>
                  <th>พันธุ์</th>
                  <th>ราคาซื้อ</th>
                  <th>ราคาขาย</th>
                  <th>จำนวน</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData?.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.species}</td>
                    <td>{item.price_old}</td>
                    <td>{item.price_new}</td>
                    <td>{item.amount}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        className="me-2 btn btn-warning mr-1"
                        size="sm"
                        onClick={() => handleEditClick(item.id)}
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        className="me-2 btn btn-danger"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTree(item.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between mt-3">
              <Button onClick={handlePreviousPage}>Previous</Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button onClick={handleNextPage}>Next</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LayoutPage;
