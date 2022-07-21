import React, { Component } from "react";
import { GetArticles, GetTrendingArticles } from "../../state/actions/articleActions";
import { connect } from "react-redux";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import { Col, Container, Row } from "react-bootstrap";
import ArticleCard from "../../components/ArticleCard";
import ArticleCarousel from "../../components/ArticleCarousel";
import Empty from "../../components/Empty";
import Paginate from "../../components/Paginate";

class ArticlesHome extends Component {
    state = {}

    componentDidMount() {
        this.props.getArticles();
        this.props.getTrendingArticles();
    }


    paginateArticles = (page) => {
        this.props.getArticles(page);
    }

    render() {
        const { articles, isLoading, trendingArticles } = this.props.article;
        return (
            <div>
                <Header />
                <Container>
                    {isLoading === true ? (
                        <Col className="newsLoadingDiv">
                            <Loading />
                        </Col>
                    ) :
                        articles.docs &&
                            articles.docs.length > 0 ?
                            (
                                <Row>
                                    <Col lg={12} md={12} sm={12}>
                                        <Row>
                                            {trendingArticles.docs &&
                                                trendingArticles.docs.length > 0 ?
                                                <ArticleCarousel articles={trendingArticles.docs} />
                                                : <br />
                                            }
                                            <Row>
                                                {

                                                    articles.docs.map((blog) => (
                                                        <ArticleCard article={blog} />
                                                    ))

                                                }
                                            </Row>
                                            {articles.totalPages > 1 &&
                                                <Row>
                                                    <Paginate onChangePage={this.paginateArticles} pages={articles.totalPages} page={articles.page} />
                                                </Row>}
                                        </Row>
                                    </Col>
                                    {/* <Col>
                                        <h1>Hello</h1>
                                    </Col> */}
                                </Row>
                            ) :
                            <Empty message={"No Articles Found"} />
                    }

                </Container>
            </div >
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
        getArticles: (page) => dispatch(GetArticles(page)),
        getTrendingArticles: (page, limit) => dispatch(GetTrendingArticles(page, limit)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesHome);