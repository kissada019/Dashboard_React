import React from "react";
/* hooks */
import { useDispatch, useSelector } from "react-redux";
import {
  onChangeLoginForm,
  onLogin,
  onResetLoginForm,
} from "../../../redux/slices/authSlice";
// react-bootstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useFormik } from "formik";
import { Leaf, User, Lock, LogIn } from "lucide-react";

function LayoutPage() {
  /* libs */
  const dispatch = useDispatch();
  const { form, loading } = useSelector((state) => state.auth);

  const initialValues = form;

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialze: true,
    onSubmit: (values) => handleSubmitData(values),
  });

  const handleSubmitData = (values) => {
    const request = {
      username: values.username,
      password: values.password,
    };

    console.log("login request:", {
      username: values.username,
      password: values.password,
    });

    dispatch(onLogin(request))
      .unwrap()
      .then((response) => {
        const token =
          response?.token ||
          response?.accessToken ||
          response?.responseObject?.token ||
          response?.responseObject?.accessToken;
        const success =
          response?.success === true ||
          response?.status === true ||
          Boolean(token);
        if (success) {
          dispatch(onResetLoginForm());
          window.location.href = "/home";
        } else {
          const message =
            response?.message ||
            response?.error ||
            "เข้าสู่ระบบไม่สำเร็จ";
          formik.setErrors({ submit: message });
        }
      })
      .catch((error) => {
        console.log("login error : ", error);
        formik.setErrors({ submit: error });
      });
  };

  return (
    <div className="login-page-wrapper">
      <Container fluid className="login-container">
        <Row className="d-flex justify-content-center align-items-center min-vh-100">
          <Col md="5" lg="4" xl="3">
            <Card className="login-card-plant">
              <div className="plant-decoration-top">
                <div className="plant-leaf leaf-1"></div>
                <div className="plant-leaf leaf-2"></div>
                <div className="plant-leaf leaf-3"></div>
              </div>
              
              <Card.Body className="login-card-body">
                <div className="login-header">
                  <div className="plant-icon-wrapper">
                    <Leaf size={48} className="plant-icon" />
                  </div>
                  <Card.Title as="h3" className="login-title">
                    ยินดีต้อนรับ
                  </Card.Title>
                  <p className="login-subtitle">เข้าสู่ระบบร้านขายต้นไม้</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="login-form">
                  <Form.Group className="mb-3 form-group-plant">
                    <Form.Label className="form-label-plant">
                      <User size={18} className="label-icon" />
                      ชื่อผู้ใช้
                    </Form.Label>
                    <Form.Control
                      placeholder="กรุณากรอกชื่อผู้ใช้"
                      id="username"
                      name="username"
                      type="text"
                      className="form-control-plant"
                      value={formik.values.username}
                      onChange={(e) => {
                        formik.handleChange(e);
                        dispatch(
                          onChangeLoginForm({
                            name: "username",
                            value: e.target.value,
                          })
                        );
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4 form-group-plant">
                    <Form.Label className="form-label-plant">
                      <Lock size={18} className="label-icon" />
                      รหัสผ่าน
                    </Form.Label>
                    <Form.Control
                      placeholder="กรุณากรอกรหัสผ่าน"
                      id="password"
                      name="password"
                      type="password"
                      className="form-control-plant"
                      value={formik.values.password}
                      onChange={(e) => {
                        formik.handleChange(e);
                        dispatch(
                          onChangeLoginForm({
                            name: "password",
                            value: e.target.value,
                          })
                        );
                      }}
                    />
                  </Form.Group>

                  {formik.errors.submit && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {formik.errors.submit}
                    </div>
                  )}

                  <Button
                    className="btn-login-plant w-100 mb-3"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    <LogIn size={20} className="me-2" />
                    เข้าสู่ระบบ
                  </Button>

                  <div className="text-center">
                    <a href="/admin/signup" className="register-link">
                      ยังไม่มีบัญชี? สมัครสมาชิก
                    </a>
                  </div>
                </form>
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

export default LayoutPage;
