import {OrdersPack, OrdersPackModel} from './OrdersPack';

export class OrdersPackRepository{

    public static async find(): Promise<OrdersPack[]>{
        const ordersPack = await OrdersPackModel.find();
        return ordersPack;
    }

    public static async findOne(guid: String): Promise<OrdersPack>{
        const ordersPack: OrdersPack = await OrdersPackModel.findOne({guid: guid});
        return ordersPack;
    }

    public static async save(ordersPack: OrdersPack): Promise<boolean>{
        const saved = await OrdersPackModel.create(ordersPack);
        return !!saved;
    }

    public static async delete(guid: String): Promise<boolean>{
        const deleted =  await OrdersPackModel.deleteOne({guid: guid});
        return !!deleted;
    }
}