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
        const {user_id, name, expirationDate} = req.body;
        const user: User = await UserRepository.findOne(user_id);

        const ordersPack: OrdersPack =  new OrdersPackBuilder(user, new Date(Number(expirationDate)), name).build();
        const savedOrdersPack: OrdersPack = await OrdersPackRepository.save(ordersPack);
        const saved: boolean  = await UserRepository.addOrdersPack(user, savedOrdersPack);

        res.send(200)
    }

    public static async updateOrdersPack(req: Request, res: Response): Promise<void>{
        const {newExpirationDate, deleteArray, ordersPack_id} = req.body;
        
        if(newExpirationDate){
            const newDate: Date =  new Date(Number(newExpirationDate));
            OrdersPackRepository.addTime(newDate, ordersPack_id);
        }

        if(deleteArray){
            OrdersPackRepository.deleteOrders(deleteArray, ordersPack_id);
        }
        res.sendStatus(200);
    }

    public static async deleteOrdersPack(req: Request, res: Response): Promise<void>{
        const {ordersPack_id, user_id} = req.body;
        const ordersPack: OrdersPack = await OrdersPackRepository.findOne(ordersPack_id);
        const creator: User = ordersPack.creator as User;
        if(creator && ordersPack && creator._id == user_id){
            await OrdersPackRepository.delete(ordersPack_id);

            const orders: Order[] = ordersPack.orders as Order[];
            for(let order of orders){
                await OrderRepository.delete(order._id);
                await UserRepository.deleteOrderFromUser(order.user_id, order._id);
            }

            await UserRepository.deleteOrdersPackFromUser(creator._id, ordersPack._id);

            res.sendStatus(200);
            return;
        }

        res.sendStatus(400);
    }
}