import {Router} from 'express';
import {OrdersPackRoutesController} from '../routes.controllers/ordersPack.routes.controller';

class OrdersPackRoutes{
    public router: Router =  Router();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(): void{
        this.router.post("/create", OrdersPackRoutesController.createOrdersPack);
        this.router.put("/edit", OrdersPackRoutesController.updateOrdersPack);
        this.router.delete("/", OrdersPackRoutesController.deleteOrdersPack);
    }
}

export const ordersPackRoutes: Router = new OrdersPackRoutes().router;