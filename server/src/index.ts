import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import {userRoutes} from './routes/user.routes';
import {ordersPackRoutes} from './routes/ordersPack.routes';
import {orderRoutes} from './routes/order.routes';

(async function main(){

    await mongoose.connect("mongodb://localhost:27017/icecream", {useNewUrlParser: true, useUnifiedTopology: true});

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