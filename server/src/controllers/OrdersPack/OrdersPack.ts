import { User } from "../User/User";
import { Order } from "../Order/Order";
import { Entity } from "../Entity/Entity";
import { OrdersPackBuilder } from "./OrdersPack.builder";

export class OrdersPack extends Entity{

    orders: Order[];
    creator: User;
    expirationDate: Date;

    constructor(ordersPackBuilder: OrdersPackBuilder){
        super(ordersPackBuilder.guid, ordersPackBuilder.createdAt, ordersPackBuilder.updatedAt);
        this.creator = ordersPackBuilder.creator;
        this.expirationDate =  ordersPackBuilder.expirationDate;
    }
}