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
        const {ordersPackGuid, description, price, userGuid, paymentMethod, payed} =  req.body;
        const user: User = await UserRepository.findOne(userGuid);
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPackGuid);

        const order: Order = new OrderBuilder(description, price, userGuid)
                                              .setPaymentMethod(paymentMethod)
                                              .setPayed(payed)
                                              .build();
        
        if(OrderRoutesController.canPlaceOrder(user, ordersPack, userGuid)){
            const savedOrder: Order = await OrderRepository.save(order);
            await OrdersPackRepository.addOrder(savedOrder, ordersPackGuid);
            await UserRepository.addOrder(user, savedOrder);

            res.sendStatus(200);
        } else {
            res.send({error: "There was an error placing your order."})
        }
    }

    private static canPlaceOrder(user: User, ordersPack: OrdersPack, userGuid: String): boolean{
        return ( 
            user &&
            ordersPack &&
            !OrderRoutesController.hasPlacedOrder(userGuid, ordersPack));
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

    public static async editOrder(req: Request, res: Response):Promise<void>{
        const {orderDBId, orderGuid, description, payed, price, paymentMethod, userGuid} =  req.body;
        const ordersPack: OrdersPack = await OrdersPackRepository.findByOrdersDBId(orderDBId);
        const order: Order = await OrderRepository.findById(orderGuid);

        if(OrderRoutesController.canEditOrder(order, ordersPack, userGuid)){
            const updated = await OrderRepository.editOrderInformation(order, description, paymentMethod, payed, price);
            res.sendStatus(200);
            return;
        }
        res.sendStatus(400);
    }

    private static canEditOrder(order: Order, ordersPack: OrdersPack, userGuid: String): boolean{
        return(
            ordersPack &&
            ordersPack.expirationDate > new Date() &&
            order &&
            order.userGuid == userGuid
        );
    }
}