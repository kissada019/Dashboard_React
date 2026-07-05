import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Edit3, MapPin, Save, X } from "lucide-react";
import service from "../../utils/service";
import userInfoStorage from "../../storage/userInfoStorage";
import alert from "../../utils/alert";
import {
  getDistrictOptions,
  getSubdistrictOptions,
  provinceOptions,
} from "../../utils/thailandAddress";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  subdistrict: "",
  district: "",
  province: "",
  postal_code: "",
};

const FIELD_LABELS = [
  ["first_name", "ชื่อ"],
  ["last_name", "นามสกุล"],
  ["email", "อีเมล"],
  ["phone", "เบอร์โทรศัพท์"],
  ["address", "ที่อยู่"],
  ["province", "จังหวัด"],
  ["district", "อำเภอ/เขต"],
  ["subdistrict", "แขวง/ตำบล"],
  ["postal_code", "รหัสไปรษณีย์"],
];

const toForm = (user = {}) => ({
  first_name: user.first_name || "",
  last_name: user.last_name || "",
  email: user.email || "",
  phone: user.phone || "",
  address: user.address || "",
  subdistrict: user.subdistrict || "",
  district: user.district || "",
  province: user.province || "",
  postal_code: user.postal_code || "",
});

const AddressPage = () => {
  const userInfo = userInfoStorage.get() || {};
  const [form, setForm] = useState({ ...EMPTY_FORM, ...toForm(userInfo) });
  const [savedForm, setSavedForm] = useState({ ...EMPTY_FORM, ...toForm(userInfo) });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!userInfo.id) return;

    setLoading(true);
    service.api
      .get(`api/users/${userInfo.id}`, false, false)
      .then((user) => {
        const nextForm = toForm(user);
        setForm(nextForm);
        setSavedForm(nextForm);
        userInfoStorage.update(user);
      })
      .catch(() => {
        alert.custom.fire({
          icon: "error",
          title: "โหลดข้อมูลที่อยู่ไม่สำเร็จ",
          text: "กรุณาลองใหม่อีกครั้ง",
        });
      })
      .finally(() => setLoading(false));
  }, [userInfo.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "province") {
        return {
          ...prev,
          province: value,
          district: "",
          subdistrict: "",
          postal_code: "",
        };
      }
      if (name === "district") {
        return {
          ...prev,
          district: value,
          subdistrict: "",
          postal_code: "",
        };
      }
      if (name === "subdistrict") {
        const subdistrict = getSubdistrictOptions(prev.province, prev.district).find(
          (item) => item.label === value
        );
        return {
          ...prev,
          subdistrict: value,
          postal_code: subdistrict?.postalCode ? String(subdistrict.postalCode) : prev.postal_code,
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCancel = () => {
    setForm(savedForm);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userInfo.id) return;

    setSaving(true);
    try {
      const payload = Object.entries(form).reduce((acc, [key, value]) => {
        acc[key] = String(value || "").trim();
        return acc;
      }, {});
      const updatedUser = await service.api.put(`api/users/${userInfo.id}`, payload);
      const nextForm = toForm(updatedUser);
      setForm(nextForm);
      setSavedForm(nextForm);
      userInfoStorage.update(updatedUser);
      setIsEditing(false);
      alert.custom.fire({
        icon: "success",
        title: "บันทึกข้อมูลที่อยู่แล้ว",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      alert.custom.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: error?.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderDisplayValue = (key) => {
    const value = form[key];
    if (!value) return <span style={{ color: "#94a18e" }}>ยังไม่ได้ระบุ</span>;
    return <span style={{ color: "#243d19", fontWeight: 700 }}>{value}</span>;
  };

  const renderFormControl = (key) => {
    const commonStyle = {
      width: "100%",
      minWidth: 0,
      display: "block",
      borderRadius: 12,
      borderColor: "#d7e7d2",
      backgroundColor: "#fff",
      color: "#2d5016",
      fontSize: 16,
      fontWeight: 600,
      minHeight: key === "address" ? undefined : 52,
      padding: "10px 14px",
      boxShadow: "0 1px 0 rgba(74, 124, 42, 0.06)",
    };

    if (key === "province") {
      return (
        <Form.Select name={key} value={form[key]} onChange={handleChange} style={commonStyle}>
          <option value="">เลือกจังหวัด</option>
          {provinceOptions.map((province) => (
            <option key={province.code} value={province.label}>
              {province.label}
            </option>
          ))}
        </Form.Select>
      );
    }

    if (key === "district") {
      const options = getDistrictOptions(form.province);
      return (
        <Form.Select
          name={key}
          value={form[key]}
          onChange={handleChange}
          disabled={!form.province}
          style={commonStyle}
        >
          <option value="">เลือกอำเภอ/เขต</option>
          {options.map((district) => (
            <option key={district.code} value={district.label}>
              {district.label}
            </option>
          ))}
        </Form.Select>
      );
    }

    if (key === "subdistrict") {
      const options = getSubdistrictOptions(form.province, form.district);
      return (
        <Form.Select
          name={key}
          value={form[key]}
          onChange={handleChange}
          disabled={!form.district}
          style={commonStyle}
        >
          <option value="">เลือกแขวง/ตำบล</option>
          {options.map((subdistrict) => (
            <option key={subdistrict.code} value={subdistrict.label}>
              {subdistrict.label}
            </option>
          ))}
        </Form.Select>
      );
    }

    return (
      <Form.Control
        as={key === "address" ? "textarea" : "input"}
        rows={key === "address" ? 3 : undefined}
        name={key}
        value={form[key]}
        onChange={handleChange}
        readOnly={key === "postal_code"}
        style={commonStyle}
      />
    );
  };

  return (
    <Container fluid className="p-4" style={{ background: "#f7faf6", minHeight: "100vh" }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <h3 style={{ color: "#234018", fontWeight: 800, marginBottom: 6 }}>
            ข้อมูลที่อยู่
          </h3>
          <div style={{ color: "#60725a" }}>
            ใช้เป็นค่าเริ่มต้นตอนกรอกข้อมูลจัดส่ง
          </div>
        </div>

        {isEditing ? (
          <div className="d-flex" style={{ gap: 8 }}>
            <Button variant="light" onClick={handleCancel} disabled={saving}>
              <X size={16} style={{ marginRight: 6 }} />
              ยกเลิก
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              style={{
                backgroundColor: "#2f6f3e",
                borderColor: "#2f6f3e",
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                padding: "10px 18px",
                borderRadius: 8,
              }}
            >
              <Save size={16} style={{ marginRight: 6, color: "#fff" }} />
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: "#2f6f3e",
              borderColor: "#2f6f3e",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              padding: "12px 22px",
              borderRadius: 8,
            }}
          >
            <Edit3 size={18} style={{ marginRight: 8, color: "#fff" }} />
            แก้ไขข้อมูล
          </Button>
        )}
      </div>

      <Card style={{ border: "1px solid #d7e7d2", borderRadius: 8 }}>
        <Card.Header
          className="d-flex align-items-center"
          style={{ background: "#eef7eb", borderBottom: "1px solid #d7e7d2" }}
        >
          <MapPin size={20} style={{ marginRight: 8, color: "#4a7c2a" }} />
          <strong style={{ color: "#234018" }}>ที่อยู่สำหรับจัดส่ง</strong>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#4a7c2a" }} />
            </div>
          ) : isEditing ? (
            <Form>
              <Row>
                {FIELD_LABELS.map(([key, label]) => (
                  <Col md={key === "address" ? 12 : 6} key={key}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#2d5016", fontWeight: 700 }}>
                        {label}
                      </Form.Label>
                      {renderFormControl(key)}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </Form>
          ) : (
            <Row>
              {FIELD_LABELS.map(([key, label]) => (
                <Col md={key === "address" ? 12 : 6} key={key} className="mb-3">
                  <div
                    style={{
                      border: "1px solid #e3eedf",
                      borderRadius: 8,
                      background: "#fbfdf9",
                      padding: "12px 14px",
                      minHeight: 74,
                    }}
                  >
                    <div style={{ color: "#60725a", fontSize: 13, marginBottom: 6 }}>
                      {label}
                    </div>
                    {renderDisplayValue(key)}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddressPage;
