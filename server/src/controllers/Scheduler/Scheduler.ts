import {scheduleJob, Job, scheduledJobs} from 'node-schedule';
import { OrdersPack } from '../OrdersPack/OrdersPack';
import { Ref } from '@typegoose/typegoose';
import { Emailer } from '../Emailer/Emailer';
import { OrdersPackRepository } from '../OrdersPack/OrdersPack.repository';

/**
 * Interfaz para crear un hashMap de Job en donde la llave
 * sera un string el cual sera el id del OrdersPack el cual estara
 * mapeado a un Job.
 */ 
interface JobMap{
    [key: string] : Job
}

/**
 * Clase Calendarizadora que se encarga de crear los timers para cada ordersPack.
 * 
 * Una vez llega la hora de ejecucion de un OrdersPack esta clase llama a Emailer
 * y envia el email correspondiente.
 */
export class Scheduler{

    private static scheduledJobsMap: JobMap = {};

    /**
     * Calendariza todos los ordersPack que no han expirado.
     */
    public static async initialize(){
        const ordersPacks: OrdersPack[] = await OrdersPackRepository.find();
        for(let ordersPack of ordersPacks){
            if(ordersPack.expirationDate < new Date()){
                Scheduler.scheduleOrdersPack(ordersPack.expirationDate, ordersPack._id);
            }
        }
    }
    /**
     * Crea un evento calendarizado para la fecha de expiracion del ordersPack.
     * Una vez se alcance esta fecha se notificara de la expiracion.
     * 
     * @param expirationDate Fecha de expiracion del OrdersPack
     * @param ordersPack_id Id del ordersPack
     */
    public static scheduleOrdersPack(expirationDate: Date, ordersPack_id: Ref<OrdersPack>){

        const job: Job = scheduleJob(expirationDate, ()=> Scheduler.notifyExpiration(ordersPack_id));
        Scheduler.scheduledJobsMap[ordersPack_id as any] = job;
    }

    /**
     * Envia un email notificando de la llegada a la fecha de expiracion del
     * ordersPack y lo saca del map.
     * 
     * @param ordersPack_id iId del ordersPack
     */
    private static async notifyExpiration(ordersPack_id: Ref<OrdersPack> | string){
        const senderEmail = await Emailer.sendEmailNotification(ordersPack_id);

        for(let registeredOrdesPack_id of Object.keys(scheduleJob)){
            if(registeredOrdesPack_id == ordersPack_id) delete scheduleJob[registeredOrdesPack_id];
        }
    }

    /**
     * Recalendariza el ordersPack cuyo id es pasado como parametro a una nueva fecha.
     * 
     * @param newExpirationDate Nueva fecha de expiracion
     * @param ordersPack_id Id del ordersPack
     */
    public static rescheduleOrdersPack(newExpirationDate: Date, ordersPack_id: Ref<OrdersPack>){
        let job: Job = Scheduler.scheduledJobsMap[ordersPack_id as any];
        if(job){
            job.cancel();
            job = scheduleJob(newExpirationDate, ()=> Scheduler.notifyExpiration(ordersPack_id));
            Scheduler.scheduledJobsMap[ordersPack_id as any] = job;
        }
    }

    /**
     * Elimina la ejecucion del ordersPack.
     * 
     * @param ordersPack_id Id del ordersPack
     */
    public static removeScheduling(ordersPack_id: Ref<OrdersPack>){
        Scheduler.scheduledJobsMap[ordersPack_id as any].cancel();
        delete Scheduler.scheduledJobsMap[ordersPack_id as any];
    }
}