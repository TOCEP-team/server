import { Mentor } from '../models/mentor.js';
import slugify from 'slugify';

export const createMentor = async (req, res) => {
  try {
    const { mentoring_title, mentoring_owner } = req.body;
    const mentoring_id = `mentoring_${mentoring_title}_${
      mentoring_owner.split('.')[0]
    }`;

    const newMentor = new Mentor({
      ...req.body,
      mentoring_id: slugify(mentoring_id, '_').toLowerCase(),
    });
    const savedMentor = await newMentor.save();
    res.status(201).json(savedMentor);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create mentor' });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.params.mentorId,
      req.body,
      { new: true },
    );
    res.json(updatedMentor);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update mentor' });
  }
};

export const deleteMentor = async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.mentorId);
    res.json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete mentor' });
  }
};

export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findOne(req.params.mentorId);
    res.json(mentor);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get mentor' });
  }
};

export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get mentors' });
  }
};
