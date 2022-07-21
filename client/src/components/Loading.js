import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = () => {
    return (
        <div className="spin">
            <Spinner className="spinner" animation="grow" variant="primary" />
        </div>
    );
};

export default Loading;
