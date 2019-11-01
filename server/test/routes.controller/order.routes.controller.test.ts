import {describe, it} from 'mocha';
import {expect} from 'chai';
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
const request = require('supertest');
const app = require('../../src/index');

/**
 * Tests relacionados a las operaciones sobre ordenes a través del API.
 */
describe('Order Routes Controller', async ()=>{
    ///usuario y ordersPack de prueba.
    let ordersPack_creator: User, created_ordersPack: OrdersPack;
    ///Parametros por defecto para ordenes creadas para tests.
    const description = 'Helado grande';
    const price = 100;

    /**
     * Antes de cada test limpia la base de datos y crea un usuario y un
     * ordersPack a nombre de este usuario.
     */
    beforeEach(async ()=>{
        await clearDatabase();
        const user: User = new UserBuilder('test name', 'test@email.com', 'testpass').build();
        ordersPack_creator = await UserRepository.save(user);

        const now = new Date();
        now.setHours(now.getHours() + 1);

        const ordersPack: OrdersPack = new OrdersPackBuilder(ordersPack_creator, now, 'test pack').build();
        created_ordersPack = await OrdersPackRepository.save(ordersPack);
    });

    /**
     * Envia un peticion al servidor de crear una Orden luego verifica en la base
     * de datos que la orden se creó.
     */
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

    /**
     * Crea un usuario y le asigna un ordersPack que expira exactamente cuando se crea, luego
     * envia una peticion al servidor tratando de crear una orden en este ordersPack.
     * Se espera que el servidor retorne un error.
     */
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

    /**
     * Crea y guarda una orden en un ordersPack, luego envia una peticion al servidor
     * para que cree otra orden a nombre del mismo usuario para el mismo ordersPack.
     * Se espera que el servidor retorne un error.
     */
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

    /**
     * Crea una orden y guarda una orden, luego se envia una peticion al servidor
     * para modificar la descripcion.
     */
    it("Should update order if the order's creator wants to update it.", async ()=>{
        const order: Order= new OrderBuilder('description', 123, ordersPack_creator._id).build();
        const saved: Order = await OrderRepository.save(order);

        await request(app)
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

    /**
     * Crea un usuario el cual crea un ordersPack que expira al momento de su creación, dentro
     * de este ordersPack se coloca una orden a través de la base de datos. Luego envía
     * una petición al servidor para modificar la orden recien creada.
     * 
     * Se espera que el servidor retorne un error.
     */
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

    /**
     * Crea una orden dentro de un ordersPack y envia una petición para su modficiacón
     * por parte de un usuario que no es el creador de dicha orden.
     */
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

    /**
     * Crea una orden y sus referencias tanto para el usuario creador como para el ordersPack que
     * la contiene. Luego solicita la eliminación de dicha orden.
     * Se espera que esta orden no aparezca en la base de datos así como ninguna referencia a la misma.
     */
    it("Should delete an order and all its references if the order's creator requests to do so.", async ()=>{
        const order: Order= new OrderBuilder(description, price, ordersPack_creator._id).build();
        const saved: Order = await OrderRepository.save(order);
        await OrdersPackRepository.addOrder(saved, created_ordersPack._id);
        await UserRepository.addOrder(ordersPack_creator, saved);

        await request(app)
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

    /**
     * Crea una orden y sus referencias tanto para el usuario creador como para el ordersPack que
     * la contiene. El ordersPack que contiene la orden es un ordersPack que expira al momento de
     * su creación.
     * 
     * Se espera que al tratar de eliminar esta orden el servidor retorne un error.
     */
    it("Should not delete an order and all its references if the ordersPack has already expired.", async ()=>{
        const savedOrder: Order = await OrderRepository.save(new OrderBuilder(description, price, ordersPack_creator._id).build());
        let savedUser: User = await UserRepository.save(new UserBuilder('name', 'email', 'pass').build());
        let savedOrdersPack: OrdersPack = await OrdersPackRepository.save(
                                                    new OrdersPackBuilder(ordersPack_creator, new Date(), 'test pack').build());

        await OrdersPackRepository.addOrder(savedOrder, savedOrdersPack._id);
        await UserRepository.addOrder(savedUser, savedOrder);

        await request(app)
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