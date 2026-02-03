import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import alert from "../../utils/alert";
import { useFormik } from "formik";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onGetTreeById, onUpdateTree } from "../../redux/slices/treeSlice"; // Import the function to fetch tree details
import { ArrowLeft, DollarSign, Hash, Leaf, Save, Sprout } from "lucide-react";

function Edit() {
  const dispatch = useDispatch();
  const history = useHistory();
  // const navigate = useNavigate();
  const { id } = useParams(); // Get ID from the URL
  const { tableTree, loading } = useSelector((state) => state.treeSlice);
  const data = tableTree.detail || {};

  const formValues = useMemo(() => {
    return {
      name: data?.name || "",
      species: data?.species || "",
      buy_price: data?.buy_price ?? data?.buy_price ?? 0,
      sell_price: data?.sell_price ?? data?.sell_price ?? 0,
      quantity: data?.quantity ?? data?.quantity ?? 0,
    };
  }, [data]);

  const formik = useFormik({
    initialValues: formValues,
    enableReinitialize: true, // Allows formik to update when treeData changes
    onSubmit: (values) => handleSubmitData(values),
  });

  useEffect(() => {
    if (id) {
      dispatch(onGetTreeById(id));
    }
  }, [id]);

  const handleCreateClick = () => {
    history.push("/admin/tree");
  };

  const handleSubmitData = (values) => {
    const submitValues = {
      ...values,
      buy_price: Number(values.buy_price) || 0,
      sell_price: Number(values.sell_price) || 0,
      quantity: Number(values.quantity) || 0,
    };
    dispatch(onUpdateTree({ id, ...submitValues })).then((response) => {
      if (response.payload) {
        alert.custom
          .fire({
            icon: "success",
            title: "อัพเดทเรียบร้อย",
            confirmButtonText: "ยืนยัน",
          })
          .then((result) => {
            if (result.isConfirmed) {
              history.push("/admin/tree");
            }
          });
      }
    });
    // console.log("test");
  };

  // if (loading) return <p>Loading...</p>;

  return (
    <div className="add-tree-page-wrapper">
      <Container fluid className="add-tree-container">
        <Row className="d-flex justify-content-center">
          <Col md="10" lg="8" xl="7">
            <Card className="add-tree-card-plant">
              <div className="plant-decoration-top">
                <div className="plant-leaf leaf-1"></div>
                <div className="plant-leaf leaf-2"></div>
                <div className="plant-leaf leaf-3"></div>
              </div>

              <Card.Header className="add-tree-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="plant-icon-wrapper-small mr-3">
                      <Sprout size={32} className="plant-icon" />
                    </div>
                    <div>
                      <Card.Title as="h3" className="add-tree-title mb-0">
                        แก้ไขต้นไม้
                      </Card.Title>
                      <p className="add-tree-subtitle mb-0">
                        แก้ไขข้อมูลต้นไม้
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline-secondary"
                    className="btn-back-plant"
                    onClick={handleCreateClick}
                    size="sm"
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    กลับ
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="add-tree-card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">กำลังโหลด...</span>
                    </div>
                    <p className="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : (
                  <Form
                    onSubmit={formik.handleSubmit}
                    className="add-tree-form"
                  >
                    <Row>
                      <Col md="6" className="mb-3">
                        <Form.Group className="form-group-plant">
                          <Form.Label className="form-label-plant">
                            <Leaf size={18} className="label-icon" />
                            ชื่อต้นไม้ <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            placeholder="เช่น ต้นมะม่วง"
                            name="name"
                            id="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            type="text"
                            className="form-control-plant"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md="6" className="mb-3">
                        <Form.Group className="form-group-plant">
                          <Form.Label className="form-label-plant">
                            <Sprout size={18} className="label-icon" />
                            พันธุ์ <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            placeholder="เช่น มะม่วงน้ำดอกไม้"
                            name="species"
                            id="species"
                            value={formik.values.species}
                            onChange={formik.handleChange}
                            type="text"
                            className="form-control-plant"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6" className="mb-3">
                        <Form.Group className="form-group-plant">
                          <Form.Label className="form-label-plant">
                            <DollarSign size={18} className="label-icon" />
                            ราคาซื้อ (บาท)
                          </Form.Label>
                          <Form.Control
                            placeholder="0"
                            name="buy_price"
                            id="buy_price"
                            value={formik.values.buy_price}
                            onChange={formik.handleChange}
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-control-plant"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="6" className="mb-3">
                        <Form.Group className="form-group-plant">
                          <Form.Label className="form-label-plant">
                            <DollarSign size={18} className="label-icon" />
                            ราคาขาย (บาท)
                          </Form.Label>
                          <Form.Control
                            placeholder="0"
                            name="sell_price"
                            id="sell_price"
                            value={formik.values.sell_price}
                            onChange={formik.handleChange}
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-control-plant"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6" className="mb-4">
                        <Form.Group className="form-group-plant">
                          <Form.Label className="form-label-plant">
                            <Hash size={18} className="label-icon" />
                            จำนวน (ต้น)
                          </Form.Label>
                          <Form.Control
                            placeholder="0"
                            name="quantity"
                            id="quantity"
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            type="number"
                            min="0"
                            className="form-control-plant"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        variant="outline-secondary"
                        className="btn-cancel-plant mr-3"
                        onClick={handleCreateClick}
                        size="lg"
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        className="btn-submit-plant"
                        type="submit"
                        size="lg"
                      >
                        <Save size={20} className="mr-2" />
                        บันทึก
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>

              <div className="plant-decoration-bottom">
                <div className="plant-leaf leaf-4"></div>
                <div className="plant-leaf leaf-5"></div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Edit;
