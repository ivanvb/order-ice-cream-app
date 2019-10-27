import {Router} from 'express';
import {OrderRoutesController} from '../routes.controllers/order.routes.controller';

class OrderRoutes{
    public router: Router =  Router();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(): void{
        this.router.post("/create", OrderRoutesController.createOrder);
        this.router.put("/edit", OrderRoutesController.editOrder);
    }
}

export const orderRoutes: Router = new OrderRoutes().router;