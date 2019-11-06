import React, {useContext, useState} from 'react';
import ExpandedOrdersPackCard from './ExpandedOrdersPackCard';
import NewOrderForm from './NewOrderForm';
import withAlert from '../hoc/withAlert';
import {UserContext} from './UserContext';

const OrdersPack = (props) => {

    const {ordersPack} = props.location;
    const [user] =  useContext(UserContext);
    const [sOrdersPack, setOrderssPack] = useState({...ordersPack});
    
    async function submitOrder(order){
        order.ordersPack_id = ordersPack._id;
        order.user_id = user._id;
        const res  =  await fetch('order/create',{
                        method: 'POST',
                        body: JSON.stringify(order),
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    });
        const json = await res.json();
        json.order.user_id = {...user};

        if(res.status !== 200){
            props.showAlert({variant: 'danger', message: 'There was an error placing your order.'});
        } else {
            props.showAlert({variant: 'success', message: 'Order placed successfully!'});
            setOrderssPack((sOrdersPack)=>{
                sOrdersPack.orders = [...sOrdersPack.orders, json.order];
                return {...sOrdersPack};
            })
        }
    }

    async function personalDelete(order){
        const body = {order_id: order._id, ordersPack_id: ordersPack._id, user_id: user._id};
        const res = await fetch('/order/', {
                    method: 'DELETE',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }});
        
        if(res.status === 200){
            setOrderssPack((sOrdersPack)=>{
                sOrdersPack.orders  = sOrdersPack.orders.filter(ord => ord._id !== order._id);
                return {...sOrdersPack};
            });
            props.showAlert({message: 'Order deleted successfully!', variant: 'success'});
        } else {
            props.showAlert({message: 'Could not delete the order', variant: 'danger'});
        }
    }

    async function adminDelete(order){
        console.log(order);
    }

    return (
        <>
            <ExpandedOrdersPackCard 
            ordersPack={sOrdersPack} 
            adminDelete={adminDelete} 
            personalDelete={personalDelete}/>
            <NewOrderForm submitOrder={submitOrder}/>
        </>
    );
};

export default withAlert(OrdersPack);