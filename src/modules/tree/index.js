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

  React.useEffect(() => {
    dispatch(onGetAllTree()).then((response) => {
      console.log("onGetAllTree response : ", response?.payload);
      setData(response?.payload);
    });
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter data based on search term
  const filteredData = data?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.gender.toLowerCase().includes(searchTerm) ||
      item.breed.toLowerCase().includes(searchTerm) ||
      item.color.toLowerCase().includes(searchTerm) ||
      item.age.toString().includes(searchTerm)
  );

  const addData = () => {
    // dispatch(onCreateTree({ name: "New Tree", type: "Oak" }));
    console.log("test");
  };

  const handleCreateClick = () => {
    history.push("/admin/register");
  };

  return (
    <Container fluid>
      <Card className="card-tasks">
        <Card.Header>
          <div className="places-buttons">
            <Row className="justify-content-between ">
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
            <Row className="justify-content-end mt-2">
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
                  <th>ลำดัย</th>
                  <th>ชื่อ</th>
                  <th>พันธุ์</th>
                  <th>ราคาซื้อ</th>
                  <th>ราคาขาย</th>
                  <th>จำนวน</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.species}</td>
                    <td>{item.price_old}</td>
                    <td>{item.price_new}</td>
                    <td>{item.amount}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        className="me-2 mr-1 btn btn-warning"
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
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LayoutPage;
