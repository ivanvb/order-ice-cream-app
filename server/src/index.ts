import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import {userRoutes} from './routes/user.routes';
import {ordersPackRoutes} from './routes/ordersPack.routes';
import {orderRoutes} from './routes/order.routes';
import { OrdersPack } from "./controllers/OrdersPack/OrdersPack";
import { OrdersPackRepository } from "./controllers/OrdersPack/OrdersPack.repository";

(async function main(){

    dotenv.config();
    await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    const op: OrdersPack = await OrdersPackRepository.findOne('5db7486d197f733b6898b7ef');
    console.log(op);

    const app: express.Application = express();

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    const port: number = Number(process.env.PORT) || 3000;
    app.listen(port);

    app.use('/user', userRoutes);
    app.use('/ordersPack', ordersPackRoutes);
    app.use('/order', orderRoutes);
})();