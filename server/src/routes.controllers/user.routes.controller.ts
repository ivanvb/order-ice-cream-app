import { Request, Response } from 'express';
import { User, UserModel} from '../controllers/User/User'
import { UserRepository } from '../controllers/User/User.repository';
import { UserBuilder } from '../controllers/User/User.builder';

export class UserRoutesController {

    public static async logIn(req: Request, res: Response): Promise<void>{
        const {email, password} = req.body;

        const user: User = await UserRepository.findByEmailAndPassword(email, password);
        const guid: String = (user ? user.id : null);

        res.send({guid: guid});
    }

    public static async signUp(req: Request, res: Response): Promise<void>{
        const {email, password, name} = req.body;

        const user: User = new UserBuilder(name, email, password).build();
        const saved: String = await UserRepository.save(user);

        res.send({saved});
    }
}