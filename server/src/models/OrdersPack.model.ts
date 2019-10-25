import mongoose from 'mongoose';

const OrdersPackSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    creator: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    expirationDate: Date,
    guid: String,
    createdAt: Date,
    updatedAt: Date
})

export const ordersPackModel = mongoose.model('OrdersPack', OrdersPackSchema);