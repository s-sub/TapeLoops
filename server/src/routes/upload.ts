/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import express from 'express';
// import songsService from '../services/songlistService';
// import { SongEntry } from '../types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { PassThrough, pipeline } = require('stream');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { Readable } = require('stream');
// import { Blob } from "buffer";
// import Audiofile from '../models/audiofiles';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
// import { Upload } from "@aws-sdk/lib-storage";
import { UploadedFile } from 'express-fileupload';
import { PutObjectCommand } from '@aws-sdk/client-s3';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { S3Client} = require("@aws-sdk/client-s3");

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();

const accesskey: string = process.env.S3_ACCESS_KEY_ID as string;
const secret: string = process.env.SECRET_ACCESS_KEY as string;
const bucketname: string = process.env.BUCKET_NAME as string;


const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: accesskey,
    secretAccessKey: secret
  }
});

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/:name', async (req, res) => {

    try {
      if (!req.files || !req.files.file) {
        throw new Error('No files were uploaded.');
      }
      else {
        const filebuffer = req.files.file as UploadedFile;
        // const blobbuffer = Readable.from(filebuffer.data);

        await client.send(new PutObjectCommand({
          Bucket: bucketname,
          Key: req.params.name,
          Body: filebuffer.data,
          ContentType: 'audio/mp3'
        }));
      console.log(
      "Successfully uploaded object: " +
        bucketname +
        "/" +
        req.params.name
      );
      }
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }



  });

export default router;