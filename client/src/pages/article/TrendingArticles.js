import React, { Component } from "react";
import { GetTrendingArticles } from "../../state/actions/articleActions";
import { connect } from "react-redux";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import { Col, Container, Row, Card } from "react-bootstrap";
import ArticleCard from "../../components/ArticleCard";
import Empty from "../../components/Empty";
import Paginate from "../../components/Paginate";
import trendingicon from "../../assets/trending.png";

class TrendingArticles extends Component {
    state = {}

    componentDidMount() {
        this.props.getTrendingArticles(1, 6);
    }


    paginateArticles = (page) => {
        this.props.getArticles(page);
    }

    render() {
        const { isLoading, trendingArticles } = this.props.article;
        return (
            <div>
                <Header />
                <Container>
                    {isLoading === true ? (
                        <Col className="newsLoadingDiv">
                            <Loading />
                        </Col>
                    ) :
                        trendingArticles.docs &&
                            trendingArticles.docs.length > 0 ?
                            (
                                <Row>
                                    <Col lg={12} md={12} sm={12}>
                                        <Row>
                                            <Card className="newsCard trendingTitle shadow authorCover">
                                                <h1>
                                                    <img
                                                        src={trendingicon}
                                                        alt=""
                                                        style={{ height: "4rem", width: "auto" }}
                                                    />
                                                    Trending</h1>
                                            </Card>
                                            <Row>
                                                {

                                                    trendingArticles.docs.map((blog) => (
                                                        <ArticleCard article={blog} />
                                                    ))

                                                }
                                            </Row>
                                            {trendingArticles.totalPages > 1 &&
                                                <Row>
                                                    <Paginate onChangePage={this.paginateArticles} pages={trendingArticles.totalPages} page={trendingArticles.page} />
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
        getTrendingArticles: (page, limit) => dispatch(GetTrendingArticles(page, limit)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrendingArticles);