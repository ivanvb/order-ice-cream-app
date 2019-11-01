import { prop, getModelForClass, Ref} from '@typegoose/typegoose';
import { Order } from '../Order/Order';
import { OrdersPack } from '../OrdersPack/OrdersPack';
import { User } from '../User/User';

/**
 * Superclase Entity de la cual heredan Order, OrdersPack y User.
 * El campo de Guid se sustituyó por _id para evitar redundancia
 * con el id que genera MongoDB internamente.
 */
export class Entity{

    ///Referencia a el campo _id que genera MongoDB para cada documento.
    public _id: Ref<Order&OrdersPack&User>;
    @prop()
    public createdAt: Date;
    @prop()
    public updatedAt: Date;

    /**
     * Inicializa un objecto de la clase Entity.
     * @param createdAt Fecha de creación
     * @param updatedAt Fecha de actualización
     */
    constructor(createdAt: Date, updatedAt: Date) {
        this.createdAt = (createdAt ? createdAt : new Date());
        this.updatedAt = (updatedAt ? updatedAt : this.createdAt);
     }
}

export const EntityModel = getModelForClass(Entity);