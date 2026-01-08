import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import alert from "../../utils/alert";
import { useFormik } from "formik";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { onCreateTree, onGetTreeById, onUpdateTree } from "../../redux/slices/treeSlice";
import { 
  Sprout, 
  DollarSign, 
  Plus, 
  ArrowLeft,
  Leaf,
  Hash,
  Save
} from "lucide-react";

function AddTree() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams(); // Get ID from URL if editing
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState(null);

  const isEditMode = !!id;

  const initialValues = {
    name: "",
    species: "",
    price_old: 0,
    price_new: 0,
    amount: 0,
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => handleSubmitData(values),
  });

  // Fetch tree data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      dispatch(onGetTreeById(id)).then((response) => {
        console.log("onGetTreeById response: ", response?.payload);
        if (response?.payload) {
          const data = response.payload;
          setTreeData(data);
          // Update formik values with fetched data
          formik.setValues({
            name: data.name || "",
            species: data.species || "",
            price_old: data.price_old || 0,
            price_new: data.price_new || 0,
            amount: data.amount || 0,
          });
        }
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching tree data: ", error);
        setLoading(false);
        alert.custom.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถโหลดข้อมูลต้นไม้ได้",
          confirmButtonText: "ตกลง",
        });
      });
    }
  }, [id, isEditMode, dispatch, formik]);

  const handleBackClick = () => {
    history.push("/admin/tree2");
  };

  const handleSubmitData = (values) => {
    // Validate that required fields are filled
    if (!values.name || !values.species) {
      alert.custom.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณากรอกชื่อต้นไม้และพันธุ์",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // Convert string numbers to actual numbers
    const submitValues = {
      ...values,
      price_old: parseFloat(values.price_old) || 0,
      price_new: parseFloat(values.price_new) || 0,
      amount: parseInt(values.amount) || 0,
    };

    if (isEditMode) {
      // Update existing tree
      dispatch(onUpdateTree({ id, ...submitValues })).then((response) => {
        console.log("onUpdateTree response: ", response);
        if (response.payload) {
          alert.custom
            .fire({
              icon: "success",
              title: "อัพเดทเรียบร้อย!",
              text: "ข้อมูลต้นไม้ถูกอัพเดทเรียบร้อยแล้ว",
              confirmButtonText: "ตกลง",
            })
            .then((result) => {
              if (result.isConfirmed) {
                history.push("/admin/tree2");
              }
            });
        } else {
          alert.custom.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถอัพเดทข้อมูลต้นไม้ได้ กรุณาลองใหม่อีกครั้ง",
            confirmButtonText: "ตกลง",
          });
        }
      });
    } else {
      // Create new tree
      dispatch(onCreateTree(submitValues)).then((response) => {
        console.log("onCreateTree response: ", response);
        if (response.payload) {
          alert.custom
            .fire({
              icon: "success",
              title: "เพิ่มต้นไม้สำเร็จ!",
              text: "ต้นไม้ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว",
              confirmButtonText: "ตกลง",
            })
            .then((result) => {
              if (result.isConfirmed) {
                history.push("/admin/tree2");
              }
            });
        } else {
          alert.custom.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถเพิ่มต้นไม้ได้ กรุณาลองใหม่อีกครั้ง",
            confirmButtonText: "ตกลง",
          });
        }
      });
    }
  };

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
                        {isEditMode ? "แก้ไขต้นไม้" : "เพิ่มต้นไม้ใหม่"}
                      </Card.Title>
                      <p className="add-tree-subtitle mb-0">
                        {isEditMode ? "แก้ไขข้อมูลต้นไม้" : "กรอกข้อมูลต้นไม้ที่ต้องการเพิ่ม"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline-secondary"
                    className="btn-back-plant"
                    onClick={handleBackClick}
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
                <Form onSubmit={formik.handleSubmit} className="add-tree-form">
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
                          name="price_old"
                          id="price_old"
                          value={formik.values.price_old}
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
                          name="price_new"
                          id="price_new"
                          value={formik.values.price_new}
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
                          name="amount"
                          id="amount"
                          value={formik.values.amount}
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
                      onClick={handleBackClick}
                      size="lg"
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      className="btn-submit-plant"
                      type="submit"
                      size="lg"
                    >
                      {isEditMode ? (
                        <>
                          <Save size={20} className="mr-2" />
                          บันทึก
                        </>
                      ) : (
                        <>
                          <Plus size={20} className="mr-2" />
                          เพิ่มต้นไม้
                        </>
                      )}
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

export default AddTree;
