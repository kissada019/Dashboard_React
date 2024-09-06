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
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4" className=" text-center">
                                    Login
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
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
                                        <Button
                                            className="btn btn-fill pull-right btn-sm m-1 mt-3"
                                            variant="info"
                                        >
                                            Register
                                        </Button>
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
