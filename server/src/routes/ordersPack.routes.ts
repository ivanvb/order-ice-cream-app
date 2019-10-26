import {Router} from 'express';
import {OrdersPackRoutesController} from '../routes.controllers/ordersPack.routes.controller';

class OrdersPackRoutes{
    public router: Router =  Router();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(): void{
        this.router.post("/create", OrdersPackRoutesController.createOrdersPack);
        // this.router.post("/signup", OrdersPackRoutes.signUp);
    }
}

export const ordersPackRoutes: Router = new OrdersPackRoutes().router;