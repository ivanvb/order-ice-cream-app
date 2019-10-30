import { User } from "../User/User";
import { Order } from "../Order/Order";
import { OrdersPack } from "./OrdersPack";

/**
 * Builder para la clase que representa un OrdersPack.
 * 
 * Esta clase se utiliza para poder aprovechar el patron de diseño Builder.
 */
export class OrdersPackBuilder{
    private _creator: User;
    private _orders: Order[];
    private _expirationDate: Date;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _name: string;

    constructor(creator: User, expirationDate: Date, name: string){
        this._creator = creator;
        this._expirationDate =  expirationDate;
        this._name = name;
    }

    public setOrders(orders: Order[]): OrdersPackBuilder{
        this._orders =  orders;
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

    get createdAt(): Date{
        return this._createdAt;
    }

    get updatedAt(): Date{
        return this._updatedAt;
    }

    get name(): string{
        return this._name;
    }
}