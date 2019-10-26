import { Request, Response } from "express";
import { User } from "../controllers/User/User";
import { UserRepository } from "../controllers/User/User.repository";
import { OrdersPackRepository } from "../controllers/OrdersPack/OrdersPack.repository";
import { Order } from "../controllers/Order/Order";
import { OrderBuilder } from "../controllers/Order/Order.builder";
import { OrderRepository } from "../controllers/Order/Order.repository";
import { OrdersPack } from "../controllers/OrdersPack/OrdersPack";

export class OrderRoutesController{

    public static async createOrder(req: Request, res: Response){
        const {ordersPackId, description, price, userId, paymentMethod, payed} =  req.body;
        const user: User = await UserRepository.findOne(userId);
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPackId);

        const order: Order = new OrderBuilder(description, price, userId)
                                              .setPaymentMethod(paymentMethod)
                                              .setPayed(payed)
                                              .build();
        
        if(OrderRoutesController.canPlaceOrder(user, ordersPack, userId)){
            const savedOrder: Order = await OrderRepository.save(order);
            await OrdersPackRepository.addOrder(savedOrder, ordersPackId);
            await UserRepository.addOrder(user, savedOrder);

            res.sendStatus(200);
        } else {
            res.send({error: "There was an error placing your order."})
        }
    }

    private static canPlaceOrder(user: User, ordersPack: OrdersPack, userId: String): boolean{
        return ( 
            user &&
            ordersPack &&
            !OrderRoutesController.hasPlacedOrder(userId, ordersPack));
    }

    private static hasPlacedOrder(userGuid: String, ordersPack: OrdersPack): boolean{
        for(let orderRef of ordersPack.orders){
            let order: Order = orderRef as Order;
            if(order.userGuid === userGuid){
                return true;
            }
        }

        return false;
    }
}