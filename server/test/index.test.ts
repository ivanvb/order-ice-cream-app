import {before} from 'mocha';
import { UserModel } from '../src/controllers/User/User';
import { OrderModel } from '../src/controllers/Order/Order';
import { OrdersPackModel } from '../src/controllers/OrdersPack/OrdersPack';

/**
 * Removes all information of the test database.
 */
export async function clearDatabase(){
    if(!process.argv.includes('--prod')){
        try{
            await UserModel.collection.drop();
        } catch(e){ }
    
        try{
            await OrderModel.collection.drop();
        } catch(e){ }
    
        try{
            await OrdersPackModel.collection.drop();
        }catch(e){ }
    }
}

before(async ()=>{
    clearDatabase();
});

after(async ()=>{
    clearDatabase();
});