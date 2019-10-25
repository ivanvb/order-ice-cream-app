import { User } from "../User/User";
import { Order } from "../Order/Order";
import { Entity } from "../Entity/Entity";
import { OrdersPackBuilder } from "./OrdersPack.builder";
import { prop, arrayProp, getModelForClass, Ref} from '@typegoose/typegoose';

export class OrdersPack extends Entity{

    @arrayProp({itemsRef: Order})
    orders: Ref<Order[]>;
    @prop({ref: User})
    creator: Ref<User>;
    @prop()
    expirationDate: Date;

    constructor(ordersPackBuilder: OrdersPackBuilder){
        super(ordersPackBuilder.guid, ordersPackBuilder.createdAt, ordersPackBuilder.updatedAt);
        this.creator = ordersPackBuilder.creator;
        this.expirationDate =  ordersPackBuilder.expirationDate;
    }
}

export const OrdersPackModel = getModelForClass(OrdersPack)