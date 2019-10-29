import { Order, OrderModel } from "./Order";
import { Ref } from "@typegoose/typegoose";

export class OrderRepository{
    /**
     * Devuelve todas las ordenes.
     */
    public static async find(): Promise<Order[]>{
        const orders: Order[] = await OrderModel.find();
        return orders;
    }

    /**
     * Busca una orden en la base de datos.
     * @param _id Id de la orden que se quiere obtener.
     */
    public static async findById(_id: String|Ref<Order>): Promise<Order>{
        const order: Order = await OrderModel.findOne({_id: _id});
        return order;
    }

    /**
     * Guarda una orden en la base de datos.
     * @param order Orden que será guardada en la base de datos.
     */
    public static async save(order: Order): Promise<Order>{
        let saved: Order = await OrderModel.create(order);
        return (saved ? saved : null);
    }

    /**
     * Elimina una orden de la base de datos.
     * @param _id Id de la orden que sera eliminada.
     */
    public static async delete(_id: String|Ref<Order>): Promise<boolean>{
        let deleted = await OrderModel.deleteOne({_id: _id});
        return !!deleted;
    }

    /**
     * Edita la información de una orden en la base de datos.
     * 
     * @param order Orden que se va a editar.
     * @param description Descripcion de la orden
     * @param paymentMethod Metodo de pago
     * @param payed Variable que representa si la orden se ha pagado o no.
     * @param price Precio de la orden.
     */
    public static async editOrderInformation(order: Order, description: String, paymentMethod: number, payed: boolean, price: number): Promise<boolean>{
        const updated = await OrderModel.updateOne({_id: order._id}, {
            description: description,
            paymentMethod: paymentMethod,
            payed: payed,
            price: price,
            updatedAt: new Date()
        });

        return !!updated.n;
    }
}