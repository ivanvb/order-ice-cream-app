import {Guid} from './Guid'

export class Entity{

    public id: Guid;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(id: Guid, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.createdAt = (createdAt ? createdAt : new Date());
        this.updatedAt = (updatedAt ? updatedAt : this.createdAt);
     }
}