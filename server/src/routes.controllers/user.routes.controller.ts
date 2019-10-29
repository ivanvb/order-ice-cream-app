import { Request, Response } from 'express';
import { User, UserModel} from '../controllers/User/User'
import { UserRepository } from '../controllers/User/User.repository';
import { UserBuilder } from '../controllers/User/User.builder';
import { Ref } from '@typegoose/typegoose';

export class UserRoutesController {

    /**
     * Hace LogIn a un usuario en base a su email y password.
     * @param req Request
     * @param res Response
     */
    public static async logIn(req: Request, res: Response): Promise<void>{
        const {email, password} = req.body;

        const user: User = await UserRepository.findByEmailAndPassword(email, password);
        const _id: Ref<User> = (user ? user._id : null);

        res.send({_id: _id});
    }

    /**
     * Crea un usuario nuevo en la base de datos.
     * @param req Request
     * @param res Response
     */
    public static async signUp(req: Request, res: Response): Promise<void>{
        const {email, password, name} = req.body;

        const user: User = new UserBuilder(name, email, password).build();
        const saved: Ref<User> = await UserRepository.save(user);

        res.send({saved});
    }
}