import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Badge from 'react-bootstrap/Badge'

const ExpandedOrdersPackCard = (props) => {
    const {order} = props.location;
    order.expirationDate = new Date(order.expirationDate);
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',  second: 'numeric'};

    
    const orders = order.orders.map(order => {
        return (
            <ListGroupItem key={order._id}>
                {order.description}<br></br>
                <small className="text-muted">by: {order.user_id.name}</small>
            </ListGroupItem>
        )
    })

    return (
        <Card className="mt-3 mb-3" style={{cursor: "pointer"}}>
            <Card.Body>
                <Card.Title>{order.name}</Card.Title>
                <Card.Subtitle>
                    by: {order.creator.name}<br></br>
                </Card.Subtitle>
            </Card.Body>
            <ListGroup className="list-group-flush">
                {orders}
            </ListGroup>
            <Card.Body>
                <Card.Text>
                    Expiration Date: {order.expirationDate.toLocaleString(undefined, options)}
                    {Date.now() > order.expirationDate ? <Badge className="ml-3" pill variant='danger'>Expired</Badge> : ''}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ExpandedOrdersPackCard;