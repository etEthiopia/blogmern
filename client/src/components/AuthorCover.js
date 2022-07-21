import React from 'react';
import { Carousel, Card, Row, Col } from 'react-bootstrap';
import { contentSlicer } from '../utils/functions';

const AuthorCover = (props) => {
    return (
        <div>
            <Card className="newsCard shadow authorCover">
                <Row>
                    <Col>
                        <h1>{props.author.full_name}</h1>
                        <h3>@{props.author.user_id}</h3>
                    </Col>
                    {props.author.reads &&
                        <Col>
                            <h4 className="toTheRight">{props.author.articles} Articles</h4>
                            <h4 className="toTheRight rightSeparator">{props.author.reads} Reads</h4>


                        </Col>}
                </Row>
            </Card>
        </div >
    );
};

export default AuthorCover;