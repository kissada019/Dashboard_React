// RegisterForm.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

/* libs */
import { useDispatch } from "react-redux";

/* redux */
// import { onGetAllCat } from "redux/slices/catSlice";
import { onGetAllCat } from 'redux/slices/catSlice';

const LayoutPage = () => {
    /* libs */
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic สำหรับตรวจสอบข้อมูลหรือส่งข้อมูลไปยัง backend
        console.log(formData);
    };

    React.useEffect(() => {

        dispatch(onGetAllCat()).then(response => {
            console.log("onInsertSprint response : ", response);
        })
    });




    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });



    return (
        // <Container className="mt-5">
        //     <Row className="justify-content-md-center">
        //         <Col md={6}>
        //             <h2>Register</h2>
        //             <Form onSubmit={handleSubmit}>
        //                 <Form.Group controlId="formUsername" className="mb-3">
        //                     <Form.Label>Username</Form.Label>
        //                     <Form.Control
        //                         type="text"
        //                         placeholder="Enter username"
        //                         name="username"
        //                         value={formData.username}
        //                         onChange={handleChange}
        //                         required
        //                     />
        //                 </Form.Group>

        //                 <Form.Group controlId="formEmail" className="mb-3">
        //                     <Form.Label>Email address</Form.Label>
        //                     <Form.Control
        //                         type="email"
        //                         placeholder="Enter email"
        //                         name="email"
        //                         value={formData.email}
        //                         onChange={handleChange}
        //                         required
        //                     />
        //                 </Form.Group>

        //                 <Form.Group controlId="formPassword" className="mb-3">
        //                     <Form.Label>Password</Form.Label>
        //                     <Form.Control
        //                         type="password"
        //                         placeholder="Password"
        //                         name="password"
        //                         value={formData.password}
        //                         onChange={handleChange}
        //                         required
        //                     />
        //                 </Form.Group>

        //                 <Form.Group controlId="formConfirmPassword" className="mb-3">
        //                     <Form.Label>Confirm Password</Form.Label>
        //                     <Form.Control
        //                         type="password"
        //                         placeholder="Confirm Password"
        //                         name="confirmPassword"
        //                         value={formData.confirmPassword}
        //                         onChange={handleChange}
        //                         required
        //                     />
        //                 </Form.Group>

        //                 <Button variant="primary" type="submit">
        //                     Register
        //                 </Button>
        //             </Form>
        //         </Col>
        //     </Row>
        // </Container>



        <div className="register-container justify-content-md-center" style={{ width: '400px', margin: '0 auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
            <h2>Create an Account</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Your Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                    <Form.Label>Repeat your password</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Repeat your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    style={{ background: 'linear-gradient(to right, #00C9A7, #92FE9D)' }}
                >
                    REGISTER
                </Button>
            </Form>
            <p style={{ marginTop: '10px' }}>
                Have already an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
};

export default LayoutPage;

