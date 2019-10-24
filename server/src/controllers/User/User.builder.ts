import {User} from './User';
import {Guid} from '../Entity/Guid';
import { Order } from '../Order/Order';

export class UserBuilder{

    private _name: String;
    private _email: String;
    private _password: String;
    private _orders: Order[];
    private _ordersPacks;
    private _guid: Guid;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(name: String, email: String, password: String){
        this._name = name;
        this._email = email;
        this._password = password;
    }

    public setOrders(orders): UserBuilder{
        this._orders = orders;
        return this;
    }

    public setOrdersPacks(ordersPacks): UserBuilder{
        this._ordersPacks = ordersPacks;
        return this;
    }

    public setGuid(guid: Guid): UserBuilder{
        this._guid = guid;
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

    get ordersPacks(){
        return this._ordersPacks;
    }

    get guid(): Guid{
        return this._guid;
    }

    get createdAt(): Date{
        return this._createdAt;
    }

    get updatedAt(): Date{
        return this._updatedAt;
    }
}