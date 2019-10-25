import mongoose from 'mongoose';

const OrderSchema: mongoose.Schema = new mongoose.Schema({
    description: String,
    price: Number,
    paymentMethod: Number,
    payed: Boolean,
    guid: {type: String, unique: true},
    createdAt: Date,
    updatedAt: Date
})

export const orderModel =  mongoose.model('Order', OrderSchema);