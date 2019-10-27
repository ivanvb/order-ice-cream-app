import { Request, Response } from "express";
import { UserRepository } from '../controllers/User/User.repository';
import { User } from "../controllers/User/User";
import { OrdersPack } from "../controllers/OrdersPack/OrdersPack";
import { OrdersPackBuilder } from "../controllers/OrdersPack/OrdersPack.builder";
import { OrdersPackRepository } from "../controllers/OrdersPack/OrdersPack.repository";
import { Order } from "../controllers/Order/Order";
import { OrderRepository } from "../controllers/Order/Order.repository";

export class OrdersPackRoutesController{

    public static async createOrdersPack(req: Request, res: Response): Promise<void>{
        const {userGuid, name, expirationDate} = req.body;
        const user: User = await UserRepository.findOne(userGuid);

        const ordersPack: OrdersPack =  new OrdersPackBuilder(user, new Date(Number(expirationDate)), name).build();
        const savedOrdersPack: OrdersPack = await OrdersPackRepository.save(ordersPack);
        const saved: boolean  = await UserRepository.addOrdersPack(user, savedOrdersPack);

        res.send({guid: ordersPack.id})
    }

    public static async updateOrdersPack(req: Request, res: Response): Promise<void>{
        const {newExpirationDate, deleteArray, ordersPackDBId} = req.body;
        
        if(newExpirationDate){
            const newDate: Date =  new Date(Number(newExpirationDate));
            OrdersPackRepository.addTime(newDate, ordersPackDBId);
        }

        if(deleteArray){
            OrdersPackRepository.deleteOrders(deleteArray, ordersPackDBId);
        }
        res.sendStatus(200);
    }

    public static async deleteOrdersPack(req: Request, res: Response): Promise<void>{
        const {ordersPackGuid, userId: userDBId} = req.body;
        const ordersPack: OrdersPack = await OrdersPackRepository.findOne(ordersPackGuid);
        const creator: User = ordersPack.creator as User;
        if(creator && ordersPack && creator._id == userDBId){
            await OrdersPackRepository.delete(ordersPackGuid);

            const orders: Order[] = ordersPack.orders as Order[];
            for(let order of orders){
                await OrderRepository.delete(order.id);
                await UserRepository.deleteOrderFromUser(order.userGuid, order._id);
            }

            await UserRepository.deleteOrdersPackFromUser(creator.id, ordersPack._id);

            res.sendStatus(200);
            return;
        }

        res.sendStatus(400);
    }
}