import React from "react";
import numeral from "numeral";
import { useHistory } from "react-router-dom";
import alert from "../../utils/alert";
// react-bootstrap components
import { useFormik } from "formik";
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { onGetAllTree, onCreateTree } from "../../redux/slices/treeSlice";

function User() {
  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = {
    name: "",
    species: "",
    price_old: 0,
    price_new: 0,
    amount: 0,
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialze: true,
    // validationSchema: validationSchema,
    onSubmit: (values) => handleSubmitData(values),
  });


  const handleCreateClick = () => {
    history.push("/admin/tree");
  };

  const handleSubmitData = (values) => {
    // console.log("values : ", values);
    dispatch(onCreateTree(values)).then((response) => {
      console.log("onInsertProjectAndSystem response: ", response);
      if (response.payload) {
        alert.custom
          .fire({
            icon: "success",
            title: "Tree created successfully!",
            confirmButtonText: "ยืนยัน",
          })
          .then((result) => {
            if (result.isConfirmed) {
              history.push("/admin/tree");
            }
          });
      }
    });
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <div className="places-buttons">
                  <Row className="justify-content-between mb-3">
                    <Col lg="3" md="3">
                      <Card.Title as="h4">เพิ่มต้นไม้</Card.Title>
                    </Col>
                    <Col lg="2" md="2">
                      <div className="numbers text-right">
                        <Button
                          variant="outline-primary"
                          className="btn btn-primary"
                          onClick={handleCreateClick}
                          size="sm"
                        >
                          Back
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label>ชื่อ</label>
                        <Form.Control
                          placeholder="ชื่อ"
                          name="name"
                          id="name"
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="3">
                      <Form.Group>
                        <label>พันธุ์</label>
                        <Form.Control
                          placeholder="พันธุ์"
                          name="species"
                          id="species"
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>ราคาซื้อ</label>
                        <Form.Control
                          placeholder="ราคาซื้อ"
                          name="price_old"
                          // id="price_old"
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="6">
                      <Form.Group>
                        <label>ราคาขาย</label>
                        <Form.Control
                          placeholder="ราคาขาย"
                          name="price_new"
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>จำนวน</label>
                        <Form.Control
                          placeholder="จำนวน"
                          name="amount"
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    className="btn-fill pull-right mt-2"
                    type="submit"
                    variant="info"
                  >
                    เพิ่ม
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <div className="card-image">
                <img
                  alt="..."
                  src={require("assets/img/photo-1431578500526-4d9613015464.jpeg")}
                ></img>
              </div>
              <Card.Body>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={require("assets/img/faces/face-3.jpg")}
                    ></img>
                    <h5 className="title">Mike Andrew</h5>
                  </a>
                  <p className="description">michael24</p>
                </div>
                <p className="description text-center">
                  "Lamborghini Mercy <br></br>
                  Your chick she so thirsty <br></br>
                  I'm in that two seat Lambo"
                </p>
              </Card.Body>
              <hr></hr>
              <div className="button-container mr-auto ml-auto">
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-facebook-square"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-google-plus-square"></i>
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default User;
