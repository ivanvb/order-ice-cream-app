import {OrderBuilder, PaymentMethod} from './Order.builder';
import { Entity } from '../Entity/Entity';
import { Guid } from '../Entity/Guid';

export class Order extends Entity{

    description: String;
    userGuid: Guid;
    price: number;
    payed: boolean;
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