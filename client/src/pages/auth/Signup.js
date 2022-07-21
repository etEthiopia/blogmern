import React, { Component } from "react";

import { Form, Button, Row, Container, Col } from "react-bootstrap";
import { Register } from "../../state/actions/authActions";
import { connect } from "react-redux";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import { usernameGenerator } from "../../utils/functions";
import { toast } from "react-toastify";
//import emiralogo from "../../assets/images/emiralogo.jpg";

class SignUp extends Component {
    state = {
        fullname: "",
        email: "",
        password: "",
        cpassword: ""
    };

    handleSubmit = (e) => {
        if (this.state.password !== this.state.cpassword) {
            toast.error("Passwords don't match!")
        } else {
            this.props.register({
                email: this.state.email,
                password: this.state.password,
                full_name: this.state.fullname,
                user_id: usernameGenerator(),
                profile_pic: "-"
            })
        }

        // this.props.login({
        //     email: this.state.email,
        //     password: this.state.password,
        // });
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
                                        <Form.Group className="mb-3" >
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                value={this.state.fullname}
                                                required
                                                type="text"
                                                minLength={3}
                                                maxLength={60}
                                                pattern="[a-zA-Z'-'\s]*"
                                                onChange={(value) => {
                                                    this.setState({
                                                        fullname: value.target.value,
                                                    });
                                                }}
                                                placeholder="Enter full name"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" >
                                            <Form.Label cypresstext="email">Email address</Form.Label>
                                            <Form.Control
                                                value={this.state.email}
                                                required
                                                minLength={5}
                                                type="email"
                                                onChange={(value) => {
                                                    this.setState({
                                                        email: value.target.value,
                                                    });
                                                }}
                                                placeholder="Enter email"
                                            />
                                        </Form.Group>

                                        <Form.Group
                                            className="mb-3"

                                        >
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                required
                                                value={this.state.password}
                                                minLength={8}
                                                pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                                                type="password"
                                                onChange={(value) => {
                                                    this.setState({
                                                        password: value.target.value,
                                                    });
                                                }}
                                                placeholder="Password"
                                            />
                                        </Form.Group>

                                        <Form.Group
                                            className="mb-3"

                                        >
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                required
                                                value={this.state.cpassword}
                                                minLength={8}
                                                pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                                                type="password"
                                                onChange={(value) => {
                                                    this.setState({
                                                        cpassword: value.target.value,
                                                    });
                                                }}
                                                placeholder="Confirm Password"
                                            />
                                        </Form.Group>


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
        register: (creds) => dispatch(Register(creds))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
