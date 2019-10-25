import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    ordersPacks: [{type: mongoose.Schema.Types.ObjectId, ref: 'OrdersPack'}],
    guid: String,
    createdAt: Date,
    updatedAt: Date
})

export const userModel = mongoose.model('User', UserSchema);