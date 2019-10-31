export class ExpressError implements NodeJS.ErrnoException{

    public name: string;
    constructor(public message: string, public code: string, public status: number){ }
}