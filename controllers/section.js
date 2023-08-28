import { Course } from '../models/course.js';
import { Secret } from '../models/userCourse.js';
import { User } from '../models/user.js';

import slugify from 'slugify';

const sectionImpl = {
    addSectionToCourse: async (req, res) => {
        try {
            const { slug } = req.params;
            const { title } = req.body;

            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const section = {
                title,
                slug_section: slugify(title),
                lessons: [],
            };

            course.sections.push(section);
            await course.save();

            res.status(201).json({
                message: 'Section added successfully',
                section,
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getSectionData: async (req, res) => {
        try {
            const { slug_section, slug } = req.params;

            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const section = course.sections.find(
                (section) => section.slug_section === slug_section,
            );
            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            res.json(section);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllSectionsInCourse: async (req, res) => {
        try {
            const { slug } = req.params;

            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const sections = course.sections;
            res.json(sections);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateSectionInCourse: async (req, res) => {
        try {
            const { slug_section, slug } = req.params;
            const { title } = req.body;

            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const section = course.sections.find(
                (section) => section.slug_section === slug_section,
            );
            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            section.title = title;
            section.slug_section = slugify(title);
            await course.save();

            res.json(section);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteSectionInCourse: async (req, res) => {
        try {
            const { slug, sectionSlug } = req.params;

            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const sectionIndex = course.sections.findIndex(
                (section) => section.slug === sectionSlug,
            );
            if (sectionIndex === -1) {
                return res.status(404).json({ message: 'Section not found' });
            }

            course.sections.splice(sectionIndex, 1);
            await course.save();

            res.json({ message: 'Section deleted successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    addLesson: async (req, res) => {
        try {
            const { slug, slug_section } = req.params;
            const { title, content, video } = req.body;

            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const section = course.sections.find(
                (section) => section.slug_section === slug_section,
            );
            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            // Create lesson and add video info
            const lesson = {
                title,
                content,
                video,
                slug_lesson: slugify(title.toString()),
            };

            // Save the updated lesson object
            section.lessons.push(lesson); // Push lesson to the specific section
            await course.save();

            return res.status(201).json({
                message: 'Successfully uploaded and added lesson',
            });
        } catch (err) {
            console.log('Error:', err);
            return res.status(400).send('Add lesson failed');
        }
    },

    // Controller function to get a lesson by its slug
    getLessonBySlug: async (req, res) => {
        try {
            const { slug, slug_section, slug_lesson } = req.params;

            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const section = course.sections.find(
                (section) => section.slug_section === slug_section,
            );
            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            const lesson = section.lessons.find(
                (lesson) => lesson.slug_lesson === slug_lesson,
            );
            if (!lesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            res.json(lesson);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateLesson: async (req, res) => {
        try {
            const { slug, slug_section, slug_lesson } = req.params;
            const { title, content, video, free_preview } = req.body;
            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const section = course.sections.find(
                (section) => section.slug_section === slug_section,
            );
            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            const lesson = section.lessons.find(
                (lesson) => lesson.slug_lesson === slug_lesson,
            );
            if (!lesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            {
                // Update lesson information
                lesson.title = title;
                lesson.content = content;
                lesson.video = video;
                lesson.free_preview = free_preview;

                await course.save();

                return res.json({ message: 'Lesson updated successfully' });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ message: 'Update Lesson Failed' });
        }
    },

    deleteLesson: async (req, res) => {
        try {
            const { slug, slug_section, slug_lesson } = req.params;

            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const section = course.sections.find(
                (section) => section.slug_section === slug_section,
            );
            if (!section) {
                return res.status(404).json({ message: 'Section not found' });
            }

            const lessonIndex = section.lessons.findIndex(
                (lesson) => lesson.slug_lesson === slug_lesson,
            );
            if (lessonIndex === -1) {
                return res.status(404).json({ message: 'Lesson not found' });
            }
            // Remove the specified lesson from the section
            section.lessons.splice(lessonIndex, 1);
            await course.save();

            return res.json({ message: 'Lesson deleted successfully' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getCompletedLessons: async (req, res) => {
        try {
            const list = await Completed.findOne({
                user: req.auth._id,
                course: req.body.courseId,
            }).exec();

            list && res.json(list.lessons);
        } catch (error) {
            console.log('Error : ', error);
            return res.status(400).send('Error getting completed lesson');
        }
    },

    async markCompleted(req, res) {
        try {
            const { course_id, section_id, user_id } = req.body;

            const course = await Course.findOne({ slug: course_id });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // const section = course.sections.find(
            //     (section) => section.slug_section === slug_section,
            // );
            // if (!section) {
            //     return res.status(404).json({ message: 'Section not found' });
            // }
            const user = await Secret.findOne({ user_id });
            if (!user) {
                return res.status(404).json({ message: 'user not found' });
            }

            const secretDocument = await Secret.findOne({ course_id, user_id });

            // Check if the section has already been completed
            if (
                secretDocument.sectionCompleted.includes(
                    section_id
                )
            ) {
                return res
                    .status(400)
                    .json({ message: 'Section already completed' });
            }

            // Update the sectionCompleted array
            secretDocument.sectionCompleted.push(section_id);
            await secretDocument.save();

            let completedSectionsCount = secretDocument.sectionCompleted.length;

            console.log(completedSectionsCount);
            if (secretDocument) {
                if (completedSectionsCount === course.sections.length) {
                    secretDocument.hashed_sent += secretDocument.hash_secret;
                    secretDocument.hash_secret = '';
                    await secretDocument.save();
                } else {
                    secretDocument.hashed_sent += secretDocument.hash_secret[0];
                    secretDocument.hash_secret =
                        secretDocument.hash_secret.slice(1);
                    await secretDocument.save();
                }
            }
            res.json({ secretDocument });
        } catch (error) {
            console.error('Error marking completed:', error);
            res.status(500).json({
                error: 'An error occurred while marking completed',
            });
        }
    },
};

export default sectionImpl;
