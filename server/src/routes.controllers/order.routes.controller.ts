import { Request, Response } from "express";
import { User } from "../controllers/User/User";
import { UserRepository } from "../controllers/User/User.repository";
import { OrdersPackRepository } from "../controllers/OrdersPack/OrdersPack.repository";
import { Order } from "../controllers/Order/Order";
import { OrderBuilder } from "../controllers/Order/Order.builder";
import { OrderRepository } from "../controllers/Order/Order.repository";
import { OrdersPack } from "../controllers/OrdersPack/OrdersPack";
import { Ref } from "@typegoose/typegoose";

export class OrderRoutesController{

    public static async createOrder(req: Request, res: Response){
        const {ordersPack_id, description, price, user_id, paymentMethod, payed} =  req.body;
        const user: User = await UserRepository.findOne(user_id);
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPack_id);

        const order: Order = new OrderBuilder(description, price, user_id)
                                              .setPaymentMethod(paymentMethod)
                                              .setPayed(payed)
                                              .build();
        
        if(OrderRoutesController.canPlaceOrder(user, ordersPack, user_id)){
            const savedOrder: Order = await OrderRepository.save(order);
            await OrdersPackRepository.addOrder(savedOrder, ordersPack_id);
            await UserRepository.addOrder(user, savedOrder);

            res.sendStatus(200);
        } else {
            res.send({error: "There was an error placing your order."})
        }
    }

    private static canPlaceOrder(user: User, ordersPack: OrdersPack, user_id: Ref<User>): boolean{
        return ( 
            user &&
            ordersPack &&
            !OrderRoutesController.hasPlacedOrder(user_id, ordersPack));
    }

    private static hasPlacedOrder(user_id: Ref<User>, ordersPack: OrdersPack): boolean{
        for(let orderRef of ordersPack.orders){
            let order: Order = orderRef as Order;
            if(order.user_id === user_id){
                return true;
            }
        }

        return false;
    }

    public static async editOrder(req: Request, res: Response):Promise<void>{
        const {order_id, description, payed, price, paymentMethod, user_id} =  req.body;
        const ordersPack: OrdersPack = await OrdersPackRepository.findByOrdersDBId(order_id);
        const order: Order = await OrderRepository.findById(order_id);

        if(OrderRoutesController.canEditOrder(order, ordersPack, user_id)){
            const updated = await OrderRepository.editOrderInformation(order, description, paymentMethod, payed, price);
            res.sendStatus(200);
            return;
        }
        res.sendStatus(400);
    }

    private static canEditOrder(order: Order, ordersPack: OrdersPack, user_id: Ref<User>): boolean{
        return(
            ordersPack &&
            ordersPack.expirationDate > new Date() &&
            order &&
            order.user_id == user_id
        );
    }
}