import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';

import {userRoutes} from './routes/user.routes';
import {ordersPackRoutes} from './routes/ordersPack.routes';
import {orderRoutes} from './routes/order.routes';
import { Scheduler } from "./controllers/Scheduler/Scheduler";
import { ExpressError } from "./controllers/ErrorControllers/ExpressError";

let app: express.Application = express();

/**
 * Punto de entrada de la aplicación.
 */
(async function main(){

    ///Se carga la configuración provista en el archivo .env
    dotenv.config();

    ///Se conecta a la base de datos del ambiente de desarrollo especificado.
    mongoose.connect(
        (process.argv.includes('--prod') ? process.env.DATABASE_URL : process.env.TEST_DATABASE_URL), 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

    Scheduler.initialize();

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    const port: number = Number(process.env.PORT) || 3000;
    app.listen(port);

    app.use(express.static(path.join(path.resolve(__dirname, '..', '..', '..'), '/client/build/')));
    app.use('/user', userRoutes);
    app.use('/ordersPack', ordersPackRoutes);
    app.use('/order', orderRoutes);

    app.get('*', (req: express.Request, res: express.Response) =>{
        res.sendFile(path.join(path.resolve(__dirname, '..', '..', '..'), '/client/build/index.html'));
    });

    ///Error handling middleware.
    app.use(function(error: ExpressError, req: express.Request, res: express.Response, next: express.NextFunction){
        res.status(error.status).json({
            code: Number(error.code),
            message: error.message
        });
    })
})();

module.exports = app;
