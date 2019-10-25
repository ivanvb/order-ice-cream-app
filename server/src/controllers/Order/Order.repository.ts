// import { Order } from "./Order";
// import { Guid } from "../Entity/Guid";
// import { orderModel } from '../../models/Order.model';
// import { OrderBuilder } from "./Order.builder";

// export class OrderReporsitory{

//     public static async findById(guid: Guid): Promise<Order>{
//         const dbOrder: IOrder = await orderModel.findOne({guid: guid});
//         return this.convertDBOrderToOrder(dbOrder);
//     }

//     private static convertDBOrderToOrder(dbOrder: IOrder): Order{
//         const order: Order = new OrderBuilder(dbOrder.description, dbOrder.price, new Guid(dbOrder.userGuid))
//                                         .setPayed(dbOrder.payed)
//                                         .setCreationDate(dbOrder.createdAt)
//                                         .setUpdateDate(dbOrder.updatedAt)
//                                         .setGuid(new Guid(dbOrder.guid))
//                                         .setPaymentMethod(dbOrder.paymentMethod)
//                                         .build();
        
//         return order;
//     }
// }