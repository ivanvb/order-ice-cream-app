import {Router} from 'express';
import {OrderRoutesController} from '../routes.controllers/order.routes.controller';

/**
 * Clase que contiene las rutas para Order.
 */
class OrderRoutes{
    public router: Router =  Router();

    constructor(){
        this.initializeRoutes();
    }

    /**
     * Inicializa las rutas con su respectivo verbo HTTP.
     */
    private initializeRoutes(): void{
        this.router.post("/create", OrderRoutesController.createOrder);
        this.router.put("/edit", OrderRoutesController.editOrder);
        this.router.delete("/", OrderRoutesController.deleteOrder)
    }
}

export const orderRoutes: Router = new OrderRoutes().router;