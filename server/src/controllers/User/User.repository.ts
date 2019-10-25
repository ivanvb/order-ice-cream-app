import {User, UserModel} from './User';

export class UserRepository{

    public static async find(): Promise<User[]>{
        const users = await UserModel.find();
        return users;
    }

    public static async findOne(guid: String): Promise<User>{
        const user: User = await UserModel.findOne({guid: guid});
        return user;
    }

    public static async save(user: User): Promise<String>{
        const saved: User = await UserModel.create(user);
        return (saved ? saved.id : null);
    }

    public static async delete(guid: String): Promise<boolean>{
        const deleted =  await UserModel.deleteOne({guid: guid});
        return !!deleted;
    }

    public static async findByEmailAndPassword(email: String, password: String): Promise<User>{
        const user: User = await UserModel.findOne({email: email, password: password});
        return user;
    } 
}