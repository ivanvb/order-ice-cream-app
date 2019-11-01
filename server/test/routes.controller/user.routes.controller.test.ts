declare function require(name:string);

import {describe, it} from 'mocha';
import {expect} from 'chai';
const request = require('supertest');
import { User } from '../../src/controllers/User/User';
import { ErrorCodes } from '../../src/controllers/ErrorControllers/ErrorCodeEnum';
import { clearDatabase } from '../index.test';
import { UserRepository } from '../../src/controllers/User/User.repository';
import { UserBuilder } from '../../src/controllers/User/User.builder';
const app = require('../../src/index');

/**
 * Tests relacionados a las operaciones sobre usuarios a través del API.
 */
describe('User Routes Controller', async ()=>{
    ///Valores por defecto para usuarios creados con propositos de test.
    const name =  'newname', password = 'password', email = 'email@email.com';
    ///Antes de cada test limpia la base de datos.
    beforeEach(clearDatabase);

    /**
     * Solicita al servidor la creación de un usuario.
     * Se espera que al buscar el id retornado por el servidor en la base de datos
     * este esté registrado.
     */
    it('Should create a new user when the correct parameters are specified.', async ()=>{
        const res: Response = await request(app)
                                .post('/user/signup')
                                .send({name, password, email})
                                .set('Accept', 'application/json')
                                .expect(200)
        

        const user: User = await UserRepository.findById((<any> res.body).user._id);

        expect(user).to.not.be.null;
    });

    /**
     * Se solicita al servidor crear un nuevo usuario con el campo de email vacío.
     * Se espera que el servidor retorne un error.
     */
    it('Should not create a new user when the correct parameteres are not specified', async()=>{
        await UserRepository.save(new UserBuilder(name, email, password).build());

        const res: Response = await request(app)
                                .post('/user/signup')
                                .send({name, password})
                                .set('Accept', 'application/json')
                                .expect(400);
        
        expect((<any> res.body).code).to.equal(Number(ErrorCodes.INCOMPLETE_INFORMATION));
    });

    /**
     * Se crea un usuario en la base de datos.
     * Se solicita al servidor crear un usuario en la base de datos cuyo campo email
     * es el mismo del usuario que se creo anteriormente.
     * 
     * Se espera que el servidor retorne un error.
     */
    it('Should not create a new user with an already used email', async ()=>{
        await UserRepository.save(new UserBuilder(name, email, password).build());

        const res: Response = await request(app)
                                .post('/user/signup')
                                .send({name, password, email})
                                .set('Accept', 'application/json')
                                .expect(400);

        expect((<any> res.body).code).to.equal(Number(ErrorCodes.DUPLICATED_EMAIL));
    });

    /**
     * Envía una petición al servidor para logearse con un usuario que no ha sido registrado.
     * Se espera que el servidor retorne un error.
     */
    it('Should not login an unregistered user.', async()=>{
        const res: Response = await request(app)
                                .post('/user/login')
                                .send({email, password})
                                .set('Accept', 'application/json')
                                .expect(401);

        expect((<any> res.body).code).to.equal(Number(ErrorCodes.WRONG_CREDENTIALS));
    });

    /**
     * Crea un usuario en la base de datos.
     * Envía una petición al servidor para logearse poniendo una contraseña
     * errónea.
     * Se espera que el servidor retorne un error.
     */
    it('Should not login an user if his login credentials are wrong.', async()=>{
        await UserRepository.save(new UserBuilder(name, email, password).build());

        const res: Response = await request(app)
                                .post('/user/login')
                                .send({email, password: 'failingPassword'})
                                .set('Accept', 'application/json')
                                .expect(401);

        expect((<any> res.body).code).to.equal(Number(ErrorCodes.WRONG_CREDENTIALS));
    });

    /**
     * Crea un usuario en la base de datos.
     * Envía une petición al servidor para logearse con los credenciales correctos.
     * Se espera que el servidor retorne el usuario cuyo email coincide con el
     * email enviado.
     */
    it('Should login a registered user', async()=>{
        await UserRepository.save(new UserBuilder(name, email, password).build());

        const res: Response = await request(app)
                                .post('/user/login')
                                .send({email, password})
                                .set('Accept', 'application/json')
                                .expect(200);

        expect((<any> res.body).user.email).to.equal(email);
    });
})