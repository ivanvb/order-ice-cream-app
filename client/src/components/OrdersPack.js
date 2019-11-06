import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

const OrdersPack = (props) => {
    
    const {data} = props;
    const orders = data.orders.map(order => {
        return (
            <ListGroupItem key={order._id}>
                {order.description}<br></br>
                <small className="text-muted">by: {order.user_id.name}</small>
            </ListGroupItem>
        )
    })
    return (
        <Card className="mt-3 mb-3">
            <Card.Body>
                <Card.Title>{data.name}</Card.Title>
                <Card.Subtitle>by: {data.creator.name}</Card.Subtitle>
            </Card.Body>
            <ListGroup className="list-group-flush">
                {orders}
            </ListGroup>
        </Card>
    );
};

export default OrdersPack;