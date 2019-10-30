import { OrdersPack } from "../OrdersPack/OrdersPack";
import { Ref } from "@typegoose/typegoose";
import { OrdersPackRepository } from "../OrdersPack/OrdersPack.repository";
import { Order } from "../Order/Order";
import { User } from "../User/User";
import { UserRepository } from "../User/User.repository";
import { createTransport, Transporter } from 'nodemailer';

/**
 * Clase encargada de enviar correos notificando la orden.
 */
export class Emailer{

    /**
     * Elige un usuario al azar dentro de la lista de usuarios que han registrado
     * ordenes en este ordersPack y le informa que debe hacer el pedido de la orden.
     * 
     * @param ordersPack_id Id del ordersPack que sera pedido.
     */
    public static async sendEmailNotification(ordersPack_id: Ref<OrdersPack> | string){
        const receiver = await Emailer.pickEmailReceiver(ordersPack_id);
        const ordersPack: OrdersPack = await OrdersPackRepository.findOne(ordersPack_id);
        Emailer.sendMail(receiver, ordersPack);
    }

    /**
     * Selecciona un usuario aleatorio (dentro de los cuales es posible que salga el creador del
     * ordersPack) para que haga el pedido de todas las ordenes y devuelve su email. 
     * 
     * @param ordersPack_id Id del ordersPack del cual se sacara el email.
     */
    private static async pickEmailReceiver(ordersPack_id: Ref<OrdersPack> | string): Promise<string>{
        const ordersPack: OrdersPack =  await OrdersPackRepository.findOne(ordersPack_id);
        const orders: Order[] = ordersPack.orders as Order[];

        const senderIndex = Math.floor(Math.random() * (1 + orders.length));

        const sender: User = (senderIndex === orders.length) ? 
                             ordersPack.creator as User: 
                             await UserRepository.findOne(orders[senderIndex].user_id);

        return sender.email;
    }

    /**
     * Realiza el envio del emailal usuario elegido para realizar el pedido.
     * 
     * @param receiver Email del usuario que hara el pedido a la heladeria.
     * @param ordersPack OrdersPack que sera pedido.
     */
    public static async sendMail(receiver: string, ordersPack: OrdersPack): Promise<void>{

        const transporter: Transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });


        const mailOptions = {
            from: process.env.EMAIL,
            to: receiver,
            subject: `Ordenes ${ordersPack.name}`,
            html: 
            `
                Saludos,<br><br>
                Ha sido elegido para realizar el pedido de las ordenes correspondientes al paquete ${ordersPack.name}
                el cual incluye las siguientes ordenes:<br>
                <p>${ordersPack.toString()}</p>
                <br><br>
                Pedir a Baskin Robbins<br>
                +18091234567
            `
        }

        transporter.sendMail(mailOptions, (err, info)=>{
            if(err) console.log(err);
            console.log(info);
        })
    }
}