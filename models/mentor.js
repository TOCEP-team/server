import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const mentorSchema = new Schema({
  description: { type: String },
  mentoring_id: { type: String },
  mentoring_owner: { type: String },
  mentoring_title: { type: String },
  price_per_lesson: { type: String },
  image: { type: String },
});

export const Mentor = mongoose.model('Mentor', mentorSchema);
