import {User, UserModel} from './User';
import { Order } from '../Order/Order';
import { Ref } from '@typegoose/typegoose';
import { OrdersPack } from '../OrdersPack/OrdersPack';

export class UserRepository{

    public static async find(): Promise<User[]>{
        const users = await UserModel.find();
        return users;
    }

    public static async findOne(guid: String): Promise<User>{
        const user: User = await UserModel.findOne({id: guid});
        return user;
    }

    public static async save(user: User): Promise<String>{
        const saved: User = await UserModel.create(user);
        return (saved ? saved.id : null);
    }

    public static async delete(guid: String): Promise<boolean>{
        const deleted =  await UserModel.deleteOne({id: guid});
        return !!deleted;
    }

    public static async findByEmailAndPassword(email: String, password: String): Promise<User>{
        const user: User = await UserModel.findOne({email: email, password: password});
        return user;
    } 

    public static async addOrder(user: User, order: Order): Promise<boolean>{
        const orders: Array<Ref<Order>> = user.orders as Array<Ref<Order>>;
        orders.push(order._id);
        const updatedUser = await UserModel.updateOne({id: user.id}, {orders: orders, updatedAt: new Date()});

        return !!updatedUser.n;
    }

    public static async addOrdersPack(user: User, ordersPack: OrdersPack): Promise<boolean>{
        const ordersPacks: Array<Ref<OrdersPack>> = user.ordersPacks as Array<Ref<OrdersPack>>;
        ordersPacks.push(ordersPack._id);
        const updatedUser = await UserModel.updateOne({id: user.id}, {ordersPacks: ordersPacks, updatedAt: new Date()});

        return !!updatedUser.n;
    }
}