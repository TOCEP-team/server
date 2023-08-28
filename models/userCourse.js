import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const secretSchema = new Schema(
    {
        course_id: {
            type: String,
        },
        user_id: String,
        hash_secret: String,
        hashed_sent: {
            type: String,
            default: '',
        },
        sectionCompleted: { type: [String], default: [] },
    },
    { timestamps: true },
);

export const Secret = mongoose.model('Secret', secretSchema);
