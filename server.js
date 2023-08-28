import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import courseRouter from './routes/course.js';
import sectionRouter from './routes/section.js';
import mentorRouter from './routes/mentor.js';
import poolRouter from './routes/pool.js';
import coupon from './routes/coupon.js';

import swaggerUi from 'swagger-ui-express'

import YAML from 'yaml'
import fs from 'fs'

dotenv.config();

// DB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('BD CONNECT'))
  .catch((err) => console.log('DB CONNECTION ERR', err));

// create express app

const app = express();
const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)
// apply middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', authRouter);
app.use('/api', courseRouter);
app.use('/api', sectionRouter);
app.use('/api', mentorRouter);
app.use('/api', poolRouter);
app.use('/api',coupon);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is running on port port ${port}`));
