import {OrdersPack, OrdersPackModel} from './OrdersPack';
import { Order} from '../Order/Order';
import { Ref } from '@typegoose/typegoose';
import { OrderRepository } from '../Order/Order.repository';

export class OrdersPackRepository{

    /**
     * Devuelve todos los OrdersPack.
     */
    public static async find(): Promise<OrdersPack[]>{
        const ordersPack = await OrdersPackModel.find().populate('orders');
        return ordersPack;
    }

    /**
     * Devuelve el OrdersPack con el id pasado como parametro. Retorna undefined si no existe.
     * @param _id Id del OrdersPack que se quiere obtener.
     */
    public static async findOne(_id: string|Ref<OrdersPack>): Promise<OrdersPack>{
        const ordersPack: OrdersPack = await OrdersPackModel.findOne({_id: _id}).populate({path: 'orders', populate: 'user_id'}).populate('creator');
        return ordersPack;
    }

    /**
     * Guarda un OrdersPack en la base de datos.
     * @param ordersPack OrdersPack que se desea guardar.
     */
    public static async save(ordersPack: OrdersPack): Promise<OrdersPack>{
        const saved: OrdersPack = await OrdersPackModel.create(ordersPack);
        return (saved ? saved : null);
    }

    /**
     * Elimina un OrdersPack de la base de datos.
     * @param _id Id del OrdersPack que se desea eliminar.
     */
    public static async delete(_id: string|Ref<OrdersPack>): Promise<boolean>{
        const deleted =  await OrdersPackModel.deleteOne({_id: _id});
        return !!deleted;
    }

    /**
     * Agrega una Orden a un OrdersPack.
     * @param order Orden que se desea agregar.
     * @param ordersPack_id Id del OrdersPack al que se le quiere agregar la orden.
     */
    public static async addOrder(order: Order, ordersPack_id: string): Promise<boolean>{
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPack_id);
        const orders: Array<Ref<Order>> =  ordersPack.orders;

        if(!orders.includes(order._id)){
            orders.push(order._id);
            await OrdersPackModel.updateOne({_id: ordersPack_id}, {orders: orders, updatedAt: new Date()});
        }
        return null;
    }

    /**
     * Actualiza la fecha de expiracion del OrdersPack cuyo Id es pasado como parametro.
     * @param newExpirationDate Nueva fecha de expiracion
     * @param ordersPack_id Id del OrdersPack.
     */
    public static async updateExpirationDate(newExpirationDate: Date, ordersPack_id: string): Promise<boolean>{
        const updated = await OrdersPackModel.updateOne({_id: ordersPack_id}, {expirationDate: newExpirationDate, updatedAt: new Date()});
        return !!updated.n;
    }

    /**
     * Elimina una o mas ordenes del OrdersPack cuyo id es pasado como parametro.
     * @param ordersToDelete Ordenes que se desean eliminar del OrdersPack.
     * @param ordersPack_id Id del OrdersPack.
     */
    public static async deleteOrders(ordersToDelete: Array<Ref<Order>>, ordersPack_id: string): Promise<boolean>{
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPack_id);
        const orders: Array<Order> = ordersPack.orders as Array<Order>;
        
        for(let orderToDelete of ordersToDelete){
            orders.splice(orders.findIndex(order => {
                if(order._id == orderToDelete){
                    OrderRepository.delete(order._id);
                    return false;
                }
                return true;
            }), 1);
        }

        const updated = await OrdersPackModel.updateOne({_id: ordersPack_id}, {orders: orders, updatedAt: new Date()});
        return !!updated.n;
    }

    /**
     * Elimina una Orden de un OrdersPack.
     * @param order_id Id de la Orden que se quiere eliminar del OrdersPack.
     * @param ordersPack_id Id del OrdersPack.
     */
    public static async deleteOrder(order_id: Ref<Order>, ordersPack_id: Ref<OrdersPack>){
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPack_id);
        let orders: Order[] =  ordersPack.orders as Order[];
        
        orders.splice(orders.findIndex(order =>{
            return order._id === order_id
        }), 1);


        const updated = await OrdersPackModel.updateOne({_id: ordersPack_id}, {orders: orders, updatedAt: new Date()});
        return !!updated.n;
    }

    /**
     * Encuentra un OrdersPack en base al id de una Orden que se encuentra
     * dentro de este.
     * @param order_id Id de la orden.
     */
    public static async findByOrderId(order_id: Ref<Order>): Promise<OrdersPack>{
        const ordersPack: OrdersPack = await OrdersPackModel.findOne({orders: [order_id]});
        return ordersPack;
    }
}