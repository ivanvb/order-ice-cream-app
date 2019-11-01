declare function require(name:string);

import {describe, it} from 'mocha';
import {expect} from 'chai';
const request = require('supertest');
import { User } from '../../src/controllers/User/User';
import { ErrorCodes } from '../../src/controllers/ErrorControllers/ErrorCodeEnum';
import { clearDatabase } from '../index.test';
import { UserRepository } from '../../src/controllers/User/User.repository';
import { UserBuilder } from '../../src/controllers/User/User.builder';
import { OrdersPack } from '../../src/controllers/OrdersPack/OrdersPack';
import { OrdersPackRepository } from '../../src/controllers/OrdersPack/OrdersPack.repository';
import { OrdersPackBuilder } from '../../src/controllers/OrdersPack/OrdersPack.builder';
import { OrderRepository } from '../../src/controllers/Order/Order.repository';
import { OrderBuilder } from '../../src/controllers/Order/Order.builder';
import { Order } from '../../src/controllers/Order/Order';
const app = require('../../src/index');

/**
 * Tests relacionados a las operaciones sobre ordersPacks a través del API.
 */
describe('OrdersPack Routes Controller', async ()=>{
    ///Usuario de prueba.
    let testUser: User;
    ///Parametros por defecto para ordersPack creados para tests.
    const name: string = 'Testpack';
    let expirationDate: Date;

    /**
     * Antes de cada test limpia la base de datos, crea un usuario y pone una
     * fecha de expiración la cual está programada para dentro de una hora.
     */
    beforeEach(async ()=>{
        await clearDatabase();
        const user: User = new UserBuilder('test', 'test@email.com', 'pass').build();
        testUser = await UserRepository.save(user);

        expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
    });

    /**
     * Crea un OrdersPack a través del API, luego verifica que este se haya
     * guardado en la base de datos.
     */
    it('Should create new OrdersPack when specified.', async ()=>{
        const res: Response = await request(app)
                                .post('/ordersPack/create')
                                .send({
                                    name,
                                    expirationDate: expirationDate.getTime(),
                                    user_id: testUser._id
                                })
                                .set('Accept', 'application/json')
                                .expect(200)
        

        const ordersPack: OrdersPack = await OrdersPackRepository.findById((<any> res.body).ordersPack._id);
        expect(ordersPack).to.not.be.null;
    });

    /**
     * Intenta crear un ordersPack que expira en una fecha ya pasada.
     * Se espera que el servidor retorne un error.
     */
    it('Should fail to create new OrdersPack when date is in the past', async ()=>{
        const res: Response = await request(app)
                                .post('/ordersPack/create')
                                .send({
                                    name,
                                    expirationDate: new Date('1990-01-01').getTime(),
                                    user_id: testUser._id
                                })
                                .set('Accept', 'application/json')
                                .expect(400)
        

        expect((<any> res.body).code).to.equal(Number(ErrorCodes.INCORRECT_DATE));
    });

    /**
     * Crea un ordersPack que expira dentro de una hora. Luego envía una petición al servidor
     * para cambiar su fecha de expiración a dentro de 23 horas.
     * 
     * Se espera que la fecha de expiración del ordersPack coincida con el timestamp de dentro
     * de 23 horas.
     */
    it("Should be able to edit ordersPack expiration's time if it has not expired yet.", async ()=>{
        const ordersPack: OrdersPack = await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'test').build());

        const newExpDate: Date = new Date();
        newExpDate.setHours(newExpDate.getHours() + 23);

        await request(app)
        .put('/ordersPack/edit')
        .send({
            ordersPack_id: ordersPack._id,
            newExpirationDate: newExpDate.getTime(),
            user_id: testUser._id
        })
        .set('Accept', 'application/json')
        .expect(200)
        

        const updatedPack: OrdersPack = await OrdersPackRepository.findById(ordersPack._id);
        expect(updatedPack.expirationDate.getTime()).to.equal(newExpDate.getTime());
    });

    /**
     * Crea un usuario, una orden a nombre de este usuario y un ordersPack a nombre de otro usuario.
     * Agrega la order al ordersPack y luego el usuario creador del ordersPack le envía una petición
     * al servidor para remover esta orden de su ordersPack.
     * 
     * Se espera que luego de esta operación esta orden ya no este en la base de datos. 
     */
    it("Should be able to remove orders from an ordersPack if the creator wants to do so.", async ()=>{
        const secondUser = await UserRepository.save(new UserBuilder('name', 'email', 'password').build());
        const order: Order = await OrderRepository.save(new OrderBuilder('test order', 100, secondUser._id).build());
        const ordersPack: OrdersPack = await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'List').build());

        await OrdersPackRepository.addOrder(order, ordersPack._id);

        await request(app)
        .put('/ordersPack/edit')
        .send({
            ordersPack_id: ordersPack._id,
            deleteArray: [order._id],
            user_id: testUser._id
        })
        .set('Accept', 'application/json')
        .expect(200);
        
        const found: Order = await OrderRepository.findById(order._id);
        expect(found).to.be.null;
    });

    /**
     * Crea un usuario y una orden a nombre de este. Luego crea un ordersPack a nombre de otro usuario y añade
     * la orden creada anteriormente a este.
     * Seguidamente el usuario creador del ordersPack solicita que el servidor lo elimine.
     * Se espera que este ordersPack ya no este en la base de datos.
     */
    it("Should remove an ordersPack if the creator wants to.", async ()=>{
        const secondUser = await UserRepository.save(new UserBuilder('name', 'email', 'password').build());
        const order: Order = await OrderRepository.save(new OrderBuilder('test order', 100, secondUser._id).build());
        const ordersPack: OrdersPack = await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'List').build());

        await OrdersPackRepository.addOrder(order, ordersPack._id);

        await request(app)
        .delete('/ordersPack/')
        .send({
            ordersPack_id: ordersPack._id,
            user_id: testUser._id
        })
        .set('Accept', 'application/json')
        .expect(200);
        
        const found: OrdersPack = await OrdersPackRepository.findById(ordersPack._id);
        expect(found).to.be.null;
    });

    /**
     * Crea tres ordersPack a través de la base de datos. Luego se le pide al servidor que envíe una
     * lista con todos los ordersPack.
     * 
     * Se espera que la lista sea de tamaño tres y que el campo 'name' del creador de un ordersPack
     * coincida con el del usuario que lo creó.
     */
    it('Should be able to get all ordersPacks with all their information including who created it.', async ()=>{
        await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'List1').build());
        await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'List2').build());
        await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'List3').build());

        const res: Response = await request(app)
                                .get('/ordersPack/')
                                .set('Accept', 'application/json')
                                .expect(200);

        const ordersPacks: OrdersPack[] = (<any> res.body).ordersPacks;
        const user: User = <User>ordersPacks[1].creator;

        expect(ordersPacks.length).to.equal(3);
        expect(user.name).to.equal(testUser.name);
    })
})