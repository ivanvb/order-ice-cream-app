import { Order } from "./Order";
import { Ref } from "@typegoose/typegoose";
import { User } from "../User/User";

/**
 * Builder para la clase que representa una Orden.
 * 
 * Esta clase se utiliza para poder aprovechar el patron de diseño Builder.
 */
export class OrderBuilder{
    private _description: string;
    private _price: number;
    private _userId: Ref<User>;
    private _payed: boolean;
    private _paymentMethod: PaymentMethod;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(description: string, price: number, user_id: Ref<User>){
        this._description = description;
        this._price = price;
        this._userId = user_id;
    }

    public setPayed(payed: boolean): OrderBuilder{
        this._payed =  payed;
        return this;
    }

    public setCreationDate(createdAt: Date): OrderBuilder{
        this._createdAt = createdAt;
        return this;
    }

    public setUpdateDate(updatedAt: Date): OrderBuilder {
        this._updatedAt = updatedAt;
        return this;
    }

    public setPaymentMethod(paymentMethod: PaymentMethod): OrderBuilder{
        this._paymentMethod =  paymentMethod;
        return this;
    }

    public build(): Order{
        return new Order(this);
    }

    get description(): string{
        return this._description;
    }

    get price(): number{
        return this._price;
    }

    get user_id(): Ref<User>{
        return this._userId;
    }

    get payed(): boolean{
        return this._payed;
    }

    get createdAt(): Date{
        return this._createdAt;
    }

    get updatedAt(): Date{
        return this._updatedAt;
    }

    get paymentMethod(): PaymentMethod{
        return this._paymentMethod;
    }
}

/**
 * Enum que contiene los métodos de pago disponibles.
 */
export enum PaymentMethod{
    TARJETA,
    EFECTIVO
}