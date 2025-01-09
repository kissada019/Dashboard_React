import React, { useEffect } from "react";
import ChartistGraph from "react-chartist";
import { useRecoilState, useRecoilValue } from "recoil";
/* hooks */
// import useAuth from "hooks/useAuth";
// import useAuth from "hooks/useAuth";
import useAuth from "hooks/useAuth";
import userInfoStorage from "storage/userInfoStorage";
// react-bootstrap components
import {
    Badge,
    Button,
    Card,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col,
    Form,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";


function LayoutPage() {

    /* libs */
    // const navigate = useNavigate();
    const auth = useAuth();

    const dispatch = useDispatch();

    const initialValues = {
        username: "",
        password: ""
    };

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialze: true,
        // validationSchema: validationSchema,
        onSubmit: (values) => handleSubmitData(values),
    });


    // React.useEffect(() => {
    //     // auth.logout();
    //     let userInfo = userInfoStorage.get();
    //     console.log("userInfo : ", userInfo)
    //     if (userInfo && !_.isEmpty(userInfo) && userInfo.token) {
    //         // navigate("/home");
    //     }
    // }, []);

    const handleSubmitData = (values) => {


        let request = {
            username: values.username,
            password: values.password,
        };

        console.log("event : ", request);

        auth.login(request).then((response) => {
            // setLoading(false);
            console.log("login response : ", response);
            if (response.success === true) {
                window.location.href = '/home'
            }
            else {
                formik.setErrors({ submit: response.message });
            }
        }).catch(error => {
            console.log("login error : ", error);
            // setLoading(false);
            formik.setErrors({ submit: error.message });
        });
    }


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col md="4" >
                        <Card className="login-user mt-4">
                            <Card.Body>
                                <div className="author">
                                    <img
                                        alt="..."
                                        className="avatar border-gray"
                                        src={require("assets/img/faces/face-3.jpg")}
                                    ></img>
                                </div>
                                <Card.Header>
                                    <Card.Title as="h4" className=" text-center">
                                        Login
                                    </Card.Title>
                                </Card.Header>

                                <form onSubmit={formik.handleSubmit}>
                                    <Row>
                                        <Col className="px-3" md="12">
                                            <Form.Group>
                                                <label>Username </label>
                                                <Form.Control
                                                    placeholder="Username"
                                                    id='username'
                                                    name='username'
                                                    type="text"
                                                    onChange={(e) => {
                                                        formik.handleChange(e)
                                                    }}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="px-3" md="12">
                                            <Form.Group>
                                                <label>Password </label>
                                                <Form.Control
                                                    placeholder="Password"
                                                    id='password'
                                                    name='password'
                                                    type="password"
                                                    onChange={(e) => {
                                                        formik.handleChange(e)
                                                    }}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Card.Title as="h4" className=" text-center">
                                        <Button
                                            className="btn btn-fill pull-right btn-sm m-1 mt-3"
                                            type="submit"
                                            variant="info"
                                        >
                                            Login
                                        </Button>

                                        <a href={`kanban`}>
                                            <Button
                                                className="btn btn-fill pull-right btn-sm m-1 mt-3"
                                                variant="info"
                                            >
                                                Register
                                            </Button>
                                        </a>

                                    </Card.Title>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default LayoutPage;
