import {Entity} from '../Entity/Entity';
import { UserBuilder } from './User.builder';
import { Order } from '../Order/Order';
import { OrdersPack } from '../OrdersPack/OrdersPack';
import { prop, getModelForClass, Ref, arrayProp } from '@typegoose/typegoose';

/**
 * Clase representativa de un User.
 * 
 * Las propiedades tienen los decoradores '@prop' y '@arrayProp' para modelar
 * esta clase como un documento dentro de MongoDB.
 */
export class User extends Entity{

    @prop()
    name: String;
    @prop()
    password: String;
    @prop()
    email: String;
    @arrayProp({itemsRef: Order})
    orders: Ref<Order[]>;
    @arrayProp({itemsRef: OrdersPack})
    ordersPacks: Ref<OrdersPack[]>;

    constructor(userBuilder: UserBuilder){
        super(userBuilder.createdAt, userBuilder.updatedAt);
        this.name =  userBuilder.name;
        this.password =  userBuilder.password;
        this.email =  userBuilder.email;
        this.orders =  userBuilder.orders;
        this.ordersPacks = userBuilder.ordersPacks;
    }
}

///Exporta el modelo de la clase el cual será utilizado para realizar operaciones con relación a la base de datos.
export const UserModel = getModelForClass(User);