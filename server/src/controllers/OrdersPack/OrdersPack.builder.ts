import { User } from "../User/User";
import { Order } from "../Order/Order";
import { Guid } from "../Entity/Guid";
import { OrdersPack } from "./OrdersPack";

export class OrdersPackBuilder{
    private _creator: User;
    private _orders: Order[];
    private _expirationDate: Date;
    private _guid: Guid;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(creator: User, expirationDate: Date){
        this._creator = creator;
        this._expirationDate =  expirationDate;
    }

    public setOrders(orders: Order[]): OrdersPackBuilder{
        this._orders =  orders;
        return this;
    }

    public setGuid(guid: Guid): OrdersPackBuilder{
        this._guid =  guid;
        return this;
    }

    public setCreationDate(createdAt: Date): OrdersPackBuilder{
        this._createdAt = createdAt;
        return this;
    }

    public setUpdateDate(updatetedAt: Date): OrdersPackBuilder{
        this._updatedAt = updatetedAt;
        return this;
    }

    public build(): OrdersPack{
        return new OrdersPack(this);
    }

    get creator(): User{
        return this._creator;
    }

    get orders(): Order[]{
        return this._orders;
    }

    get expirationDate(): Date{
        return this._expirationDate;
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