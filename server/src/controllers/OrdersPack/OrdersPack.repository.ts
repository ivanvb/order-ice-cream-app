import {OrdersPack, OrdersPackModel} from './OrdersPack';
import { Order } from '../Order/Order';
import { Ref } from '@typegoose/typegoose';
import { OrderRepository } from '../Order/Order.repository';

export class OrdersPackRepository{

    public static async find(): Promise<OrdersPack[]>{
        const ordersPack = await OrdersPackModel.find().populate('orders');
        return ordersPack;
    }

    public static async findOne(guid: String): Promise<OrdersPack>{
        const ordersPack: OrdersPack = await OrdersPackModel.findOne({id: guid}).populate('orders').populate('creator');
        return ordersPack;
    }

    public static async save(ordersPack: OrdersPack): Promise<OrdersPack>{
        const saved: OrdersPack = await OrdersPackModel.create(ordersPack);
        return (saved ? saved : null);
    }

    public static async delete(guid: String): Promise<boolean>{
        const deleted =  await OrdersPackModel.deleteOne({id: guid});
        return !!deleted;
    }

    public static async addOrder(order: Order, ordersPackGuid: String): Promise<boolean>{
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPackGuid);
        const orders: Array<Ref<Order>> =  ordersPack.orders;

        if(!orders.includes(order._id)){
            orders.push(order._id);
            await OrdersPackModel.updateOne({id: ordersPackGuid}, {orders: orders, updatedAt: new Date()});
        }
        return null;
    }

    public static async addTime(newDate: Date, ordersPackGuid: String): Promise<boolean>{
        const updated = await OrdersPackModel.updateOne({id: ordersPackGuid}, {expirationDate: newDate, updatedAt: new Date()});
        return !!updated.n;
    }

    public static async deleteOrders(ordersToDelete: Array<Ref<Order>>, ordersPackGuid: String): Promise<boolean>{
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPackGuid);
        const orders: Array<Order> = ordersPack.orders as Array<Order>;
        
        for(let orderToDelete of ordersToDelete){
            orders.splice(orders.findIndex(order => {
                if(order._id == orderToDelete){
                    OrderRepository.delete(order.id);
                    return false;
                }
                return true;
            }), 1);
        }

        const updated = await OrdersPackModel.updateOne({id: ordersPackGuid}, {orders: orders, updatedAt: new Date()});
        return !!updated;
    }
}