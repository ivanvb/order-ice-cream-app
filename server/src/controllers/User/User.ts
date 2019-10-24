import {Entity} from '../Entity/Entity';
import { UserBuilder } from './User.builder';

export class User extends Entity{

    name: String;
    password: String;
    email: String;
    orders;
    ordersPacks;

    constructor(userBuilder: UserBuilder){
        super(userBuilder.guid, userBuilder.createdAt, userBuilder.updatedAt);
        this.name =  userBuilder.name;
        this.password =  userBuilder.password;
        this.email =  userBuilder.email;
        this.orders =  userBuilder.orders;
        this.ordersPacks = userBuilder.ordersPacks;
    }
}