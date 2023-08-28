
import mongoose from 'mongoose';

const { Schema } = mongoose;
const completedSchema = new Schema(
  {
    user: {
      type: String,
      ref: 'User',
    },
    course: {
      type: String,
      ref: 'Course',
    },
    sections: [],
  },
  { timestamps: true },
);
export const Completed = mongoose.model('Completed', completedSchema);
