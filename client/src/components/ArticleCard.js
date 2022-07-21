import React from 'react';
import { Card, Col, Row, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IMAGES_URL } from '../config/constants';
import { contentSlicer } from '../utils/functions';
import { IoPencil, IoEyeOff, IoEye, IoTrash, IoBook } from "react-icons/io5";

const ArticleCard = (props) => {
    const { article } = props;

    return (
        <Col lg={4} md={4} sm={6} className="mb-3" key={article._id}>
            <Card className="newsCard shadow">
                <Card.Img variant="top" src={IMAGES_URL + article.thumbnail} />
                <Card.Body>
                    <Card.Title>{article.title}<span className="readtitle">{article.reads}<IoBook className="bookIcon" /></span></Card.Title>
                    <Card.Text>
                        {contentSlicer(article.content)}
                    </Card.Text>
                    <Row>
                        <Col>
                            <Row>
                                <Link className="link" to={`/author/${article.author_user_id}`}>
                                    {article.author_full_name}
                                </Link>
                                <Card.Text>
                                    {new Date(article.createdAt).toDateString()}
                                </Card.Text>
                            </Row>
                        </Col>

                        <Col>


                            <Link to={`/read/${article.slug}`} className="btn btn-primary toTheRight"
                                type="submit"
                                rel="noreferrer"
                            >
                                Read More
                            </Link>
                        </Col>
                    </Row>
                    {props.edit &&
                        <Row>
                            <Col>
                                <ButtonGroup className="editButtons">
                                    <Button onClick={() => { props.onChange(article._id, 1, article.is_visible ? 0 : 1) }} variant="info">{article.is_visible ? <IoEyeOff /> : <IoEye />}</Button>
                                    <Button onClick={() => { window.location = 'edit/' + article.slug }} variant="warning"><IoPencil /></Button>
                                    <Button onClick={() => { props.onChange(article._id, 2, 0) }} variant="danger"><IoTrash /></Button>
                                </ButtonGroup>
                            </Col>
                        </Row>}


                </Card.Body>
            </Card>
        </Col>
    );
};

export default ArticleCard;