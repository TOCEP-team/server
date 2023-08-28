import { hashData, encryptData } from '../utils/auth.js';
import { Secret } from '../models/userCourse.js';
import dotenv from 'dotenv';
import { Course } from '../models/course.js';
dotenv.config();

const hashed = {
    hashedDataWithSecret: async (req, res) => {
        try {
            const { course_id, user_id } = req.body;

            const hashedData = hashData(course_id, user_id);

            const newSecret = new Secret({
                course_id: course_id,
                user_id: user_id,
                hash_secret: hashedData,
            });

            await newSecret.save();

            const encodedHash = hashData(hashedData, process.env.SECRET_KEY);

            return res.status(200).json({ encodedHash, newSecret });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred.' });
        }
    },
    getDataWithSecret: async (req, res) => {
        try {
            const { course_id, user_id } = req.body;
            const data = await Secret.findOne({ course_id,user_id }).exec();
            console.log(data);
            res.json(data);
        } catch (error) {
            console.log('Error : ', error);
            return res.status(400).send('Fetching courses failed');
        }
    },

    getDataWithUserId: async (req, res) => {
        try {
            const { course_id, user_id } = req.params;
            const data = await Secret.findOne({ course_id, user_id }).exec();

            if (!data) {
                return res.status(404).json({ message: 'Data not found' });
            }
            console.log(data);
            res.json(data);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

export default hashed;
