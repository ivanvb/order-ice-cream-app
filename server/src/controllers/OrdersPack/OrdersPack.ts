import { User } from "../User/User";
import { Order } from "../Order/Order";
import { Entity } from "../Entity/Entity";
import { OrdersPackBuilder } from "./OrdersPack.builder";
import { prop, arrayProp, getModelForClass, Ref} from '@typegoose/typegoose';

/**
 * Clase representativa de un OrdersPack.
 * 
 * Las propiedades tienen los decoradores '@prop' y '@arrayProp' para modelar
 * esta clase como un documento dentro de MongoDB.
 */
export class OrdersPack extends Entity{

    @prop()
    name: string
    @arrayProp({itemsRef: Order})
    orders: Ref<Order>[];
    @prop({ref: "User"})
    creator: Ref<User>;
    @prop()
    expirationDate: Date;

    constructor(ordersPackBuilder: OrdersPackBuilder){
        super(ordersPackBuilder.createdAt, ordersPackBuilder.updatedAt);
        this.creator = ordersPackBuilder.creator;
        this.expirationDate =  ordersPackBuilder.expirationDate;
        this.name = ordersPackBuilder.name;
    }

    public toString(): string{
        let ordersPackAsString: string = "";
        for(let order of this.orders){
            ordersPackAsString += order.toString() + "<br>";
        }

        return ordersPackAsString;
    }
}

///Exporta el modelo de la clase el cual será utilizado para realizar operaciones con relación a la base de datos.
export const OrdersPackModel = getModelForClass(OrdersPack)