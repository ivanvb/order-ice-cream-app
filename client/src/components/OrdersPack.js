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

    return (
        <>
            <ExpandedOrdersPackCard ordersPack={sOrdersPack}/>
            <NewOrderForm submitOrder={submitOrder}/>
        </>
    );
};

export default withAlert(OrdersPack);