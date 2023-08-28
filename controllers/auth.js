import express from 'express';
import { hashPassword, comparePassword } from '../utils/auth.js';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();
import { v4 as uuid } from 'uuid';

const awsConfig = {
  region: process.env.REGION,
  apiVersion: process.env.EMAIL_FORM,
  accessKeyId: process.env.AWS_ACCESS_KEY_PUBLIC,
  secretAccessKeyId: process.env.AWS_ACCESS_KEY_PRIVATE,
};

const ses = new AWS.SES(awsConfig);

export const register = async (req, res) => {
  try {
    // Extract user data from the request body
    const { name } = req.body;

    // Check if the user already exists based on the email
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'User with this email already exists.' });
    }

    // Hash the password before saving it to the database
    // const hashedPassword = await hashPassword(password);

    // Create a new user object
    const newUser = new User({
      name,
      email: uuid(),
      // password: hashedPassword,
      // role: role,
    });

    // Save the user object to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error during user registration:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while registering the user.' });
  }
};

export const login = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if our db has user with that name
    const user = await User.findOne({ name }).exec();
    console.log('User : ', user);
    res.status(200).json('oke');
    if (!user) {
      return res.status(400).send('Invalid Name');
    }
  } catch (error) {
    console.log('Error : ', error);
    return res.status(400).send('Error . Try again.');
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({
      message: 'Signout Success',
    });
  } catch (err) {
    console.log('Error : ', err);
    return res.status(400).send('Error . Try again.');
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.name).select('-password').exec();
    console.log('Current User : ', user);
    return res.json({ ok: true });
  } catch (err) {
    console.log('error ( currentUser ) : ', err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Email : ', email);
    const shortCode = nanoid(6).toUpperCase();

    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode },
    );

    console.log('User : ', user);

    if (!user) {
      console.log('No user');
      return res.status(400).send('User not found');
    }
    // prepare for email

    const params = {
      Source: process.env.EMAIL_FORM,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
                          <html>
                             <h1>Reset Password</h1>
                             <p>Use this code to reset your password </p>
                             <h2 style="color:"red">${shortCode}</h2>
                            <i>Elearning-marketplace.com</i>
                            </html>
                            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reset Password',
        },
      },
    };

    const emailSent = ses.sendEmail(params).promise();
    emailSent
      .then((data) => {
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log('error : ', error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const hashedPassword = await hashPassword(newPassword); // Await the hashPassword function
    const user = await User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: '',
      },
    ).exec(); // Execute the query

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or code' });
    }

    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error during reset password:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while processing the request.' });
  }
};
