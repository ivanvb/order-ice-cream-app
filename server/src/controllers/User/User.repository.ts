import {User, UserModel} from './User';
import { Order } from '../Order/Order';
import { Ref } from '@typegoose/typegoose';
import { OrdersPack } from '../OrdersPack/OrdersPack';
import { ExpressError } from '../ErrorControllers/ExpressError';
import { ErrorCodes } from '../ErrorControllers/ErrorCodeEnum';

export class UserRepository{

    /**
     * Devuelve todos los usuarios.
     */
    public static async find(): Promise<User[]>{
        const users = await UserModel.find();
        return users;
    }

    /**
     * Devuelve el usuario cuyo id es igual al que se paso como parametro.
     * @param _id Id del usuario que se quiere buscar.
     */
    public static async findById(_id: string|Ref<User>): Promise<User>{
        const user: User = await UserModel.findOne({_id: _id});
        return user;
    }

    /**
     * Guarda un usuario en la base de datos si el email con el que se quiere registrar no existe.
     * @param user Usuario que se quiere guardar.
     */
    public static async save(user: User): Promise<User>{
        if(!await UserModel.exists({email: user.email})){
            const saved: User = await UserModel.create(user);
            return (saved ? saved : null);
        } else {
            throw new ExpressError('duplicated email', ErrorCodes.DUPLICATED_EMAIL, 400);
        }
    }

    /**
     * Elimina un usuario de la base de datos.
     * @param _id Id del usuario que se quiere eliminar.
     */
    public static async delete(_id: string|Ref<User>): Promise<boolean>{
        const deleted =  await UserModel.deleteOne({_id: _id});
        return !!deleted;
    }

    /**
     * Busca un usuario cuyo email y password coincidan con lo pasado como parametro.
     * @param email Email del usuario
     * @param password Password del usuario
     */
    public static async findByEmailAndPassword(email: string, password: string): Promise<User>{
        const user: User = await UserModel.findOne({email: email, password: password});
        return user;
    } 

    /**
     * Agrega una Orden al arreglo de ordenes de un usuario.
     * @param user Usuario al que se le agregara la orden.
     * @param order Orden que se le agregara al usuario.
     */
    public static async addOrder(user: User, order: Order): Promise<boolean>{
        const orders: Array<Ref<Order>> = user.orders as Array<Ref<Order>>;
        orders.push(order._id);
        const updatedUser = await UserModel.updateOne({_id: user._id}, {orders: orders, updatedAt: new Date()});

        return !!updatedUser.n;
    }

    /**
     * Agrega un OrdersPack al arreglo de ordersPacks de un usuario.
     * @param user Usuario al que se le agregara el OrdersPack.
     * @param ordersPack OrdersPack que se le agregara al Usuario.
     */
    public static async addOrdersPack(user: User, ordersPack: OrdersPack): Promise<boolean>{
        const ordersPacks: Array<Ref<OrdersPack>> = user.ordersPacks as Array<Ref<OrdersPack>>;
        ordersPacks.push(ordersPack._id);
        const updatedUser = await UserModel.updateOne({_id: user._id}, {ordersPacks: ordersPacks, updatedAt: new Date()});

        return !!updatedUser.n;
    }

    /**
     * Elimina una Orden del arreglo de ordenes de un Usuario.
     * @param user_id Id del usuario del cual se borrara la Orden.
     * @param order_id Id de la Orden que se agregara al usuario
     */
    public static async deleteOrderFromUser(user_id: string|Ref<User>, order_id: Ref<Order>): Promise<boolean>{
        const user: User = await UserRepository.findById(user_id);
        const orders: Order[] =  user.orders as Array<Order>;

        orders.splice(orders.findIndex(order => order._id != order_id), 1);

        const updated = await UserModel.updateOne({_id: user_id}, {orders: orders, updatedAt: new Date()});
        return !!updated.n;
    }

    /**
     * Elimina un OrdersPack del arreglo de ordersPack de un Usuario.
     * @param user_id Id del usuario del cual se borrara el OrdersPack.
     * @param ordersPack_id Id del OrdersPack que se le agregara al usuario.
     */
    public static async deleteOrdersPackFromUser(user_id: string|Ref<User>, ordersPack_id: Ref<OrdersPack>){
        const user: User = await UserRepository.findById(user_id);
        const ordersPacks: OrdersPack[] =  user.ordersPacks as Array<OrdersPack>;

        ordersPacks.splice(ordersPacks.findIndex(ordersPack => ordersPack._id != ordersPack_id), 1);

        const updated = await UserModel.updateOne({_id: user_id}, {ordersPacks: ordersPacks, updatedAt: new Date()});
        return !!updated.n;
    }
}