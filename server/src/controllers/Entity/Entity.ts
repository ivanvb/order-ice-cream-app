import { prop, getModelForClass, Ref} from '@typegoose/typegoose';
import { Order } from '../Order/Order';
import { OrdersPack } from '../OrdersPack/OrdersPack';
import { User } from '../User/User';

export class Entity{

    public _id: Ref<Order&OrdersPack&User>;
    @prop()
    public createdAt: Date;
    @prop()
    public updatedAt: Date;

    constructor(createdAt: Date, updatedAt: Date) {
        this.createdAt = (createdAt ? createdAt : new Date());
        this.updatedAt = (updatedAt ? updatedAt : this.createdAt);
     }
}

export const EntityModel = getModelForClass(Entity);