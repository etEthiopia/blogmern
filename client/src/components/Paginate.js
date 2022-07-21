import React from 'react';
import { Pagination } from 'react-bootstrap';

const Paginate = (props) => {

    const items = [];
    for (let index = 1; index <= props.pages; index++) {
        items.push(
            <Pagination.Item onClick={() => { props.onChangePage(index) }} key={index} active={props.page === index}>
                {index}
            </Pagination.Item>
        )

    }
    //const [usePage, setUsePage] = useState([]);
    return (

        <Pagination style={{ justifyContent: 'center' }}>
            {items}
        </Pagination>

    );
}

export default Paginate;