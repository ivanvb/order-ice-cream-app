import { Order, OrderModel } from "./Order";

export class OrderRepository{
    public static async find(): Promise<Order[]>{
        const orders: Order[] = await OrderModel.find();
        return orders;
    }

    public static async findById(guid: String): Promise<Order>{
        const order: Order = await OrderModel.findOne({guid: guid});
        return order;
    }

    public static async save(order: Order): Promise<boolean>{
        let saved: Order = await OrderModel.create(order);
        return !!saved;
    }

    public static async delete(guid: String): Promise<boolean>{
        let deleted = await OrderModel.deleteOne({guid: guid});
        return !!deleted;
    }
}