import React, { useEffect } from "react";
import ChartistGraph from "react-chartist";
import { useRecoilState, useRecoilValue } from "recoil";
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


function LayoutPage() {

    const handleSubmit = (event) => {
        event.preventDefault();
        // alert(`The name you entered was: ${name}`)
        console.log("event ");
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

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col className="px-3" md="12">
                                            <Form.Group>
                                                <label>Username </label>
                                                <Form.Control
                                                    placeholder="Username"
                                                    id='username'
                                                    name='username'
                                                    type="text"
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
                                                    id='paasword'
                                                    name='paasword'
                                                    type="text"
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
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default LayoutPage;
