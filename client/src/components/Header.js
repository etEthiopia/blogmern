import React, { Component } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { Logout } from "../state/actions/authActions";

class Header extends Component {
    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">MERN Blog</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/trending">Trending</Nav.Link>
                            <Nav.Link href="/write">Write</Nav.Link>
                        </Nav>
                        {isAuthenticated ? (
                            <Nav>
                                <NavDropdown title="Account" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/portfolio">
                                        My Articles
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        cypresstext="Logout"
                                        href="/"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.props.logout();
                                        }}
                                    >
                                        Log Out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        ) : (
                            <Nav>
                                <Nav.Link href="/login">Login</Nav.Link>
                                <Nav.Link href="/register">Register</Nav.Link>
                            </Nav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
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
        logout: () => dispatch(Logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
