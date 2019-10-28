import {User} from './User';
import { Order } from '../Order/Order';
import { OrdersPack } from '../OrdersPack/OrdersPack';

export class UserBuilder{

    private _name: String;
    private _email: String;
    private _password: String;
    private _orders: Order[];
    private _ordersPacks: OrdersPack[];
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(name: String, email: String, password: String){
        this._name = name;
        this._email = email;
        this._password = password;
    }

    public setOrders(orders: Order[]): UserBuilder{
        this._orders = orders;
        return this;
    }

    public setOrdersPacks(ordersPacks: OrdersPack[]): UserBuilder{
        this._ordersPacks = ordersPacks;
        return this;
    }

    public setCreationDate(createdAt: Date): UserBuilder{
        this._createdAt = createdAt;
        return this;
    }

    public setUpdateDate(updatedAt: Date): UserBuilder{
        this._updatedAt =  updatedAt;
        return this;
    }

    public build(): User{
        return new User(this);
    }

    get name(): String{
        return this._name;
    }

    get password(): String{
        return this._password;
    }

    get email(): String{
        return this._email;
    }

    get orders(): Order[]{
        return this._orders;
    }

    get ordersPacks(): OrdersPack[]{
        return this._ordersPacks;
    }
    
    get createdAt(): Date{
        return this._createdAt;
    }

    get updatedAt(): Date{
        return this._updatedAt;
    }
}