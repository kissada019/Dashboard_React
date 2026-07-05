import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Leaf, Lock, Mail, MapPin, Phone, UserPlus } from "lucide-react";
import { useHistory } from "react-router-dom";
import service from "../../utils/service";
import alert from "../../utils/alert";
import {
  getDistrictOptions,
  getSubdistrictOptions,
  provinceOptions,
} from "../../utils/thailandAddress";

const initialForm = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
  province: "",
  district: "",
  subdistrict: "",
  postal_code: "",
};

const inputStyle = {
  borderRadius: 12,
  borderColor: "#d7e7d2",
  minHeight: 48,
  fontSize: 15,
};

const SignupPage = () => {
  const history = useHistory();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "province") {
        return { ...prev, province: value, district: "", subdistrict: "", postal_code: "" };
      }
      if (name === "district") {
        return { ...prev, district: value, subdistrict: "", postal_code: "" };
      }
      if (name === "subdistrict") {
        const subdistrict = getSubdistrictOptions(prev.province, prev.district).find(
          (item) => item.label === value
        );
        return {
          ...prev,
          subdistrict: value,
          postal_code: subdistrict?.postalCode ? String(subdistrict.postalCode) : "",
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const validate = () => {
    const requiredFields = [
      ["username", "ชื่อผู้ใช้"],
      ["email", "อีเมล"],
      ["password", "รหัสผ่าน"],
      ["first_name", "ชื่อ"],
      ["last_name", "นามสกุล"],
      ["phone", "เบอร์โทรศัพท์"],
      ["address", "ที่อยู่"],
      ["province", "จังหวัด"],
      ["district", "อำเภอ/เขต"],
      ["subdistrict", "แขวง/ตำบล"],
      ["postal_code", "รหัสไปรษณีย์"],
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
        "api/users",
        {
          username: form.username.trim(),
          email: form.email.trim(),
          password_hash: form.password,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          province: form.province.trim(),
          district: form.district.trim(),
          subdistrict: form.subdistrict.trim(),
          postal_code: form.postal_code.trim(),
        },
        true,
        false
      );
      await alert.custom.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: "เข้าสู่ระบบเพื่อเริ่มเลือกซื้อต้นไม้ได้เลย",
        confirmButtonText: "ไปหน้าเข้าสู่ระบบ",
        confirmButtonColor: "#4a7c2a",
      });
      history.push("/admin/login");
    } catch (error) {
      alert.custom.fire({
        icon: "error",
        title: "สมัครสมาชิกไม่สำเร็จ",
        text: error?.response?.data?.message || error?.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid className="p-4" style={{ background: "#f7faf6", minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          <Card style={{ border: "1px solid #d7e7d2", borderRadius: 12 }}>
            <Card.Header
              className="d-flex align-items-center"
              style={{ background: "#eef7eb", borderBottom: "1px solid #d7e7d2" }}
            >
              <Leaf size={26} style={{ marginRight: 10, color: "#4a7c2a" }} />
              <div>
                <h3 style={{ margin: 0, color: "#234018", fontWeight: 800 }}>
                  สมัครสมาชิก
                </h3>
                <div style={{ color: "#60725a" }}>
                  กรอกข้อมูลบัญชีและที่อยู่สำหรับจัดส่ง
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
                      <Form.Control name="username" value={form.username} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        <Lock size={16} style={{ marginRight: 6 }} />
                        รหัสผ่าน
                      </Form.Label>
                      <Form.Control type="password" name="password" value={form.password} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        ชื่อ
                      </Form.Label>
                      <Form.Control name="first_name" value={form.first_name} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        นามสกุล
                      </Form.Label>
                      <Form.Control name="last_name" value={form.last_name} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        <Mail size={16} style={{ marginRight: 6 }} />
                        อีเมล
                      </Form.Label>
                      <Form.Control type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        <Phone size={16} style={{ marginRight: 6 }} />
                        เบอร์โทรศัพท์
                      </Form.Label>
                      <Form.Control name="phone" value={form.phone} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                    <MapPin size={16} style={{ marginRight: 6 }} />
                    ที่อยู่
                  </Form.Label>
                  <Form.Control as="textarea" rows={3} name="address" value={form.address} onChange={handleChange} style={inputStyle} />
                </Form.Group>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>จังหวัด</Form.Label>
                      <Form.Select name="province" value={form.province} onChange={handleChange} style={inputStyle}>
                        <option value="">เลือกจังหวัด</option>
                        {provinceOptions.map((province) => (
                          <option key={province.code} value={province.label}>{province.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>อำเภอ/เขต</Form.Label>
                      <Form.Select name="district" value={form.district} onChange={handleChange} disabled={!form.province} style={inputStyle}>
                        <option value="">เลือกอำเภอ/เขต</option>
                        {getDistrictOptions(form.province).map((district) => (
                          <option key={district.code} value={district.label}>{district.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>แขวง/ตำบล</Form.Label>
                      <Form.Select name="subdistrict" value={form.subdistrict} onChange={handleChange} disabled={!form.district} style={inputStyle}>
                        <option value="">เลือกแขวง/ตำบล</option>
                        {getSubdistrictOptions(form.province, form.district).map((subdistrict) => (
                          <option key={subdistrict.code} value={subdistrict.label}>{subdistrict.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>รหัสไปรษณีย์</Form.Label>
                      <Form.Control name="postal_code" value={form.postal_code} readOnly style={{ ...inputStyle, background: "#f5f8f3" }} />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-3" style={{ gap: 10 }}>
                  <Button variant="light" onClick={() => history.push("/admin/login")}>
                    กลับไปเข้าสู่ระบบ
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    style={{ backgroundColor: "#4a7c2a", borderColor: "#4a7c2a", fontWeight: 800 }}
                  >
                    {saving ? "กำลังสมัคร..." : "สมัครสมาชิก"}
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

export default SignupPage;
