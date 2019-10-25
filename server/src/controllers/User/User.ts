import {Entity} from '../Entity/Entity';
import { UserBuilder } from './User.builder';
import { Order } from '../Order/Order';
import { OrdersPack } from '../OrdersPack/OrdersPack';

export class User extends Entity{

    name: String;
    password: String;
    email: String;
    orders: Order[];
    ordersPacks: OrdersPack[];

    constructor(userBuilder: UserBuilder){
        super(userBuilder.guid, userBuilder.createdAt, userBuilder.updatedAt);
        this.name =  userBuilder.name;
        this.password =  userBuilder.password;
        this.email =  userBuilder.email;
        this.orders =  userBuilder.orders;
        this.ordersPacks = userBuilder.ordersPacks;
    }
}