import { Request, Response } from "express";
import { UserRepository } from '../controllers/User/User.repository';
import { User } from "../controllers/User/User";
import { OrdersPack } from "../controllers/OrdersPack/OrdersPack";
import { OrdersPackBuilder } from "../controllers/OrdersPack/OrdersPack.builder";
import { OrdersPackRepository } from "../controllers/OrdersPack/OrdersPack.repository";
import { Order } from "../controllers/Order/Order";
import { OrderRepository } from "../controllers/Order/Order.repository";
import { Ref } from "@typegoose/typegoose";

export class OrdersPackRoutesController{

    /**
     * Crea un OrdersPack para el usuario especificado.
     * @param req Request
     * @param res Response
     */
    public static async createOrdersPack(req: Request, res: Response): Promise<void>{
        const {user_id, name, expirationDate} = req.body;
        const user: User = await UserRepository.findOne(user_id);

        const ordersPack: OrdersPack =  new OrdersPackBuilder(user, new Date(Number(expirationDate)), name).build();
        const savedOrdersPack: OrdersPack = await OrdersPackRepository.save(ordersPack);
        const saved: boolean  = await UserRepository.addOrdersPack(user, savedOrdersPack);

        res.send(200)
    }

    /**
     * Actualiza la informacion del un OrdersPack.
     * @param req Request
     * @param res Response
     */
    public static async updateOrdersPack(req: Request, res: Response): Promise<void>{
        const {newExpirationDate, deleteArray, ordersPack_id, user_id} = req.body;
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPack_id);

        if(OrdersPackRoutesController.canUpdateOrdersPack(ordersPack, user_id)){
            if(newExpirationDate){
                const newDate: Date =  new Date(Number(newExpirationDate));
                OrdersPackRepository.updateExpirationDate(newDate, ordersPack_id);
            }
    
            if(deleteArray){
                OrdersPackRepository.deleteOrders(deleteArray, ordersPack_id);
            }
            res.sendStatus(200);
            return;
        }

        res.sendStatus(400);
        
    }

    /**
     * Retorna si el usuario con el id user_id puede editar ordersPack o no.
     * @param ordersPack OrdersPack que se quiere editar
     * @param user_id Id del usuario que quiere editar el OrdersPack.
     */
    private static canUpdateOrdersPack(ordersPack: OrdersPack, user_id: Ref<User>): boolean{
        return(
            ordersPack &&
            ordersPack.creator['_id'] == user_id &&
            ordersPack.expirationDate > new Date()
        );
    }

    /**
     * Elimina un OrdersPack y las referencias a este asi como sus ordenes y todas las referencias a estas.
     * @param req Request
     * @param res Response
     */
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