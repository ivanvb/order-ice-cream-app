import {User, UserModel} from './User';
import { Order } from '../Order/Order';
import { Ref } from '@typegoose/typegoose';
import { OrdersPack } from '../OrdersPack/OrdersPack';

export class UserRepository{

    public static async find(): Promise<User[]>{
        const users = await UserModel.find();
        return users;
    }

    public static async findOne(_id: String|Ref<User>): Promise<User>{
        const user: User = await UserModel.findOne({_id: _id});
        return user;
    }

    public static async save(user: User): Promise<Ref<User>>{
        const saved: User = await UserModel.create(user);
        return (saved ? saved._id : null);
    }

    public static async delete(_id: String|Ref<User>): Promise<boolean>{
        const deleted =  await UserModel.deleteOne({_id: _id});
        return !!deleted;
    }

    public static async findByEmailAndPassword(email: String, password: String): Promise<User>{
        const user: User = await UserModel.findOne({email: email, password: password});
        return user;
    } 

    public static async addOrder(user: User, order: Order): Promise<boolean>{
        const orders: Array<Ref<Order>> = user.orders as Array<Ref<Order>>;
        orders.push(order._id);
        const updatedUser = await UserModel.updateOne({_id: user._id}, {orders: orders, updatedAt: new Date()});

        return !!updatedUser.n;
    }

    public static async addOrdersPack(user: User, ordersPack: OrdersPack): Promise<boolean>{
        const ordersPacks: Array<Ref<OrdersPack>> = user.ordersPacks as Array<Ref<OrdersPack>>;
        ordersPacks.push(ordersPack._id);
        const updatedUser = await UserModel.updateOne({_id: user._id}, {ordersPacks: ordersPacks, updatedAt: new Date()});

        return !!updatedUser.n;
    }

    public static async deleteOrderFromUser(user_id: String|Ref<User>, order_id: Ref<Order>): Promise<boolean>{
        const user: User = await UserRepository.findOne(user_id);
        const orders: Order[] =  user.orders as Array<Order>;

        orders.splice(orders.findIndex(order => order._id != order_id), 1);

        const updated = await UserModel.updateOne({_id: user_id}, {orders: orders, updatedAt: new Date()});
        return !!updated.n;
    }

    public static async deleteOrdersPackFromUser(user_id: String|Ref<User>, ordersPack_id: Ref<OrdersPack>){
        const user: User = await UserRepository.findOne(user_id);
        const ordersPacks: OrdersPack[] =  user.ordersPacks as Array<OrdersPack>;

        ordersPacks.splice(ordersPacks.findIndex(ordersPack => ordersPack._id != ordersPack_id), 1);

        const updated = await UserModel.updateOne({_id: user_id}, {ordersPacks: ordersPacks, updatedAt: new Date()});
        return !!updated.n;
    }
}