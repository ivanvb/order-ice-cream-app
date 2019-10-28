import { prop, getModelForClass, addModelToTypegoose, Ref } from '@typegoose/typegoose';
import { Entity } from '../Entity/Entity';
import { OrderBuilder, PaymentMethod } from './Order.builder';
import { User } from '../User/User';

export class Order extends Entity{

    @prop()
    description: String;
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
}


export const OrderModel = getModelForClass(Order);
