import { Request, Response } from "express";
import { UserRepository } from '../controllers/User/User.repository';
import { User } from "../controllers/User/User";
import { OrdersPack } from "../controllers/OrdersPack/OrdersPack";
import { OrdersPackBuilder } from "../controllers/OrdersPack/OrdersPack.builder";
import { OrdersPackRepository } from "../controllers/OrdersPack/OrdersPack.repository";

export class OrdersPackRoutesController{

    public static async createOrdersPack(req: Request, res: Response): Promise<void>{
        const {userGuid, name, expirationDate} = req.body;
        const user: User = await UserRepository.findOne(userGuid);

        const ordersPack: OrdersPack =  new OrdersPackBuilder(user, new Date(expirationDate), name).build();
        const savedOrdersPack: OrdersPack = await OrdersPackRepository.save(ordersPack);
        const saved: boolean  = await UserRepository.addOrdersPack(user, savedOrdersPack);

        res.send({guid: ordersPack.id})
    }

    public static async updateOrdersPack(req: Request, res: Response): Promise<void>{
        const {newExpirationDate, deleteArray, ordersPackId} = req.body;
        
        if(newExpirationDate){
            console.log(newExpirationDate);
            const newDate: Date =  new Date(Number(newExpirationDate));
            OrdersPackRepository.addTime(newDate, ordersPackId);
        }

        if(deleteArray){
            OrdersPackRepository.deleteOrders(deleteArray, ordersPackId);
        }
        res.sendStatus(200);
    }
}