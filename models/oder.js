import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    oderId: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    phonNumber: {
        type: String,
        required: true
    },

    billItems: {
        type: [
            {
                productId: String,
                productName: String,
                Image: String,
                quantity: Number,
                price: Number
            }
        ],
        required: true
    },

    total: {
        type: Number,
        required: true
    }


}, {
    timestamps: true
});
const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;