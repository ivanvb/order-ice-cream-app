import {Entity} from '../Entity/Entity';
import { UserBuilder } from './User.builder';
import { Order } from '../Order/Order';
import { OrdersPack } from '../OrdersPack/OrdersPack';
import { prop, getModelForClass, Ref, arrayProp } from '@typegoose/typegoose';

export class User extends Entity{

    _id: Ref<User>
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
        super(userBuilder.guid, userBuilder.createdAt, userBuilder.updatedAt);
        this.name =  userBuilder.name;
        this.password =  userBuilder.password;
        this.email =  userBuilder.email;
        this.orders =  userBuilder.orders;
        this.ordersPacks = userBuilder.ordersPacks;
    }
}

export const UserModel = getModelForClass(User);