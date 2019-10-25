import { prop, getModelForClass, buildSchema } from '@typegoose/typegoose';

export class Entity{

    @prop()
    public id: String;
    @prop()
    public createdAt: Date;
    @prop()
    public updatedAt: Date;

    constructor(id: String, createdAt: Date, updatedAt: Date) {
        this.id = (id ? id : this.generateId());
        this.createdAt = (createdAt ? createdAt : new Date());
        this.updatedAt = (updatedAt ? updatedAt : this.createdAt);
     }

     private generateId(): String{
        return new Date().getTime().toString();
     }
}

export const EntityModel = getModelForClass(Entity);