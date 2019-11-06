import React, {useContext} from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Badge from 'react-bootstrap/Badge';
import { IoIosCloseCircle, IoMdCreate } from "react-icons/io";
import { UserContext } from './UserContext';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ExpandedOrdersPackCard = (props) => {
    const [user] = useContext(UserContext);
    const {ordersPack} = props;
    const expired = Date.now() > new Date(ordersPack.expirationDate);
    ordersPack.expirationDate = new Date(ordersPack.expirationDate);
    const options = { weekday: 'short',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: 'numeric'};

    
    const orders = ordersPack.orders.map(order => {
        const isOwner =  ordersPack.creator._id === user._id;
        const canModify = !expired && (order.user_id._id === user._id || isOwner);
        return (
            <ListGroupItem key={order._id}>
                <Row>
                    <Col xs={(canModify ? 9 : 12)}>
                        {order.description}<br></br>
                        {order.price} $<br></br>
                        {'To pay with: ' + (order.paymentMethod ? 'Credit card' : 'Cash')}<br></br>
                        <small className="text-muted">by: {order.user_id.name}</small>
                    </Col>
                    {canModify && <Col xs={3} className="d-flex justify-content-end">
                        {order.user_id._id === user._id && <IoMdCreate className="mr-2" style={{'cursor': 'pointer'}} />}
                        <IoIosCloseCircle style={{'cursor': 'pointer'}} 
                        onClick={
                            ()=>{
                                if(isOwner) props.adminDelete(order)
                                else props.personalDelete(order);
                            }} />
                    </Col>}    
                </Row>
            </ListGroupItem>
        )
    })

    return (
        <Card className="mt-3 mb-3">
            <Card.Body>
                <Card.Title>{ordersPack.name}</Card.Title>
                <Card.Subtitle>
                    by: {ordersPack.creator.name}<br></br>
                </Card.Subtitle>
            </Card.Body>
            <ListGroup className="list-group-flush">
                {orders}
            </ListGroup>
            <Card.Body>
                <Card.Text>
                    Expiration Date: {ordersPack.expirationDate.toLocaleString(undefined, options)}
                    {expired ? <Badge className="ml-3" pill variant='danger'>Expired</Badge> : ''}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ExpandedOrdersPackCard;