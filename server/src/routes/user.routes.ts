import {Router} from 'express';
import {UserRoutesController} from '../routes.controllers/user.routes.controller';

/**
 * Clase que contiene las rutas para Order.
 */
class UserRoutes{
    public router: Router =  Router();

    constructor(){
        this.initializeRoutes();
    }

    /**
     * Inicializa las rutas con su respectivo verbo HTTP.
     */
    private initializeRoutes(): void{
        this.router.post("/login", UserRoutesController.logIn);
        this.router.post("/signup", UserRoutesController.signUp);
    }
}

export const userRoutes: Router = new UserRoutes().router;