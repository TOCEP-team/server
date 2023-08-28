import express from 'express';
import sectionImpl from '../controllers/section.js';
import multer, { memoryStorage } from 'multer';

const router = express.Router();

const storage = memoryStorage();
const upload = multer({ storage });
//  SECTION
router.post('/course/:slug/sections', sectionImpl.addSectionToCourse);
router.get('/course/:slug/sections/:slug_section', sectionImpl.getSectionData);
router.get('/course/:slug/sections', sectionImpl.getAllSectionsInCourse);
router.put('/course/:slug/sections/:slug_section', sectionImpl.updateSectionInCourse);
router.delete('/course/:slug/sections/:slug_section', sectionImpl.deleteSectionInCourse);
// LESSON
router.post('/course/:slug/sections/:slug_section/lesson', sectionImpl.addLesson);
router.get(
  '/course/:slug/sections/:slug_section/lesson/:slug_lesson',
  sectionImpl.getLessonBySlug,
);
router.put('/course/:slug/sections/:slug_section/lesson/:slug_lesson', sectionImpl.updateLesson);
router.delete(
  '/course/:slug/sections/:slug_section/lesson/:slug_lesson',
  sectionImpl.deleteLesson,
);

router.post('/list-completed', sectionImpl.getCompletedLessons);
router.post('/sections/completed', sectionImpl.markCompleted);

export default router;
