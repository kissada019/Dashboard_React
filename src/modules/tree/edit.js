import React, { useEffect, useState } from "react";
import numeral from "numeral";
import { useParams } from "react-router-dom";
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
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onGetTreeById } from "../../redux/slices/treeSlice"; // Import the function to fetch tree details

function Edit() {
    const dispatch = useDispatch();
    const history = useHistory();
    // const navigate = useNavigate();
    const { id } = useParams(); // Get ID from the URL
    const [data, setData] = useState([]);

    // Fetch tree data from Redux store


    const formik = useFormik({
        initialValues: {
            name: data?.name || "",
            species: data?.species || "",
            price_old: data?.price_old || 0,
            price_new: data?.price_new || 0,
            amount: data?.amount || 0,
        },
        enableReinitialize: true, // Allows formik to update when treeData changes
        onSubmit: (values) => handleSubmitData(values),
    });

    useEffect(() => {
        dispatch(onGetTreeById(id)).then((response) => {
            console.log("onGetAllTree response : ", response?.payload);
            setData(response?.payload);
        });
    }, []);


    const handleCreateClick = () => {
        history.push("/admin/tree");
    };


    const handleSubmitData = (values) => {
        // dispatch(onUpdateTree({ id, ...values })).then((response) => {
        //     if (response.payload) {
        //         alert.custom
        //             .fire({
        //                 icon: "success",
        //                 title: "Tree updated successfully!",
        //                 confirmButtonText: "ยืนยัน",
        //             })
        //             .then((result) => {
        //                 if (result.isConfirmed) {
        //                     // navigate("/admin/tree");
        //                 }
        //             });
        //     }
        // });
        console.log("test");

    };

    // if (loading) return <p>Loading...</p>;

    return (
        <Container fluid>
            <Row>
                <Col md="8">
                    <Card>
                        <Card.Header>
                            <div className="places-buttons">
                                <Row className="justify-content-between mb-3">
                                    <Col lg="3" md="3">
                                        <Card.Title as="h4">แก้ไขต้นไม้</Card.Title>
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
                                {/* <Row className="justify-content-end mt-2 mb-3">
                                    <Col lg="3" md="3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                    </Col>
                                </Row> */}
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
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                type="text"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="px-1" md="3">
                                        <Form.Group>
                                            <label>พันธุ์</label>
                                            <Form.Control
                                                placeholder="พันธุ์"
                                                name="species"
                                                id="species"
                                                value={formik.values.species}
                                                onChange={formik.handleChange}
                                                type="text"
                                            />
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
                                                value={formik.values.price_old}
                                                onChange={formik.handleChange}
                                                type="number"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="pl-1" md="6">
                                        <Form.Group>
                                            <label>ราคาขาย</label>
                                            <Form.Control
                                                placeholder="ราคาขาย"
                                                name="price_new"
                                                value={formik.values.price_new}
                                                onChange={formik.handleChange}
                                                type="number"
                                            />
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
                                                value={formik.values.amount}
                                                onChange={formik.handleChange}
                                                type="number"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button
                                    className="btn-fill pull-right mt-2"
                                    type="submit"
                                    variant="info"
                                >
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                                <div className="clearfix"></div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Edit;