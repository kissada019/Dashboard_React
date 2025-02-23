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
import { useHistory } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { onGetAllTree, onCreateTree } from "../../redux/slices/treeSlice";

const LayoutPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    dispatch(onGetAllTree()).then((response) => {
      console.log("onGetAllTree response : ", response?.payload);
      setData(response?.payload);
    });
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

  const addData = () => {
    console.log("test");
  };

  const handleCreateClick = () => {
    history.push("/admin/register");
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

  return (
    <Container fluid className="p-4">
      <Card className="card-tasks p-3">
        <Card.Header>
          <div className="places-buttons">
            <Row className="justify-content-between mb-3">
              <Col lg="1" md="1">
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
                        className="me-2 btn btn-warning"
                        size="sm"
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        className="me-2 btn btn-danger"
                        variant="outline-danger"
                        size="sm"
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
