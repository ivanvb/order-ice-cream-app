import { prop, getModelForClass, addModelToTypegoose, Ref } from '@typegoose/typegoose';
import { Entity } from '../Entity/Entity';
import { OrderBuilder, PaymentMethod } from './Order.builder';

export class Order extends Entity{

    _id: Ref<Order>;
    @prop()
    description: String;
    @prop()
    userGuid: String;
    @prop()
    price: number;
    @prop()
    payed: boolean;
    @prop()
    paymentMethod: PaymentMethod;

    constructor(orderBuilder: OrderBuilder){
        super(orderBuilder.guid, orderBuilder.createdAt, orderBuilder.updatedAt);
        this.description =  orderBuilder.description;
        this.userGuid = orderBuilder.userGuid;
        this.price =  orderBuilder.price;
        this.payed =  (orderBuilder.payed ? orderBuilder.payed : false);
        this.paymentMethod = (this.paymentMethod ? this.paymentMethod : PaymentMethod.EFECTIVO);
    }
}


export const OrderModel = getModelForClass(Order);
