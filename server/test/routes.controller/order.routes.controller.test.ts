import {describe, it} from 'mocha';
import {expect} from 'chai';
const request = require('supertest');
import { User } from '../../src/controllers/User/User';
import { ErrorCodes } from '../../src/controllers/ErrorControllers/ErrorCodeEnum';
import { clearDatabase } from '../index.test';
import { UserRepository } from '../../src/controllers/User/User.repository';
import { UserBuilder } from '../../src/controllers/User/User.builder';
import { OrdersPack } from '../../src/controllers/OrdersPack/OrdersPack';
import { OrdersPackBuilder } from '../../src/controllers/OrdersPack/OrdersPack.builder';
import { OrdersPackRepository } from '../../src/controllers/OrdersPack/OrdersPack.repository';
import { OrderRepository } from '../../src/controllers/Order/Order.repository';
import { Order } from '../../src/controllers/Order/Order';
import { OrderBuilder, PaymentMethod } from '../../src/controllers/Order/Order.builder';
const app = require('../../src/index');

describe('Order Routes Controller', async ()=>{
    let ordersPack_creator: User, created_ordersPack: OrdersPack;
    const description = 'Helado grande';
    const price = 100;

    beforeEach(async ()=>{
        await clearDatabase();
        const user: User = new UserBuilder('test name', 'test@email.com', 'testpass').build();
        ordersPack_creator = await UserRepository.save(user);

        const now = new Date();
        now.setHours(now.getHours() + 1);

        const ordersPack: OrdersPack = new OrdersPackBuilder(ordersPack_creator, now, 'test pack').build();
        created_ordersPack = await OrdersPackRepository.save(ordersPack);
    });

    it('Should create an order when the correct conditions are met.', async ()=>{
        const res: Response = await request(app)
                                .post('/order/create')
                                .send({
                                    description,
                                    price,
                                    ordersPack_id: created_ordersPack._id,
                                    user_id: ordersPack_creator._id
                                })
                                .set('Accept', 'application/json')
                                .expect(200)
        

        const order: Order= await OrderRepository.findById((<any> res.body).order._id);

        expect(order).to.not.be.null;
    });

    it('Should not create an order if the ordersPack time has expired.', async ()=>{

        const secondUser: User = new UserBuilder('name', 'email', 'pass').build();
        const saved: User = await UserRepository.save(secondUser);

        const ordersPack: OrdersPack = new OrdersPackBuilder(ordersPack_creator, new Date(), 'test pack').build();
        const savedOrdersPack: OrdersPack = await OrdersPackRepository.save(ordersPack);

        const res: Response = await request(app)
                                .post('/order/create')
                                .send({
                                    description,
                                    price,
                                    ordersPack_id: savedOrdersPack._id,
                                    user_id: saved._id
                                })
                                .set('Accept', 'application/json')
                                .expect(400)
        
        expect((<any> res.body).code).to.equal(Number(ErrorCodes.GENERIC_ERROR));
    });

    it('Should not create an order if the user has already placed an order in this ordersPack', async ()=>{

        const order: Order= new OrderBuilder('description', 123, ordersPack_creator._id).build();
        const saved: Order = await OrderRepository.save(order);
        await OrdersPackRepository.addOrder(saved, created_ordersPack._id);

        const res: Response = await request(app)
                                .post('/order/create')
                                .send({
                                    description,
                                    price,
                                    ordersPack_id: created_ordersPack._id,
                                    user_id: ordersPack_creator._id
                                })
                                .set('Accept', 'application/json')
                                .expect(400)
        
        expect((<any> res.body).code).to.equal(Number(ErrorCodes.GENERIC_ERROR));
    });

    it("Should update order if the order's creator wants to update it.", async ()=>{
        const order: Order= new OrderBuilder('description', 123, ordersPack_creator._id).build();
        const saved: Order = await OrderRepository.save(order);

        const res: Response = await request(app)
        .put('/order/edit')
        .send({
            order_id: saved._id,
            description: 'Nueva descripcion',
            price,
            payed: false,
            paymentMethod: PaymentMethod.EFECTIVO,
            ordersPack_id: created_ordersPack._id,
            user_id: ordersPack_creator._id
        })
        .set('Accept', 'application/json')
        .expect(200)
    });

    it("Should not update order if the ordersPack expiration time has been reached.", async ()=>{
        const secondUser: User = new UserBuilder('name', 'email', 'pass').build();
        const savedUser: User = await UserRepository.save(secondUser);

        const ordersPack: OrdersPack = new OrdersPackBuilder(ordersPack_creator, new Date(), 'test pack').build();
        const savedOrdersPack: OrdersPack = await OrdersPackRepository.save(ordersPack);

        const order: Order = new OrderBuilder(description, price, savedUser).build();
        const savedOrder:Order = await OrderRepository.save(order);

        const res: Response = await request(app)
        .put('/order/edit')
        .send({
            order_id: savedOrder._id,
            description: 'Nueva descripcion',
            price,
            payed: false,
            paymentMethod: PaymentMethod.EFECTIVO,
            ordersPack_id: savedOrdersPack._id,
            user_id: savedUser._id
        })
        .set('Accept', 'application/json')
        .expect(400)

        expect((<any> res.body).code).to.equal(Number(ErrorCodes.GENERIC_UPDATE_ERROR));
    });

    it("Should not update order if the requester is not the order's creator", async ()=>{
        const order: Order= new OrderBuilder(description, price, ordersPack_creator._id).build();
        const saved: Order = await OrderRepository.save(order);

        const res: Response = await request(app)
        .put('/order/edit')
        .send({
            order_id: saved._id,
            description: 'Nueva descripcion',
            price,
            payed: false,
            paymentMethod: PaymentMethod.EFECTIVO,
            ordersPack_id: created_ordersPack._id,
            user_id: '8dbad094eaee8d76ecd69573'
        })
        .set('Accept', 'application/json')
        .expect(400)

        expect((<any> res.body).code).to.equal(Number(ErrorCodes.GENERIC_UPDATE_ERROR));
    });

    it("Should delete an order and all its references if the order's creator requests to do so.", async ()=>{
        const order: Order= new OrderBuilder(description, price, ordersPack_creator._id).build();
        const saved: Order = await OrderRepository.save(order);
        await OrdersPackRepository.addOrder(saved, created_ordersPack._id);
        await UserRepository.addOrder(ordersPack_creator, saved);

        const res: Response = await request(app)
        .delete('/order/')
        .send({
            order_id: saved._id,
            ordersPack_id: created_ordersPack._id,
            user_id: ordersPack_creator._id
        })
        .set('Accept', 'application/json')
        .expect(200)

        const foundOrder: Order = await OrderRepository.findById(saved._id);
        ordersPack_creator =  await UserRepository.findById(ordersPack_creator._id);
        created_ordersPack =  await OrdersPackRepository.findById(created_ordersPack._id);

        expect(foundOrder).to.be.null;
        expect((<Array<Order>> ordersPack_creator.orders).length).to.equal(0);
        expect((<Array<Order>> created_ordersPack.orders).length).to.equal(0);
    });

    it("Should not delete an order and all its references if the ordersPack has already expired.", async ()=>{
        const order: Order = new OrderBuilder(description, price, ordersPack_creator._id).build();
        const savedOrder: Order = await OrderRepository.save(order);

        const secondUser: User = new UserBuilder('name', 'email', 'pass').build();
        let savedUser: User = await UserRepository.save(secondUser);

        const ordersPack: OrdersPack = new OrdersPackBuilder(ordersPack_creator, new Date(), 'test pack').build();
        let savedOrdersPack: OrdersPack = await OrdersPackRepository.save(ordersPack);

        await OrdersPackRepository.addOrder(savedOrder, savedOrdersPack._id);
        await UserRepository.addOrder(savedUser, savedOrder);

        const res: Response = await request(app)
        .delete('/order/')
        .send({
            order_id: savedOrder._id,
            ordersPack_id: savedOrdersPack._id,
            user_id: savedUser._id
        })
        .set('Accept', 'application/json')
        .expect(400)

        const foundOrder: Order = await OrderRepository.findById(savedOrder._id);
        savedUser =  await UserRepository.findById(savedUser._id);
        savedOrdersPack =  await OrdersPackRepository.findById(savedOrdersPack._id);

        expect(foundOrder).to.not.be.null;
        expect((<Array<Order>> savedOrdersPack.orders).length).to.equal(1);
        expect((<Array<Order>> savedUser.orders).length).to.equal(1);
    });
});