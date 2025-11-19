// /models/reviews.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
    {
        name: { type: String, trim: true, default: 'Anonymous' },
        product: { type: String, required: true, index: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, trim: true, default: '' },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved'
        },
        helpfulCount: { type: Number, default: 0 },
        meta: { type: Schema.Types.Mixed }
    },
    { timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);
