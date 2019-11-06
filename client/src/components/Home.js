import React, { Component } from 'react';
import OrdersPack from './OrdersPack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {ordersPacks: []};
    }

    async componentDidMount(){
        const res = await fetch('/ordersPack');
        const json = await res.json();
        this.setState({ordersPacks: json.ordersPacks});        
    }

    render() {
        const cards = this.state.ordersPacks.map(ordersPack =>{
            return (
                <Col key={ordersPack._id} xs={6} lg={4}>
                    <OrdersPack  data={ordersPack}/>
                </Col>
            )
        })
        console.log(this.state.ordersPacks);

        return (
            <Container>
                <h1 className="mt-3 mb-3">Orders Packs</h1>
                <Row>
                    {cards}
                </Row>
            </Container>
        );
    }
}

export default Home;