import express from 'express';
import dotenv from 'dotenv';
import {
    createCourse,
    uploadCourseFiles,
    getAllCourses,
    uploadImageFiles,
    updateCourse,
    publishCourse,
    unpublishCourse,
    checkEnrollment,
    freeEnrollment,
    userCourses,
    getCourseData,
    markIncomplete,
} from '../controllers/course.js';
import hashed from '../controllers/createKey.js';
import {
    isInstructor,
    isAuthenticatedUser,
    isEnrolled,
} from '../middleware/index.js';
import multer, { memoryStorage } from 'multer';

const router = express.Router();

dotenv.config();

const storage = memoryStorage();
const upload = multer({ storage });

// THIS RETURNS ALL THE COURSE
router.get('/courses', getAllCourses);
// Uploading multi course to AWS S3 bucket

router.post(
    '/course/upload-image',
    upload.array('image'),
    // isAuthenticatedUser,
    uploadImageFiles,
);

// CREATE A NEW COURSE

router.post(
    '/course/create',
    upload.array('image'),
    // isAuthenticatedUser,
    isInstructor,
    createCourse,
    uploadImageFiles,
);
// GET DATA OF A SPECIFIC COURSE
router.get('/course/:slug', getCourseData);

// UPDATE THE COURSE
router.put('/course/:slug', updateCourse);
// VIDEO ROUTES ---------------------
router.post('/course/upload-course', upload.array('course'), uploadCourseFiles);
// Publish and Unpublish
router.put('/course/publish/:courseId', publishCourse);

router.put('/course/unpublish/:courseId', unpublishCourse);

// ENROLLMENT
router.get('/check-enrollment/:courseId', checkEnrollment);

router.post('/free-enrollment/:courseId', freeEnrollment);

router.get('/user-courses', userCourses);

router.get('/user/course/:slug', isEnrolled, getCourseData);

// MARK THE LESSON AS COMPLETED
router.post('/mark-incomplete', markIncomplete);

//  Create section

router.post('/hash', hashed.hashedDataWithSecret);
router.get('/check-hash', hashed.getDataWithSecret);
router.get('/check-hash/:course_id/:user_id', hashed.getDataWithUserId);

export default router;
