import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Logout } from "../../state/actions/authActions";
import Header from "../../components/Header";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { GetArticle, GetArticleComments, ReadArticle, AddArticleComment, SerachArticleComments } from "../../state/actions/articleActions";
import Loading from "../../components/Loading";
import Empty from "../../components/Empty";
import { IMAGES_URL } from "../../config/constants";
import ArticleComment from "../../components/Comment";
import { IoAddCircle, IoSearch } from "react-icons/io5";



class SingleArticle extends Component {

    constructor () {
        super();
        this.state = {
            seconds: 0,
            commentController: 0,
            showSearchedComments: false,
            commentText: ""
        }
        this.timer = 0;

        this.countUp = this.countUp.bind(this);
    }
    componentDidMount() {
        if (this.props.match.params.slug) {
            this.props.getArticle(this.props.match.params.slug);

        } else {
            window.location = "/";
        }
    }


    componentDidUpdate(previousProps) {
        if (previousProps.article.article !== this.props.article.article && this.props.article.article !== null) {
            this.props.getComments(this.props.article.article._id);
            this.startTimer();
        }

        if (previousProps.article.serachedComments !== this.props.article.serachedComments) {
            if (this.state.commentController === 2) {
                this.setState({
                    showSearchedComments: true
                })
            }
        }


    }

    handleCancel = () => {
        this.setState({
            commentController: 0,
            commentText: "",
            showSearchedComments: false,
        })
    }

    handleSubmit = (e) => {
        window.alert(this.state.commentController)
        if (this.state.commentController === 1) {

            this.props.addComment({
                body: this.state.commentText,
                article_id: this.props.article.article._id
            });
            this.handleCancel();

        } else {

            this.props.searchComment({
                text: this.state.commentText,
                article_id: this.props.article.article._id
            })
        }

        e.preventDefault();
    };





    startTimer() {
        if (this.state.seconds === 0) {
            this.timer = setInterval(this.countUp, 1000);
        }
    }

    countUp() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds + 1;
        this.setState({
            seconds: seconds,
        });

        // Check if it is enough time
        if (seconds === 30) {
            clearInterval(this.timer);
            this.props.readArticle(this.props.article.article);
        }
    }


    render() {
        const { isLoading, article, comments, serachedComments } = this.props.article;
        return (
            <div>
                <Header />
                <Container>
                    {isLoading === true ? (
                        <Col className="newsLoadingDiv">
                            <Loading />
                        </Col>
                    ) :
                        article !== null ? (
                            <div className="singlePost">
                                <div className="singlePostWrapper">
                                    <img
                                        className="singlePostImg imageCurve"
                                        src={IMAGES_URL + article.thumbnail}
                                        alt=""
                                    />
                                    <h1 className="singlePostTitle">
                                        {article.title}
                                        <div className="singlePostEdit">
                                            <i className="singlePostIcon far fa-edit"></i>
                                            <i className="singlePostIcon far fa-trash-alt"></i>
                                        </div>
                                    </h1>
                                    <div className="singlePostInfo">
                                        <span>
                                            Author:
                                            <b className="singlePostAuthor">
                                                <Link className="link" to={`/author/${article.author_user_id}`}>
                                                    {article.author_full_name}
                                                </Link>
                                            </b>
                                        </span>
                                        <span>{new Date(article.createdAt).toDateString()}</span>
                                    </div>
                                    <p className="singlePostDesc">
                                        {article.content}
                                    </p>
                                    {comments.length > 0 &&
                                        <div>
                                            <br />
                                            <hr />
                                            <Container>
                                                <Row>
                                                    <Col md={6} lg={12}>
                                                        <Row>
                                                            <Col>
                                                                <h3 className="commentsTitle">Comments</h3>
                                                            </Col>
                                                            <Col>
                                                                {this.props.auth.isAuthenticated &&
                                                                    <IoAddCircle onClick={() => {
                                                                        this.setState({
                                                                            commentController: 1,
                                                                        })
                                                                    }} className="commentIcons" />}
                                                                <IoSearch onClick={() => {
                                                                    this.setState({
                                                                        commentController: 2,
                                                                    })
                                                                }} className="commentIcons" />
                                                            </Col>

                                                        </Row>
                                                        {this.state.commentController > 0 &&
                                                            <Form id="commentform" onSubmit={this.handleSubmit}>
                                                                <Row>
                                                                    <Col>
                                                                        <Form.Control
                                                                            className="commentInput"
                                                                            value={this.state.commentText}
                                                                            required
                                                                            type="text"
                                                                            onChange={(value) => {
                                                                                this.setState({
                                                                                    commentText: value.target.value,
                                                                                });
                                                                            }}
                                                                            placeholder={this.state.commentController === 1 ? "Type To Add..." : "Type To Search..."}
                                                                        />
                                                                    </Col>
                                                                    <Col>
                                                                        <Button
                                                                            variant="primary"
                                                                            type="submit"
                                                                        >
                                                                            {this.state.commentController === 1 ? "Add" : "Search"}
                                                                        </Button>
                                                                        <Button
                                                                            variant="light"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                this.handleCancel()
                                                                            }}
                                                                        >

                                                                            Cancel
                                                                        </Button>

                                                                    </Col>
                                                                </Row>

                                                            </Form>
                                                        }

                                                        {
                                                            this.state.showSearchedComments ?
                                                                serachedComments.length > 0 ?
                                                                    serachedComments.map((comment) =>
                                                                        ArticleComment(comment)
                                                                    ) : <p>Nothing Matched Your Search</p> :
                                                                comments.map((comment) =>
                                                                    ArticleComment(comment)
                                                                )
                                                        }
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </div>}
                                </div>



                            </div>) : <Empty />}
                </Container>
            </div>
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
        getArticle: (slug) => dispatch(GetArticle(slug)),
        getComments: (article_id) => dispatch(GetArticleComments(article_id)),
        readArticle: (article) => dispatch(ReadArticle(article)),
        addComment: (comment) => dispatch(AddArticleComment(comment)),
        searchComment: (comment) => dispatch(SerachArticleComments(comment))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleArticle);
