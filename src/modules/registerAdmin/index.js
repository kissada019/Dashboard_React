import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Lock, Mail, Phone, ShieldCheck, UserPlus } from "lucide-react";
import service from "../../utils/service";
import alert from "../../utils/alert";

const initialForm = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
};

const inputStyle = {
  borderRadius: 10,
  borderColor: "#d7e7d2",
  minHeight: 46,
  fontSize: 15,
};

const RegisterAdmin = () => {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const requiredFields = [
      ["username", "ชื่อผู้ใช้"],
      ["email", "อีเมล"],
      ["password", "รหัสผ่าน"],
    ];
    const missing = requiredFields.find(([key]) => !String(form[key] || "").trim());
    return missing?.[1] || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingLabel = validate();
    if (missingLabel) {
      alert.custom.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: `กรุณากรอก${missingLabel}`,
      });
      return;
    }

    setSaving(true);
    try {
      await service.api.post(
        "api/admin/users/admin",
        {
          username: form.username.trim(),
          email: form.email.trim(),
          password_hash: form.password,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
        },
        true,
        false
      );
      await alert.custom.fire({
        icon: "success",
        title: "เพิ่มผู้ดูแลสำเร็จ",
        text: "บัญชีนี้ได้รับ role admin แล้ว",
        confirmButtonColor: "#4a7c2a",
      });
      setForm(initialForm);
    } catch (error) {
      alert.custom.fire({
        icon: "error",
        title: "เพิ่มผู้ดูแลไม่สำเร็จ",
        text: error?.response?.data?.message || error?.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid className="p-4" style={{ background: "#f7faf6", minHeight: "100vh" }}>
      <Row>
        <Col lg={8} xl={7}>
          <Card style={{ border: "1px solid #d7e7d2", borderRadius: 8 }}>
            <Card.Header
              className="d-flex align-items-center"
              style={{ background: "#eef7eb", borderBottom: "1px solid #d7e7d2" }}
            >
              <ShieldCheck size={26} style={{ marginRight: 10, color: "#4a7c2a" }} />
              <div>
                <h3 style={{ margin: 0, color: "#234018", fontWeight: 800 }}>
                  เพิ่มผู้ดูแล
                </h3>
                <div style={{ color: "#60725a" }}>
                  สร้างบัญชีใหม่พร้อม role admin
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        <UserPlus size={16} style={{ marginRight: 6 }} />
                        ชื่อผู้ใช้
                      </Form.Label>
                      <Form.Control
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        <Lock size={16} style={{ marginRight: 6 }} />
                        รหัสผ่าน
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        ชื่อ
                      </Form.Label>
                      <Form.Control
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        นามสกุล
                      </Form.Label>
                      <Form.Control
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        <Mail size={16} style={{ marginRight: 6 }} />
                        อีเมล
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        <Phone size={16} style={{ marginRight: 6 }} />
                        เบอร์โทรศัพท์
                      </Form.Label>
                      <Form.Control
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-3">
                  <Button
                    type="submit"
                    disabled={saving}
                    style={{
                      backgroundColor: "#4a7c2a",
                      borderColor: "#4a7c2a",
                      color: "#ffffff",
                      fontWeight: 800,
                      minWidth: 170,
                      minHeight: 48,
                      borderRadius: 10,
                      boxShadow: "0 8px 18px rgba(74, 124, 42, 0.22)",
                    }}
                  >
                    {saving ? "กำลังเพิ่ม..." : "เพิ่มผู้ดูแล"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterAdmin;
