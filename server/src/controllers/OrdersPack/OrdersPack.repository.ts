import {OrdersPack, OrdersPackModel} from './OrdersPack';
import { Order } from '../Order/Order';
import { Ref } from '@typegoose/typegoose';

export class OrdersPackRepository{

    public static async find(): Promise<OrdersPack[]>{
        const ordersPack = await OrdersPackModel.find().populate('orders');
        return ordersPack;
    }

    public static async findOne(guid: String): Promise<OrdersPack>{
        const ordersPack: OrdersPack = await OrdersPackModel.findOne({id: guid}).populate('orders');
        return ordersPack;
    }

    public static async save(ordersPack: OrdersPack): Promise<OrdersPack>{
        const saved: OrdersPack = await OrdersPackModel.create(ordersPack);
        return (saved ? saved : null);
    }

    public static async delete(guid: String): Promise<boolean>{
        const deleted =  await OrdersPackModel.deleteOne({guid: guid});
        return !!deleted;
    }

    public static async addOrder(order: Order, ordersPackId: String): Promise<boolean>{
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPackId);
        const orders: Array<Ref<Order>> =  ordersPack.orders;

        if(!orders.includes(order._id)){
            orders.push(order._id);
            let x = await OrdersPackModel.updateOne({id: ordersPackId}, {orders: orders});
        }
        return null;
    }
}