import { Order, OrderModel } from "./Order";
import { Ref } from "@typegoose/typegoose";

export class OrderRepository{
    public static async find(): Promise<Order[]>{
        const orders: Order[] = await OrderModel.find();
        return orders;
    }

    public static async findById(_id: String|Ref<Order>): Promise<Order>{
        const order: Order = await OrderModel.findOne({_id: _id});
        return order;
    }

    public static async save(order: Order): Promise<Order>{
        let saved: Order = await OrderModel.create(order);
        return (saved ? saved : null);
    }

    public static async delete(_id: String|Ref<Order>): Promise<boolean>{
        let deleted = await OrderModel.deleteOne({_id: _id});
        return !!deleted;
    }

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