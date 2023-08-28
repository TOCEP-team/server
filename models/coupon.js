'use strict';

import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const couponSchema = new Schema(
    {
        course_id: {
            type: String,
        },
        user_id: String,
        hash_secret: { type: [String], default: [] },
        hash_used: { type: [String], default: [] },
    },
    { timestamps: true },
);
const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
