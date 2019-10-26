import { Order, OrderModel } from "./Order";

export class OrderRepository{
    public static async find(): Promise<Order[]>{
        const orders: Order[] = await OrderModel.find();
        return orders;
    }

    public static async findById(guid: String): Promise<Order>{
        const order: Order = await OrderModel.findOne({id: guid});
        return order;
    }

    public static async save(order: Order): Promise<Order>{
        let saved: Order = await OrderModel.create(order);
        return (saved ? saved : null);
    }

    public static async delete(guid: String): Promise<boolean>{
        let deleted = await OrderModel.deleteOne({id: guid});
        return !!deleted;
    }
}