import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const stakeInfoSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const unstakeInfoSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const poolMetadataSchema = new Schema({
    pool_id: { type: String, required: true },
    title: { type: String },
    owner_id: { type: String, ref: 'User', required: true },
    create_at: { type: Date, default: Date.now },
    pool_state: { type: String, default: 'idle' },
    total_stake: { type: Number, default: 0 },
    current_stake: { type: Number, default: 0 },
    minimum_stake: { type: Number, default: 0 },
    maximum_stake: { type: Number },
    staking_period: { type: Number },
    unstaking_period: { type: Number },
    total_instructors: { type: Number, default: 0 },
    stake_info: [stakeInfoSchema],
    unstake_info: [unstakeInfoSchema],
    description: { type: String },
    image: { type: String },
});

export const Pool = mongoose.model('Pool', poolMetadataSchema);
