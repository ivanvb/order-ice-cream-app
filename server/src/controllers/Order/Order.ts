import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Entity } from '../Entity/Entity';
import { OrderBuilder, PaymentMethod } from './Order.builder';
import { User } from '../User/User';

/**
 * Clase representativa de una Orden.
 * 
 * Las propiedades tienen los decoradores '@prop' para modelar
 * esta clase como un documento dentro de MongoDB.
 */
export class Order extends Entity{

    @prop()
    description: string;
    ///Referencia al User que creo esta Orden.
    @prop({ref: "User"})
    user_id: Ref<User>;
    @prop()
    price: number;
    @prop()
    payed: boolean;
    @prop()
    paymentMethod: PaymentMethod;

    constructor(orderBuilder: OrderBuilder){
        super(orderBuilder.createdAt, orderBuilder.updatedAt);
        this.description =  orderBuilder.description;
        this.user_id = orderBuilder.user_id;
        this.price =  orderBuilder.price;
        this.payed =  (orderBuilder.payed ? orderBuilder.payed : false);
        this.paymentMethod = (this.paymentMethod ? this.paymentMethod : PaymentMethod.EFECTIVO);
    }

    toString(): string{
        return (
            `${this.description} para ${(<User> this.user_id).name} para pagar en ${PaymentMethod[this.paymentMethod].toLowerCase()}.`
        )
    }
}

///Exporta el modelo de la clase el cual será utilizado para realizar operaciones con relación a la base de datos.
export const OrderModel = getModelForClass(Order);
