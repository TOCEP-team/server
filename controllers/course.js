import {
  getUserPresignedUrls,
  uploadToS3,
  deleteFromS3,
} from '../utils/s3Helper.js'; // Import s3 helper functions
import { Course } from '../models/course.js';
import { User } from '../models/user.js';
import { Completed } from '../models/completed.js';

import slugify from 'slugify';

export const uploadCourseFiles = async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res
      .status(400)
      .json({ message: 'Bad request: Missing files in the request' });
  }

  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const { key, error } = await uploadToS3({
          file,
          prefix: process.env.USER_ID_COURSE,
        });

        if (error) {
          return { error: error.message, key: null };
        }

        return { key };
      }),
    );

    const { presignedUrls, error: urlsError } = await getUserPresignedUrls(
      process.env.USER_ID_COURSE,
    );

    if (urlsError) {
      return res.status(500).json({
        message: 'Error fetching pre-signed URLs',
        error: urlsError.message,
      });
    }

    const response = results.map((result) => {
      const { key } = result;
      const presignedUrl = presignedUrls.find((url) => url.includes(key));
      return { ...result, presignedUrl };
    });

    return res.status(201).json({ message: 'Successfully uploaded', response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadImageFiles = async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res
      .status(400)
      .json({ message: 'Bad request: Missing files in the request' });
  }

  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const { key, error } = await uploadToS3({
          file,
          prefix: process.env.USER_ID_IMAGE,
        });

        if (error) {
          return { error: error.message, key: null };
        }

        return { key };
      }),
    );

    const { presignedUrls, error: urlsError } = await getUserPresignedUrls(
      process.env.USER_ID_IMAGE,
    );

    if (urlsError) {
      return res.status(500).json({
        message: 'Error fetching pre-signed URLs',
        error: urlsError.message,
      });
    }

    const response = results.map((result) => {
      const { key } = result;
      const presignedUrl = presignedUrls.find((url) => url.includes(key));
      return { presignedUrl };
    });

    return res.status(201).json({ message: 'Successfully uploaded', response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeImage = async (req, res) => {
  const { key } = req.body;

  try {
    const success = await deleteFromS3(key);

    if (!success) {
      return res.status(400).json({ message: 'Error deleting file' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.log('Error : ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCourse = async (req, res) => {
  try {
    // Check if the course with that slug already exists
    const alreadyExists = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });

    // IF THE COURSE WITH THAT TITLE ALREADY EXISTS SEND THE ERROR
    if (alreadyExists) {
      return res.status(400).send('Title is taken');
    }

    // NOW CREATING THE COURSE
    const course = await new Course({
      slug: slugify(req.body.name, '_'),
      ...req.body,
    }).save();

    // SENDING BACK THE NEWLY CREATED COURSE
    res.json(course);
  } catch (err) {
    console.log('Error : ', err);
    return res.status(400).send('Course create failed. Try again');
  }
};

export const getCourseData = async (req, res) => {
  console.log('Get single course data----------------- : ');

  try {
    const { slug } = req.params;

    console.log('Slug : ', slug);
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', '_id name')
      .exec();
    console.log('Course : ', course);
    res.json(course);
  } catch (err) {
    console.log('Error : ', err);
    return res.status(401).send('Unauthorized');
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const allPublishedCourses = await Course.find({ published: true })
      .populate('instructor', '_id name')
      .exec();
    res.json(allPublishedCourses);
  } catch (error) {
    console.log('Error : ', error);
    return res.status(400).send('Fetching courses failed');
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).exec();

    const updated = await Course.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec();

    res.json(updated);
  } catch (err) {
    console.log('Error : ', err);
    return res.status(400).send(err.message);
  }
};



export const publishCourse = async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findById(slug).select('instructor').exec();

    const updated = await Course.findByIdAndUpdate(
      slug,
      { published: true },
      { new: true },
    ).exec();

    // Sending the course back after publishing it
    res.json(updated);
  } catch (error) {
    console.log('Error : ', error);
    return res.status(400).send('Publish course failed');
  }
};

export const unpublishCourse = async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findById(slug).select('instructor').exec();

    // Now Unpublish the course
    const updated = await Course.findByIdAndUpdate(
      slug,
      { published: false },
      { new: true },
    ).exec();

    // Sending the course back after Unblushing it
    res.json(updated);
  } catch (error) {
    console.log('Error : ', error);
    return res.status(400).send('Unpublish course failed');
  }
};

export const checkEnrollment = async (req, res) => {
  try {
    const { slug } = req.params;


    // Check if course id is found in user courses array
    let ids = [];

    let length = user.courses && user.courses.length;

    // Get all the courses of this user
    for (let i = 0; i < length; i++) {
      ids.push(user.courses[i].toString());
    }

    console.log('Ids : ', ids);

    res.json({
      status: ids.includes(slug),
      course: await Course.findById(slug).exec(),
    });
  } catch (error) {
    console.log('Error : ', error);
  }
};

export const freeEnrollment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.slug).exec();

    const result = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true },
    ).exec();

    res.json({
      message: 'Congratulation ! You have successfully enrolled! ',
      course,
    });
  } catch (error) {
    console.log('Free Enrollment Error : ', err);
    return res.status(400).send('Enrollment create failed');
  }
};

export const userCourses = async (req, res) => {
  const user = await User.findOne(req.slug).exec();

  console.log('User.courses : ', user.courses);

  // Get all the course in which the user is enrolled (user.courses)
  const courses = await Course.find({ _id: { $in: user.courses } })
    .populate('instructor', '_id name')
    .exec();
  console.log('Courses : ', courses);

  res.json(courses);
};

export const markIncomplete = async (req, res) => {
  try {
    const { slug, lessonId } = req.body;
    const updated = await Completed.findOneAndUpdate(
      {
        user: req.auth._id,
        course: slug,
      },
      {
        $pull: { lessons: lessonId },
      },
    ).exec();

    res.json({ ok: true });
  } catch (error) {
    console.log('Error :', error);
  }
};
