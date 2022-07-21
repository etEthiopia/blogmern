import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Logout } from "../../state/actions/authActions";
import Header from "../../components/Header";
import { Col, Container } from "react-bootstrap";
import { GetArticle, ReadArticle } from "../../state/actions/articleActions";
import Loading from "../../components/Loading";
import Empty from "../../components/Empty";
import { IMAGES_URL } from "../../config/constants";

class SingleArticle extends Component {

    constructor () {
        super();
        this.state = {
            seconds: 0
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
            this.startTimer();
        }
    }





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
        const { isLoading, article } = this.props.article;
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getArticle: (slug) => dispatch(GetArticle(slug)),
        readArticle: (article) => dispatch(ReadArticle(article))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleArticle);
