import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose; // Import ObjectId from mongoose



const lessonSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [5, 'Minimum length of title 5 characters'],
      maxlength: [320, 'Your name cannot exceed 320 characters'],
      required: [true, 'Please enter lesson title!'], // Corrected error message
    },
    slug_lesson: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
      minlength: [200, 'Minimum length of content 200 characters'],
    },
    video: String,
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);


const sectionSchema = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: [5, 'Minimum length of title 5 characters'],
    maxlength: [320, 'Title cannot exceed 320 characters'],
    required: [true, 'Please enter section title!'],
  },
  slug_section: {
    type: String,
    lowercase: true,
  },
  lessons: [lessonSchema],
  // completed: {type:Boolean, default: false}

});

const courseSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [5, 'Minimum length of name 5 characters'], // Corrected error message
      maxlength: [320, 'Your name cannot exceed 320 characters'],
      required: [true, 'Please enter course name!'], // Corrected error message
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: {},
      minlength: [200, 'Minimum length of description 200 characters'],
      required: [true, 'Please enter course description!'], // Corrected error message
    },
    price: {
      type: Number,
      default: 9.99,
    },
    image: String,
    // imagePresignedUrl: {},
    category: String,
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: String,
      ref: 'User',
      // required: true,
    },
    sections: [sectionSchema],
    whatYoullLearn: String, // Add "What you'll learn" field as an array of strings
    requirements: String, // Add "Requirements" field as an array of strings
    courseDescription: String, // Add "Description" field
    targetAudience: String, // Add "Who this course is for" fiel
  },
  { timestamps: true },
);

export const Course = mongoose.model('Course', courseSchema);
