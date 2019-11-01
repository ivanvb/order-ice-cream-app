import {Router} from 'express';
import {OrdersPackRoutesController} from '../routes.controllers/ordersPack.routes.controller';

/**
 * Clase que contiene las rutas para Order.
 */
class OrdersPackRoutes{
    public router: Router =  Router();

    constructor(){
        this.initializeRoutes();
    }

    /**
     * Inicializa las rutas con su respectivo verbo HTTP.
     */
    private initializeRoutes(): void{
        this.router.post("/create", OrdersPackRoutesController.createOrdersPack);
        this.router.put("/edit", OrdersPackRoutesController.updateOrdersPack);
        this.router.delete("/", OrdersPackRoutesController.deleteOrdersPack);
    }
}

export const ordersPackRoutes: Router = new OrdersPackRoutes().router;