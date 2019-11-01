import { Request, Response, NextFunction } from 'express';
import { User } from '../controllers/User/User'
import { UserRepository } from '../controllers/User/User.repository';
import { UserBuilder } from '../controllers/User/User.builder';
import { ExpressError } from '../controllers/ErrorControllers/ExpressError';
import { ErrorCodes } from '../controllers/ErrorControllers/ErrorCodeEnum';

/**
 * Clase que contiene los métodos relacionados a OrdersRoute para ser accedidos
 * mediante un API.
 */
export class UserRoutesController {

    /**
     * Hace LogIn a un usuario en base a su email y password.
     * @param req Request
     * @param res Response
     */
    public static async logIn(req: Request, res: Response, next: NextFunction): Promise<void>{
        const {email, password} = req.body;

        const user: User = await UserRepository.findByEmailAndPassword(email, password);
        if(!user) 
            return next(new ExpressError('wrong credentials', ErrorCodes.WRONG_CREDENTIALS,  401));

        res.send({user: user});
    }

    /**
     * Crea un usuario nuevo en la base de datos.
     * @param req Request
     * @param res Response
     */
    public static async signUp(req: Request, res: Response, next: NextFunction): Promise<void>{
        const {email, password, name} = req.body;

        if(!email || !password || !name) return next(new ExpressError('incomplete information', ErrorCodes.INCOMPLETE_INFORMATION, 400));
        
        const user: User = new UserBuilder(name, email, password).build();
        try{
            const savedUser: User =  await UserRepository.save(user) as User;
            res.send({user: savedUser});
        } catch(e){ 
            next(e) 
        }
    }
}