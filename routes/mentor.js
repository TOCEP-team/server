import express from 'express';
import {
  createMentor,
  updateMentor,
  deleteMentor,
  getMentorById,
  getAllMentors,
} from '../controllers/mentor.js';

const router = express.Router();

router.post('/mentor/create', createMentor);
router.get('/mentor/:mentor_id', getMentorById);

router.get('/mentors', getAllMentors);

router.delete('/mentor/delete/:mentor_id', deleteMentor);

router.put('/mentor/update/:mentor_id', updateMentor);

export default router;
