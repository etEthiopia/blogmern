import React from 'react';
import { Carousel } from 'react-bootstrap';
import { contentSlicer } from '../utils/functions';

const ArticleCarousel = (props) => {
    return (
        <Carousel fade className="newsCarousel">
            {props.articles.map((article) => (
                <Carousel.Item
                    key={article._id}
                    className="newsCarouselItem"
                    onClick={() => {
                        window.open("/article/" + article.slug, "_blank").focus();
                    }}
                >
                    <img
                        className="d-block w-100"
                        src={article.thumbnail}
                        alt={article.title}
                    />
                    <Carousel.Caption>
                        <h1 className="newscarouseltitle">{article.title}</h1>
                        <p>
                            {contentSlicer(article.content)}
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ArticleCarousel;