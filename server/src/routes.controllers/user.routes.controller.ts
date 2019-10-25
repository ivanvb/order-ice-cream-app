import { Request, Response } from 'express';

export class UserRoutesController {

    public static async logIn(req: Request, res: Response): Promise<void>{
        res.send("Logged in")
    }
}