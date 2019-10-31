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

describe('User Routes Controller', async ()=>{
    const name =  'newname', password = 'password', email = 'email';
    beforeEach(clearDatabase);

    it('Should create a new user when the correct parameters are specified.', async ()=>{
    
        const res: Response = await request(app)
                                .post('/user/signup')
                                .send({name, password, email})
                                .set('Accept', 'application/json')
                                .expect(200)
        

        const user: User = await UserRepository.findById((<any> res.body).user._id);

        expect(user).to.not.be.null;
    });

    it('Should not create a new user when the correct parameteres are not specified', async()=>{
        const user: User = new UserBuilder(name, email, password).build();
        await UserRepository.save(user);

        const res: Response = await request(app)
                                .post('/user/signup')
                                .send({name, password})
                                .set('Accept', 'application/json')
                                .expect(400);
        
        expect((<any> res.body).code).to.equal(Number(ErrorCodes.INCOMPLETE_INFORMATION));
    });

    it('Should not login an unregistered user.', async()=>{
        const res: Response = await request(app)
                                .post('/user/login')
                                .send({email, password})
                                .set('Accept', 'application/json')
                                .expect(401);

        expect((<any> res.body).code).to.equal(Number(ErrorCodes.WRONG_CREDENTIALS));
    });

    it('Should not login an user if his login credentials are wrong.', async()=>{
        const user: User = new UserBuilder(name, email, password).build();
        await UserRepository.save(user);

        const res: Response = await request(app)
                                .post('/user/login')
                                .send({email, password: 'failingPassword'})
                                .set('Accept', 'application/json')
                                .expect(401);

        expect((<any> res.body).code).to.equal(Number(ErrorCodes.WRONG_CREDENTIALS));
    });

    it('Should login a registered user', async()=>{
        const user: User = new UserBuilder(name, email, password).build();
        await UserRepository.save(user);

        const res: Response = await request(app)
                                .post('/user/login')
                                .send({email, password})
                                .set('Accept', 'application/json')
                                .expect(200);

        expect((<any> res.body).user.email).to.equal(email);
    })
})