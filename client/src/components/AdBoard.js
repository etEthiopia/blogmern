import React from 'react';
import { Carousel } from 'react-bootstrap';


const AdBoard = (props) => {
    return (
        <Carousel slide className="newsCarousel">
            {props.ads.map((ad) => (
                <Carousel.Item
                    onClick={() => {
                        window.open(ad.link, "_blank").focus();
                    }}
                >
                    <img
                        className="d-block w-100"
                        src={ad.picture}
                        alt={ad.title}
                    />
                    <Carousel.Caption>
                        <h1 className="newscarouseltitle">{ad.title}</h1>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default AdBoard;