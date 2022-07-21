import React, { Component } from "react";

import { Form, Button, Row, Container, Col } from "react-bootstrap";
import { Login } from "../../state/actions/authActions";
import { connect } from "react-redux";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
//import emiralogo from "../../assets/images/emiralogo.jpg";

class SignIn extends Component {
    state = {
        email: "",
        password: "",
    };

    handleSubmit = (e) => {

        this.props.login({
            email: this.state.email,
            password: this.state.password,
        });
        e.preventDefault();
    };

    render() {

        return (
            <div>
                {this.props.auth.loading ? (
                    <Loading />
                ) : (

                    <div>
                        <Header />
                        <Container>
                            <Row className="justify-content-md-center">
                                <Col xs lg="4">
                                    <Form id="loginform" onSubmit={this.handleSubmit}>
                                        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                                            {/* <img
                                                src={emiralogo}
                                                alt="Emira"
                                                style={{ height: "4rem", width: "auto" }}
                                            /> */}
                                            <h5>
                                                Welcome To Blog MERN
                                            </h5>
                                        </div>

                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label cypresstext="email">Email address</Form.Label>
                                            <Form.Control
                                                value={this.state.email}
                                                required
                                                type="email"
                                                onChange={(value) => {
                                                    this.setState({
                                                        email: value.target.value,
                                                    });
                                                }}
                                                placeholder="Enter email"
                                            />
                                        </Form.Group>
                                        {
                                            <Form.Group
                                                className="mb-3"
                                                controlId="formBasicPassword"
                                            >
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    required
                                                    value={this.state.password}
                                                    type="password"
                                                    onChange={(value) => {
                                                        this.setState({
                                                            password: value.target.value,
                                                        });
                                                    }}
                                                    placeholder="Password"
                                                />
                                            </Form.Group>
                                        }
                                        <Form.Group className="mb-3">
                                            <Button
                                                className="fullwidthbutton"
                                                variant="primary"
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </Form.Group>
                                        {/* <span
                                            className="forgotpassword"
                                            onClick={() => {
                                                this.setState({
                                                    forgetpasswordemail: true,
                                                });
                                            }}
                                            style={{ float: "right" }}
                                        >
                                            Forgot/Reset Password?
                                        </span> */}
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )}
            </div>
        );

    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (creds) => dispatch(Login(creds))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
