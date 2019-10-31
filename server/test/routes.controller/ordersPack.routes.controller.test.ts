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

describe('OrdersPack Routes Controller', async ()=>{
    let testUser: User;
    const name: string = 'Testpack';
    let expirationDate: Date;

    beforeEach(async ()=>{
        await clearDatabase();
        const user: User = new UserBuilder('test', 'test@email.com', 'pass').build();
        testUser = await UserRepository.save(user);

        expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
    });

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

    it("Should be able to edit ordersPack expiration's time if it has not expired yet.", async ()=>{
        const ordersPack: OrdersPack = await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'test').build());

        const newExpDate: Date = new Date();
        newExpDate.setHours(newExpDate.getHours() + 23);

        const res: Response = await request(app)
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

    it("Should be able to remove orders from an ordersPack if the creator wants to do so.", async ()=>{
        const secondUser = await UserRepository.save(new UserBuilder('name', 'email', 'password').build());
        const order: Order = await OrderRepository.save(new OrderBuilder('test order', 100, secondUser._id).build());
        const ordersPack: OrdersPack = await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'List').build());

        await OrdersPackRepository.addOrder(order, ordersPack._id);

        const res: Response = await request(app)
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

    it("Should remove an ordersPack if the creator wants to.", async ()=>{
        const secondUser = await UserRepository.save(new UserBuilder('name', 'email', 'password').build());
        const order: Order = await OrderRepository.save(new OrderBuilder('test order', 100, secondUser._id).build());
        const ordersPack: OrdersPack = await OrdersPackRepository.save(new OrdersPackBuilder(testUser, expirationDate, 'List').build());

        await OrdersPackRepository.addOrder(order, ordersPack._id);

        const res: Response = await request(app)
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
})