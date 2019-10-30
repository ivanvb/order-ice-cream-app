import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import {userRoutes} from './routes/user.routes';
import {ordersPackRoutes} from './routes/ordersPack.routes';
import {orderRoutes} from './routes/order.routes';
import { Scheduler } from "./controllers/Scheduler/Scheduler";
import { OrdersPack } from "./controllers/OrdersPack/OrdersPack";
import { OrdersPackRepository } from "./controllers/OrdersPack/OrdersPack.repository";


/**
 * Punto de entrada de la aplicación.
 */
(async function main(){

    ///Se carga la configuración provista en el archivo .env
    dotenv.config();
    await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

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