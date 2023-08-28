import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_PUBLIC,
    secretAccessKey: process.env.AWS_ACCESS_KEY_PRIVATE,
  },
  region: process.env.REGION, // this is the region that you select in AWS account
});

const getUserKeys = async (prefix) => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.BUCKET,
    Prefix: prefix,
  });

  const { Contents = [] } = await s3.send(command);

  return Contents.sort(
    (a, b) => new Date(b.LastModified) - new Date(a.LastModified),
  ).map((item) => item.Key);
};

export const uploadToS3 = async ({ file, prefix }) => {
  // const fileName = file.originalname;
  // const key = `${prefix}/${uuid}`;
  const key = `${prefix}/${uuid()}`;
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3.send(command);
    return { key };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const getUserPresignedUrls = async (prefix) => {
  try {
    const keys = await getUserKeys(prefix);

    const presignedUrls = await Promise.all(
      keys.map((key) => {
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET,
          Key: key,
        });
        return getSignedUrl(s3, command, { expiresIn: 360000 }); // default
      }),
    );
    return { presignedUrls };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
  });

  try {
    await s3.send(command);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
