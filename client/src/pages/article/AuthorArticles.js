import React, { Component } from "react";
import { GetMyArticles, DeleteArticle, ChangeArticleStatus } from "../../state/actions/articleActions";
import { connect } from "react-redux";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
import ArticleCard from "../../components/ArticleCard";
import Paginate from "../../components/Paginate";
import AuthorCover from "../../components/AuthorCover";

class AuthorArticles extends Component {
    state = {
        modal: false,
        selectedArticle: "",
        reason: 1,
        decision: 0
    }

    componentDidMount() {
        this.props.getArticles();
    }


    paginateArticles = (page) => {
        this.props.getArticles(page);
    }

    onArticleChange = (id, reason, decision) => {
        this.setState({
            selectedArticle: id,
            modal: true,
            reason: reason,
            decision: decision
        })
    }

    handleInputClose = () => {
        this.setState({
            modal: false,
        });
    };

    render() {
        const { articles, isLoading } = this.props.article;
        const { user } = this.props.auth;
        return (
            <div>
                <Header />
                <Container>
                    {isLoading === true ? (
                        <Col className="newsLoadingDiv">
                            <Loading />
                        </Col>
                    ) :
                        articles.docs && user !== null &&

                        (
                            <Row>
                                <Col lg={12} md={12} sm={12}>
                                    <Row>
                                        <AuthorCover author={user} />
                                    </Row>
                                    {/* props={...blog, edit: true } onChange={this.onArticleChange} */}
                                    <Row>
                                        {articles.docs.map((blog) => (
                                            <ArticleCard article={blog} edit onChange={this.onArticleChange} />
                                        ))
                                        }
                                    </Row>
                                    {articles.totalPages > 1 &&
                                        <Row>
                                            <Paginate onChangePage={this.paginateArticles} pages={articles.totalPages} page={articles.page} />
                                        </Row>}

                                </Col>
                                {/* <Col>
                                        <h1>Hello</h1>
                                    </Col> */}
                            </Row>
                        )
                    }
                    <Modal
                        style={{ opacity: 1 }}
                        show={this.state.modal}
                        onHide={this.handleInputClose}
                        animation={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are You Sure On
                            {this.state.reason === 2 ? "Deleting" : "Changing Visibility"}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={this.handleInputClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: this.state.reason === 2 ? "#B00020" : "#000", color: "white" }}
                                onClick={
                                    () => {
                                        this.state.reason === 2 ? this.props.deleteArticle(this.state.selectedArticle) : this.props.changeArticleStatus(this.state.selectedArticle, this.state.decision)
                                        this.setState({
                                            selectedArticle: "",
                                            modal: false,
                                            reason: 1
                                        })
                                    }}
                            >
                                {this.state.reason === 2 ? " Delete" : " Change Visibility"}

                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        article: state.article,
        auth: state.auth
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getArticles: (page) => dispatch(GetMyArticles(page)),
        deleteArticle: (id) => dispatch(DeleteArticle(id)),
        changeArticleStatus: (id, decision) => dispatch(ChangeArticleStatus(id, decision))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorArticles);